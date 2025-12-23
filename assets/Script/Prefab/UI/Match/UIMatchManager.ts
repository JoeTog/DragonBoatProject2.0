import { _decorator, Component, instantiate, Label, Node, Prefab, v3, Vec3, tween, Tween, Sprite, Color, Graphics, UITransform, v2, SpriteFrame } from 'cc';
import EventManager from '../../../Base/EventManager';
import { EVENT_ENUM } from '../../../Data/Enum';
import { UIButtonUtil } from '../../../Base/UIButtonUtil';
import { TsRpc } from '../../../Net/TsRpc';
import UserDataManager from '../../../Data/UserDataManager';
import { ToastManager } from '../ToastManager';
import { TeamInfoManager } from '../../../Data/TeamInfoManager';
import { JoeFunc } from '../../../Base/JoeFunc';
import { GameDataManager } from '../../../Data/GameDatamanager';
import { ITeam } from '../../../Net/Shared/models/Interfaces';
import { IMG_URL_EXTRA_PARAM } from '../../../Config';
import { loadAvatar } from '../../../Base/Utils';
const { ccclass, property } = _decorator;

@ccclass('UIMatchManager')
export class UIMatchManager extends Component {

    @property(Prefab)
    UIMathingPrefabb: Prefab;

    @property(Prefab)
    memberHeadIconCellPrefabb: Prefab;



    private _matchLabel: Node = null;

    private _blueTeamNameeLabel: Label = null;
    private _redTeamNameeLabel: Label = null;

    private _redTeamContent: Node = null;
    private _blueTeamContent: Node = null;

    private _thisMatchNode: Node = null;
    private _thisMatchRootNode: Node = null;

    private _countdownNum = 30;
    private _timeLabel: Node = null;
    private _isMatchLabel: Label = null;

    private _thisCloseMatchNode: Node = null;

    //UI相关
    //点
    private _pointNode: Node = null;
    private _animationTween: Tween<any> | null = null;  // 添加类属性存储动画引用
    private _blueNode: Node = null;
    private _redNode: Node = null;

    private _animationRepeatCount = 1; // 设置动画重复次数
    private _currentRepeat = 0; // 当前重复次数




    start() {

        console.log('UIMatchManager');
        console.log('UIMathingPrefab = ', this.UIMathingPrefabb);
        const matchNode = instantiate(this.UIMathingPrefabb);
        const rootBgNode = matchNode.getChildByName('Root');
        matchNode.children.forEach((child, index) => {
            console.log(`[${index}] ${child.name} (是否激活: ${child.activeInHierarchy})`);
        });
        EventManager.Instance.on(EVENT_ENUM.ShowMatching, this.showMatching, this);
        EventManager.Instance.on(EVENT_ENUM.HideMatching, this.hide, this);
        EventManager.Instance.on(EVENT_ENUM.ShowVs, this.matchedSuccess, this);





    }

    matchedSuccess() {
        //今日使用次数+1
        if (UserDataManager.Instance.UserInfo && UserDataManager.Instance.UserInfo.times) {
            UserDataManager.Instance.UserInfo.times += 1;
            EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo);
        }

        this._matchLabel.getComponent(Label).string = '匹配成功';
        const teamInfo = GameDataManager.Instance.VsTeamInfo;
        if (!teamInfo) {
            console.error('VsTeamInfo is null');
            this.hide();
            return;
        }
        const enemyTeamIndex = GameDataManager.Instance?.EnemyTeamIndex;
        if (enemyTeamIndex === undefined || !teamInfo[enemyTeamIndex]) {
            console.error('Team index or team info is invalid');
            this.hide();
            return;
        }

        const enemyNode = this._thisMatchRootNode.getChildByName('teamAndCountdown').getChildByName('team').getChildByName('red');
        this._redTeamContent = enemyNode.getChildByName('node').getChildByName('rewardScrollV').getChildByName('view').getChildByName('content');
        this.renderInfo(enemyNode, teamInfo[GameDataManager.Instance.EnemyTeamIndex]);

        const VsNode = this._thisMatchRootNode.getChildByName('Vs');
        VsNode.active = true;
        // 动画完成后 通知 展示 游戏
        //隐藏倒计时UI
        this._timeLabel.active = false;

        // 添加匹配标签的动画
        if (this._matchLabel) {
            const originalScale = this._matchLabel.scale.clone();
            this._matchLabel.setScale(0, 0, 1);

            tween(this._matchLabel)
                .to(0.5, { scale: v3(1.5, 1.5, 1) }, { easing: 'backOut' })
                .to(0.3, { scale: v3(1, 1, 1) }, { easing: 'sineOut' })
                .start();
        }

        this.showAnim(this._blueNode, this._redNode, VsNode, () => {
            EventManager.Instance.emit(EVENT_ENUM.ShowPKGame);
        });


    }


    showAnim(myNode: Node, enemyNode: Node, iconNode: Node, onComplete?: () => void) {
        // 动画配置参数
        const animConfig = {
            moveInDuration: 0.6,      // 移入动画时间
            reboundDuration: 0.4,     // 回弹动画时间
            iconScaleDuration: 0.8,   // 增加图标缩放动画时间
            delayBeforeHide: 1.5,     // 隐藏前的延迟
            overshootDistance: 80     // 超过原始位置的距离
        };

        // 保存原始位置
        const myOriginalPos = myNode.position.clone();
        const enemyOriginalPos = enemyNode.position.clone();

        // 计算超过原始位置的位置
        const overshoot = animConfig.overshootDistance;
        const myOvershootX = myOriginalPos.x + overshoot;
        const enemyOvershootX = enemyOriginalPos.x - overshoot;

        const screenWidth = this.node.getComponent(UITransform).width;
        const startOffset = screenWidth * 0.5;

        const playAnimation = () => {
            // 初始位置（屏幕外）
            myNode.setPosition(v3(myOriginalPos.x - startOffset, myOriginalPos.y, myOriginalPos.z));
            enemyNode.setPosition(v3(enemyOriginalPos.x + startOffset, enemyOriginalPos.y, enemyOriginalPos.z));

            // 优化iconNode的缩放动画 - 从0.5开始，使用弹性效果
            iconNode.setScale(v3(0.1, 0.1, 1));  // 从0.1倍开始
            tween(iconNode)
                .to(0.5, {
                    scale: v3(1.5, 1.5, 1)  // 放大到1.5倍
                }, {
                    easing: 'backOut'  // 使用backOut实现回弹效果
                })
                .to(0.3, {
                    scale: v3(1, 1, 1)  // 回到原始大小
                }, {
                    easing: 'sineOut'  // 平滑过渡
                })
                .start();

            // 其他动画代码保持不变...
            tween(myNode)
                .to(animConfig.moveInDuration, {
                    position: v3(myOvershootX, myOriginalPos.y, myOriginalPos.z)
                }, {
                    easing: 'sineOut'
                })
                .to(animConfig.reboundDuration, {
                    position: v3(myOriginalPos.x, myOriginalPos.y, myOriginalPos.z)
                }, {
                    easing: 'elasticOut' as any
                })
                .start();

            // 敌方节点动画序列
            tween(enemyNode)
                .to(animConfig.moveInDuration, {
                    position: v3(enemyOvershootX, enemyOriginalPos.y, enemyOriginalPos.z)
                }, {
                    easing: 'sineOut'
                })
                .to(animConfig.reboundDuration, {
                    position: v3(enemyOriginalPos.x, enemyOriginalPos.y, enemyOriginalPos.z)
                }, {
                    easing: 'elasticOut' as any
                })
                .start();

            // 延迟后执行图标消失动画
            tween(iconNode)
                .delay(animConfig.moveInDuration + animConfig.reboundDuration)
                .to(animConfig.iconScaleDuration, {
                    scale: v3(0, 0, 0)
                }, {
                    easing: 'backIn'
                })
                .call(() => {
                    this._currentRepeat++;
                    if (this._currentRepeat < this._animationRepeatCount) {
                        playAnimation();
                    } else {
                        this._currentRepeat = 0;
                        if (onComplete) onComplete();
                    }
                })
                .start();
        };

        playAnimation();
    }




    private moveAnim(node: Node, toPosX: number, time: number = 1): void {
        // 获取当前位置
        const currentPos = node.position.clone();
        // 创建目标位置
        const targetPos = new Vec3(toPosX, currentPos.y, currentPos.z);

        // 使用Tween系统
        tween(node)
            .to(time, { position: targetPos }, {
                easing: 'elasticInOut'
            })
            .start();
    }

    renderInfo(teamNode: Node, teamInfo) {
        if (!teamNode) {
            console.error('Failed to find team node');
            return;
        }
        const nameLabel = teamNode.getChildByName('nameBg').getChildByName('value').getComponent(Label);
        this._redNode = teamNode.getChildByName('node');
        const teamInfoCount = this._redNode.getChildByName('count');
        teamInfoCount.active = true;
        const teamCountLabel = teamInfoCount.getChildByName('value').getComponent(Label);
        nameLabel.string = teamInfo.name;
        teamCountLabel.string = `${teamInfo.count}/${teamInfo.maxcount}`;

        const avatarUrl = UserDataManager.Instance.UserInfo.user.avatar + IMG_URL_EXTRA_PARAM;
        const blueTeamMembers = Array(3).fill({ iconUrl: avatarUrl });
        for (let index = 0; index < blueTeamMembers.length; index++) {
            const memberHeadIconCellPrefabb = instantiate(this.memberHeadIconCellPrefabb);
            const avatar = memberHeadIconCellPrefabb.getChildByName('avatar').getChildByName('mask').getChildByName('img').getComponent(Sprite);
            loadAvatar(blueTeamMembers[index].iconUrl).then((res: SpriteFrame) => {
                // 检查节点和组件是否仍然有效
                avatar.spriteFrame = res;
            }).catch((err) => {
                console.warn('加载头像失败:', err);
            });
            this._redTeamContent.addChild(memberHeadIconCellPrefabb);
        }





    }


    async showMatching() {

        console.log('show 方法被调用');
        console.log('UIMathingPrefab:', this.UIMathingPrefabb);

        let matchNode = instantiate(this.UIMathingPrefabb);
        console.log('matchNode 类型:', typeof matchNode);
        console.log('matchNode 值:', matchNode);

        // 检查 matchNode 的原型链
        // console.log('matchNode 原型:', Object.getPrototypeOf(matchNode));

        // 如果已经存在匹配节点，先销毁
        if (this._thisMatchNode && this._thisMatchNode.isValid) {
            this.hide(); // 或者直接销毁
        }
        matchNode = instantiate(this.UIMathingPrefabb);
        const rootBgNode = matchNode.getChildByName('Root').getChildByName('bg');
        this._thisMatchRootNode = rootBgNode;
        this._thisMatchNode = matchNode;
        this._thisCloseMatchNode = matchNode.getChildByName('Root').getChildByName('close');
        this._matchLabel = rootBgNode.getChildByName('teamAndCountdown').getChildByName('countDown').getChildByName('label');
        this._timeLabel = rootBgNode.getChildByName('teamAndCountdown').getChildByName('countDown').getChildByName('value');
        this._pointNode = rootBgNode.getChildByName('Mask').getChildByName('point');
        const myTeamNode = rootBgNode.getChildByName('teamAndCountdown').getChildByName('team').getChildByName('blue');
        this._blueTeamContent = myTeamNode.getChildByName('node').getChildByName('rewardScrollV').getChildByName('view').getChildByName('content');
        console.log('_blueTeamContent = ', this._blueTeamContent);
        const teamInfo = TeamInfoManager.Instance.TeamInfo;
        if (!teamInfo) {
            console.error('VsTeamInfo is null');
            this.hide();
            return;
        }
        const avatarUrl = UserDataManager.Instance.UserInfo.user.avatar + IMG_URL_EXTRA_PARAM;
        const blueTeamMembers = Array(3).fill({ iconUrl: avatarUrl });
        for (let index = 0; index < blueTeamMembers.length; index++) {
            const memberHeadIconCellPrefabb = instantiate(this.memberHeadIconCellPrefabb);
            const avatar = memberHeadIconCellPrefabb.getChildByName('avatar').getChildByName('mask').getChildByName('img').getComponent(Sprite);
            loadAvatar(blueTeamMembers[index].iconUrl).then((res: SpriteFrame) => {
                // 检查节点和组件是否仍然有效
                avatar.spriteFrame = res;
            }).catch((err) => {
                console.warn('加载头像失败:', err);
            });
            this._blueTeamContent.addChild(memberHeadIconCellPrefabb);
        }
        // const teamNode = rootBgNode.getChildByName('teamAndCountdown').getChildByName('team').getChildByName('blue');
        const nameLabel = myTeamNode.getChildByName('nameBg').getChildByName('value').getComponent(Label);
        this._blueNode = myTeamNode.getChildByName('node');
        const teamCountLabel = this._blueNode.getChildByName('count').getChildByName('value').getComponent(Label);
        nameLabel.string = teamInfo.name;
        teamCountLabel.string = `${teamInfo.playersCount}/${teamInfo.maxCount}`;

        this.countDownTime();
        this._matchLabel.getComponent(Label).string = '匹配中';
        this._timeLabel.getComponent(Label).string = this._countdownNum + 's';
        let isCaptain: boolean = TeamInfoManager.Instance.IsCaptainInTeam;
        if (isCaptain && TeamInfoManager.Instance.TeamInfo.id == UserDataManager.Instance.UserInfo.uid) {
            this._thisCloseMatchNode.active = true;
            UIButtonUtil.initBtn(this._thisCloseMatchNode, () => {
                this.stopMatching();
            });
        } else {
            this._thisCloseMatchNode.active = false;
        }



        this.node.addChild(matchNode);

        //UI相关
        this.scheduleOnce(() => {
            this.createPointAnimation();
        }, 0.1); // 延迟0.5秒开始动画

        // this.createPointAnimation();


    }

    countDownTime() {
        const countDown = () => {
            if (this._countdownNum <= 0) {
                this.hide();
                return;
            }
            this._countdownNum--;
            this._timeLabel.getComponent(Label).string = this._countdownNum + 's';

        }
        this.schedule(countDown, 1);

    }

    async stopMatching() {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法停止匹配');
            ToastManager.showToast('网络连接异常，请稍后重试【stopMatching】');
            return;
        }
        const data = await TsRpc.Instance.Client.callApi('team/CancelMatching', { __ssoToken: UserDataManager.Instance.SsoToken })
        if (!data.isSucc) {
            ToastManager.showToast('取消失败 ' + data.err.message);
            return;
        }
        console.log('stopMatching data = ', data);
        this.hide();

    }

    hide() {
        //如果是队员收到队长匹配成功，不判断会报错
        if (this._thisMatchNode) {
            console.log('this._thisMatchNode = ', this._thisMatchNode);
            this.unscheduleAllCallbacks();
            this._countdownNum = 30;
            if (this._thisMatchNode && this._thisMatchNode.isValid) {
                this._thisMatchNode.destroy();
                this._thisMatchNode = null;
            }
        }

    }


    private createPointAnimation() {
        if (!this._pointNode) return;

        let maskContainer = this._pointNode.parent;
        if (!maskContainer) return;

        const graphics = maskContainer.getComponent(Graphics);
        if (!graphics) return;

        const uiTransform = this._pointNode.getComponent(UITransform);
        if (!uiTransform) return;

        const size = Math.max(uiTransform.width, uiTransform.height);
        const maxRadius = size * 0.5;
        const duration = 1.5;
        const holdTime = 0.1;

        const updateMask = (radius: number) => {
            if (!graphics.isValid) return;  // 检查组件是否有效
            graphics.clear();
            graphics.fillColor = Color.WHITE;
            graphics.arc(0, 0, radius, 0, Math.PI * 2, false);
            graphics.fill();
        };

        const playAnimation = () => {
            if (!this.isValid) return;  // 检查组件是否有效
            updateMask(0);

            // 保存 tween 引用
            this._animationTween = tween({ radius: 0 })
                .to(duration, { radius: maxRadius }, {
                    onUpdate: (target: { radius: number }) => {
                        if (!graphics.isValid) return;
                        updateMask(target.radius);
                    },
                    easing: 'sineOut'
                })
                .delay(holdTime)
                .call(playAnimation)
                .start();
        };

        playAnimation();
    }

    protected onDestroy(): void {
        // 停止所有动画
        if (this._animationTween) {
            this._animationTween.stop();
            this._animationTween = null;
        }
        EventManager.Instance.off(EVENT_ENUM.ShowMatching, this.showMatching);
        EventManager.Instance.off(EVENT_ENUM.HideMatching, this.hide);
        EventManager.Instance.off(EVENT_ENUM.ShowVs, this.matchedSuccess, this);
    }

    update(deltaTime: number) {

    }
}


