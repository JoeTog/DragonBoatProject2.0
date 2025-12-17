import { _decorator, Component, director, EventTouch, Label, Node, Tween, tween, UIOpacity, Vec2 } from 'cc';
import UserDataManager from '../../Data/UserDataManager';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, TaskType } from '../../Data/Enum';
import { GameDataManager } from '../../Data/GameDatamanager';
import { TsRpc } from '../../Net/TsRpc';
import { ToastManager } from '../UI/ToastManager';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { ResPong } from '../../Net/Shared/protocols/common/ResPong';
import { ReqPing } from '../../Net/Shared/protocols/common/ReqPing';
import { NetManager } from '../../Net/NetManager';
const { ccclass, property } = _decorator;
enum Direction {
    /** 左 */
    LEFT,
    /** 右 */
    RIGHT,
    /** 上 */
    UP,
    /** 下 */
    DOWN,
}

type DirectionDataType = {
    name: string,
    al: number
}

const DirectionDataMap: Map<Direction, DirectionDataType> = new Map([
    [Direction.LEFT, { name: '请开始向左滑动', al: 90 }],
    [Direction.RIGHT, { name: '请开始向右滑动', al: -90 }],
    [Direction.UP, { name: '请开始向上滑动', al: 0 }],
    [Direction.DOWN, { name: '请开始向下滑动', al: 180 }]
])

@ccclass('OperatorRender')
export class OperatorRender extends Component {
    private _slidingAreaNode: Node = null;
    private _taskLabel: Label = null;
    private _directionTipLabel: Label = null;
    private _isShowTask: boolean = false;
    private _slideDirection: Direction = Direction.UP;//当前滑动方向
    private _touchStartPos: Vec2 = null;
    private _touchEndPos: Vec2 = null;
    private _activeTouchId: number = -1; // 当前活跃的触摸点 ID（用于多点触控处理）
    private _needChange: boolean = false;
    private _frequency: number = 20;

    // private diffecote = 50;
    private diffecote: number = 50;//滑动距离 多少就算成功

    //是否有了定时器 有了则不定时
    private IsHaveSchel: boolean = false;

    private _addPowerCount: number = 0;
    private _addPowerLastReset = 0;
    private readonly ADD_POWER_LIMIT = 50;
    private readonly ADD_POWER_WINDOW = 1000; // ms
    private testBtn: Node = null;

    private pingLabel: Label = null;
    private pingSequence: number = 0; // ping 序列号
    private currentPing: number = 0; // 当前 ping 值（毫秒）

    // 触摸超时保护
    private _touchTimeoutCallback: (() => void) | null = null; // 触摸超时回调函数引用
    private readonly TOUCH_TIMEOUT: number = 2000; // 2 秒超时（毫秒）
    //防抖
    private lastSwipeTime: number = 0;




    protected onLoad(): void {

        // console.log('UserInfo.difficulty.frequency =',UserDataManager.Instance.UserInfo.difficulty.frequency);
        // if (UserDataManager.Instance.UserInfo.difficulty.frequency && UserDataManager.Instance.UserInfo.difficulty.frequency > 0) {
        //     this._frequency = UserDataManager.Instance.UserInfo.difficulty.frequency;
        // }


        this._slidingAreaNode = this.node.getChildByName('slidingArea');
        this._taskLabel = this.node.getChildByName('task').getChildByName('label').getComponent(Label);
        this._directionTipLabel = this.node.getChildByName('direction_tip').getChildByName('label').getComponent(Label);
        this._slidingAreaNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._slidingAreaNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._slidingAreaNode.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this._slidingAreaNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        EventManager.Instance.on(EVENT_ENUM.RenderTaskLabel, this.renderTask, this);
        EventManager.Instance.on(EVENT_ENUM.OperatorRenderDirecLabel, this.renderDirecLabel, this);


        //设置 优秀信号的颜色
        const netmanager = NetManager.Instance;
        netmanager.excellentColor = '#ffffff';

        // this.testBtn = this.node.getChildByName('btn');
        // UIButtonUtil.initBtn(this.testBtn, () => {
        //     ToastManager.showToast('交互正常!!!');
        // });
        

    }

    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.RenderTaskLabel, this.renderTask);
        EventManager.Instance.off(EVENT_ENUM.OperatorRenderDirecLabel, this.renderDirecLabel);

        this.detachSlidingAreaListeners();
        this._slidingAreaNode = null;

        // 清理 ping 定时器和触摸超时定时器
        this.clearTouchTimeout();
        this.unscheduleAllCallbacks();
    }

    //参数1 是否为改变方向 参数2 是否为显示完成 默认是显示展示方向
    renderDirecLabel(IsShowDirec: boolean = true, IshowCompelet: boolean = false) {
        if (IshowCompelet) {
            this._directionTipLabel.string = '当前任务已完成,请勿重复滑动';
            return;
        }
        if (!this._directionTipLabel) {
            console.warn('_directionTipLabel 未初始化，无法设置方向提示');
            return;
        }

        let directionData: DirectionDataType = DirectionDataMap.get(this._slideDirection);
        if (!directionData) {
            console.warn('未找到方向数据，slideDirection:', this._slideDirection);
            return;
        }

        this._directionTipLabel.string = directionData.name;
    }

    protected onDisable(): void {
        this.detachSlidingAreaListeners();
    }

    onTouchStart(event: EventTouch) {
        const touchId = event.getID();

        if (!this.isTouchAllowed(touchId, 'start')) {
            return;
        }

        // 检查是否有未完成的触摸（可能是上次触摸没有正常结束）
        if (this._touchStartPos && !this._touchEndPos) {
            console.warn('⚠️ [触摸异常] 检测到未完成的触摸，先清理状态');
            this.resetTouchState();
        }

        // 记录当前触摸点 ID
        this._activeTouchId = touchId;
        this._touchStartPos = event.getLocation();
        this._touchEndPos = null; // 重置结束位置

        this.startTouchTimeout();
    }

    onTouchEnd(event: EventTouch) {
        const touchId = event.getID();

        if (!this.isTouchAllowed(touchId, 'end')) {
            return;
        }

        // 清理超时定时器
        this.clearTouchTimeout();

        this._touchEndPos = event.getLocation();
        this.handleSwipe();

        // 注意：不在这里立即重置状态，因为 addPower() 是异步的
        // 状态重置会在以下情况发生：
        // 1. addPower() 成功/失败/异常时
        // 2. handleSwipe() 中各种提前返回时
        // 3. 滑动距离不足时
        // 如果 handleSwipe() 没有调用 addPower()（比如距离不足），需要在这里重置
        // 但为了安全，我们在 addPower() 的所有分支都重置了状态
    }

    onTouchCancel(event: EventTouch) {
        const touchId = event.getID();

        if (!this.isTouchAllowed(touchId, 'cancel')) {
            return;
        }

        // 清理超时定时器
        this.clearTouchTimeout();

        console.log('⚠️ [滑动处理] 触摸被取消，重置滑动状态');
        this.resetTouchState();
        this.setArrowNode(0, this._slideDirection);
        if (GameDataManager.Instance.TaskType && GameDataManager.Instance.TaskType == TaskType.noned) {
            console.log('❌️ 【滑动处理】任务无效');
            // ToastManager.showToast('操作无效');
            return;
        }
        ToastManager.showToast('滑动幅度过大，超出有效区域');
    }

    onTouchMove(event: EventTouch) {
        // 在移动过程中更新位置（可选，用于实时跟踪）
        // 如果需要在移动过程中就处理滑动，可以在这里实现
        // 目前保持简单，只在 TOUCH_END 时处理
    }

    private isTouchAllowed(touchId: number, phase: 'start' | 'end' | 'cancel'): boolean {
        if (this._activeTouchId !== -1 && this._activeTouchId !== touchId) {
            const phaseText = phase === 'start' ? '检测到新的触摸点' : phase === 'end' ? '收到触摸结束事件' : '收到触摸取消事件';
            console.log(`⚠️ [多点触控] ${phaseText} (ID: ${touchId})，但已有活跃触摸点 (ID: ${this._activeTouchId})，忽略`);
            return false;
        }
        return true;
    }

    private startTouchTimeout(): void {
        this.clearTouchTimeout();

        this._touchTimeoutCallback = () => {
            if (this._touchStartPos && !this._touchEndPos) {
                console.warn(`⚠️ [触摸超时] 触摸开始后 ${this.TOUCH_TIMEOUT}ms 内未收到结束事件，自动清理状态`);
                this.resetTouchState();
            }
            this._touchTimeoutCallback = null;
        };

        this.scheduleOnce(this._touchTimeoutCallback, this.TOUCH_TIMEOUT / 1000);
    }

    private detachSlidingAreaListeners() {
        console.log('滑动监听被取消');
        // 清理超时定时器
        this.clearTouchTimeout();
        // 重置触摸状态
        this.resetTouchState();

        if (this._slidingAreaNode && this._slidingAreaNode.isValid) {
            this._slidingAreaNode.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this._slidingAreaNode.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this._slidingAreaNode.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
            this._slidingAreaNode.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        }
    }

    /**
     * 清理触摸超时定时器
     * 通过 unschedule 取消 scheduleOnce 创建的定时器
     */
    private clearTouchTimeout(): void {
        if (this._touchTimeoutCallback) {
            // 使用 unschedule 取消定时器，需要传入回调函数
            this.unschedule(this._touchTimeoutCallback);
            this._touchTimeoutCallback = null;
        }
    }

    /**
     * 重置触摸状态
     */
    private resetTouchState(): void {
        // 先清空位置，这样超时回调执行时也会发现状态已重置
        const hadActiveTouch = !!this._touchStartPos;
        this._touchStartPos = null;
        this._touchEndPos = null;
        this._activeTouchId = -1; // 重置触摸点 ID
        this.clearTouchTimeout();

        // 如果之前有活跃的触摸，记录日志
        if (hadActiveTouch) {
            console.log('✅ [触摸状态] 触摸状态已重置');
        }
    }

    handleSwipe() {
        // 添加防抖
        const now = Date.now();
        if (now - this.lastSwipeTime < 100) { // 100ms 防抖
            console.log('滑动处理 防抖中，忽略');
            this.resetTouchState();
            return;
        }
        this.lastSwipeTime = now;
        
        // 安全检查：确保触摸位置有效
        if (!this._touchStartPos || !this._touchEndPos) {
            console.warn('⚠️ [滑动处理] 触摸位置无效，忽略滑动', {
                startPos: this._touchStartPos,
                endPos: this._touchEndPos
            });
            this.resetTouchState();
            return;
        }
        console.log("处理滑动事件 InPlaying:" + GameDataManager.Instance.InPlaying + ' tasktype:' + GameDataManager.Instance.TaskType + ' end:' + this._touchEndPos + ' start:' + this._touchStartPos);
        if (!GameDataManager.Instance.InPlaying) {
            console.log('❌️ 【滑动处理】 游戏未开始，忽略滑动');
            this.resetTouchState();
            return;
        }
        const taskType = GameDataManager.Instance.TaskType;
        //判断任务是否已经失败
        if (taskType == TaskType.failed) {
            console.log('❌️ 【滑动处理】任务失败，禁止滑动')
            ToastManager.showToast('您已被淘汰');
            this.resetTouchState();
            return;
        }
        if (taskType == TaskType.rest) {
            console.log('❌️ 【滑动处理】中场休息中，禁止滑动');
            // //增加 判断是否任务完成并处于休息中
            if (GameDataManager.Instance.TaskType == TaskType.rest) {
                this._directionTipLabel.string = '当前任务已完成';
            }
            // ToastManager.showToast('中场休息中');
            this.resetTouchState();
            return;
        }
        if (taskType == TaskType.noned) {
            console.log('❌️ 【滑动处理】任务无效');
            // ToastManager.showToast('操作无效');
            this.resetTouchState();
            return;
        }

        const deltaX = this._touchEndPos.x - this._touchStartPos.x;
        const deltaY = this._touchEndPos.y - this._touchStartPos.y;

        // console.log(`【滑动计算】偏移量: X =${deltaX.toFixed(1)}, Y=${deltaY.toFixed(1)}`);

        //判断滑动阈值
        const threshold = this.diffecote;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                // console.log(`⬆️ [滑动方向] 向右滑动，调用addPower`);
                // 向右滑动的处理
                this.addPower(Direction.RIGHT);
            } else {
                // console.log(`⬆️ [滑动方向] 向zuo滑动，调用addPower`);
                // 向左滑动的处理
                this.addPower(Direction.LEFT);
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                // console.log(`⬆️ [滑动方向] 向上滑动，调用addPower`);
                // 向上滑动的处理
                this.addPower(Direction.UP);
            } else {
                // console.log(`⬇️ [滑动方向] 向下滑动，调用addPower`);
                // 向下滑动的处理
                this.addPower(Direction.DOWN);
            }
        } else {
            ToastManager.showToast('滑动距离过短');
            console.log(`❌ [滑动处理] 滑动距离不足，忽略 (${Math.abs(deltaX)}, ${Math.abs(deltaY)}) < ${threshold}`);
            // 滑动距离不足时也需要重置状态，避免影响下次滑动
            this.resetTouchState();
        }
    }

    //请求增加power
    addPower(dir: Direction) {
        if (!this.canRequestAddPower()) {
            console.warn(`[AddPower] 1秒内请求次数超过 ${this.ADD_POWER_LIMIT} 次，阻止发送`);
            // ToastManager.showToast('操作过快，请稍后重试');
            this.resetTouchState();
            return;
        }
        // 在方法开始时就重置触摸状态，因为触摸位置信息已经不再需要
        // 这样可以避免用户快速滑动时的状态混乱，也能确保所有分支都正确清理状态
        this.resetTouchState();
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法addpower武力');
            ToastManager.showToast('网络连接异常，请稍后重试【addPower】');
            return;
        }

        let isSuccess = this._slideDirection === dir ? 1 : -1;
        this.setArrowNode(isSuccess == -1 ? 2 : 1, this._slideDirection);

        // 记录 API 调用开始时间，用于计算 ping
        const apiStartTime = Date.now();

        TsRpc.Instance.Client.callApi('room/AddPower', { __ssoToken: UserDataManager.Instance.SsoToken, value: isSuccess }).then((data) => {
            // 计算 API 响应时间作为 ping 值
            // const roundTripTime = Date.now() - apiStartTime;
            // this.currentPing = Math.round(roundTripTime);
            // // 更新 ping 显示
            // if (this.pingLabel) {
            //     this.pingLabel.string = `Ping: ${this.currentPing}ms`;
            // }

            if (!data.isSucc) {
                // 提示玩家已经死亡
                console.error('后台返回AddPower失败！玩家淘汰 :', data);
                ToastManager.showToast('后台返回淘汰:' + data.err.message);
                // GameDataManager.Instance.dealRoomDie();
                return;
            }
        }).catch(err => {
            console.error(`🔥 [武力值] API调用异常:`, err);
        });
    }

    private canRequestAddPower(): boolean {
        const now = Date.now();
        if (now - this._addPowerLastReset > this.ADD_POWER_WINDOW) {
            this._addPowerLastReset = now;
            this._addPowerCount = 0;
        }
        if (this._addPowerCount >= this.ADD_POWER_LIMIT) {
            return false;
        }
        this._addPowerCount++;
        console.log(`[AddPower] 当前窗口内第 ${this._addPowerCount} 次请求`);
        return true;
    }

    renderTask(show: boolean, msg?: string, doRandom?: boolean) {
        if (show && doRandom) {
            // 立刻变更一次
            this._needChange = true;

            if (!this.IsHaveSchel) {
                this.IsHaveSchel = true;
                this.schedule(() => {
                    this._needChange = true;
                }, this._frequency)
            }
        }

        if (!show) {
            this.IsHaveSchel = false;
            this.unscheduleAllCallbacks();
            //修复绿色箭头
            // this.setArrowNode(0, this._slideDirection);
        }
        if (show !== this._isShowTask) {
            this._taskLabel.node.parent.active = show;
            this._isShowTask = show;
        }
        this._taskLabel.string = msg;
    }

    /**
    * @param nodeIndex 先选中要操作的节点 0 表示初始 1 表示正确 2表示错误
    * @param angle     箭头朝向
    */
    private setArrowNode(nodeIndex: number, direction: Direction) {
        //获取这个方向的角度
        const angle = DirectionDataMap.get(direction).al;
        const firstChild = this._slidingAreaNode.children[0];
        if (nodeIndex == 0 && firstChild.active && firstChild.angle == angle) {
            //判断如果是0初始 并且first是激活状态 并且方向也是对的 则不动
            return;
        }
        this._slidingAreaNode.children.forEach((nodee, i) => {
            if (i != 0) {
                Tween.stopAllByTarget(nodee);
            }
            //遍历3个 默认、对、错 的node
            //当遍历到指定的某一个状态则 设置透明度为不透明
            if (nodeIndex == i) {
                let uiOpacity = nodee.getComponent(UIOpacity);
                if (!uiOpacity) {
                    uiOpacity = nodee.addComponent(UIOpacity);
                }
                //赋值方向为传入的direction方向
                nodee.angle = angle;
                uiOpacity.opacity = 255;
                //设置节点为active显示
                nodee.active = true;

                if (nodeIndex != 0) {
                    let dir = this._slideDirection;
                    let opacity = uiOpacity;
                    //动画从透明到不透明 显示
                    tween(opacity)
                        .to(0.05, { opacity: 0 })
                        .to(0.05, { opacity: 255 })
                        .call(() => {

                            //修复绿色箭头
                            // if (!GameDataManager.Instance.InPlaying || GameDataManager.Instance.TaskType !== TaskType.active) {
                            //     this.setArrowNode(0, dir);
                            //     return;
                            // }

                            //判断是否需要改变方向，当选中状态可能没办法立即改变方向，处理完事件后判断是否需要更改方向
                            //如果一直不滑动，则一直会显示最后的方向不会改变
                            if (this._needChange) {
                                this.randomDirection();
                            } else {
                                this.setArrowNode(0, dir);
                            }
                        })
                        .start();
                }
            } else {
                // console.error('nodeIndex = ' + nodeIndex + ' i = ' + i);
                // console.warn('nodeIndex = ' + nodeIndex + ' i = ' + i);
                nodee.active = false;
            }
        });
    }

    // 生成随机方向
    randomDirection() {
        this._needChange = false
        //修复绿色箭头
        // if (!GameDataManager.Instance.InPlaying || GameDataManager.Instance.TaskType !== TaskType.active) {
        //     // 任务已结束，强制恢复为灰色
        //     return;
        // }

        const directionArr = [Direction.DOWN, Direction.LEFT, Direction.RIGHT, Direction.UP]
        let randomDir: Direction = directionArr[Math.floor(Math.random() * 4)]
        this._slideDirection = randomDir; // 设置当前方向 用于判断滑动
        let directionData: DirectionDataType = DirectionDataMap.get(randomDir)
        this.setArrowNode(0, randomDir);
        this._directionTipLabel.string = directionData.name;
    }

    update(deltaTime: number) {

    }
}


