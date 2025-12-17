import { _decorator, Component, dragonBones, instantiate, Node, Prefab, UITransform } from 'cc';
import { AudioManager } from '../../../Base/AudioManager';
import { EVENT_ENUM, MUSIC_PATH_ENUM } from '../../../Data/Enum';
import EventManager from '../../../Base/EventManager';
import { SingleUIRender } from './SingleUIRender';
import { SingleOperatorRender } from './SingleOperatorRender';
import { randomFloor } from '../../../Base/Utils';
import { loadingManager } from '../../UI/LoadingManager';
const { ccclass, property } = _decorator;

//定义龙舟动画状态：停止、慢速、快速
enum BoatMoveSke {
    STOP = '',
    Slow = 'newAnimation',
    FAST = 'newAnimation_复制1'
}

@ccclass('doSender')
export class doSender extends Component {



    //船、河道
    @property(Prefab)
    animNodePrefab: Prefab;
    //方向UI
    @property(Prefab)
    operatorPrefab: Prefab;

    @property(Prefab)
    UINodePrefab: Prefab;



    private animNode: Node = null;
    private operatorNode: Node = null;
    private UINode: Node = null;

    private sideNode: Node = null;//
    private boatBones: dragonBones.ArmatureDisplay = null;
    //当前龙舟播放动画
    private longBoatMoveSke: BoatMoveSke = BoatMoveSke.STOP;


    //anim中 小船、轮播的边景
    private moveSpeed: number = 1;//背景移动速度
    private readonly acceleration = 30;   // 每秒加速量
    private readonly restDeceleration = 80; // 休息时的减速度
    private readonly maxMoveSpeed = 1000;  // 封顶速度
    private readonly minMoveSpeed = 50;      // 不低于 50
    private readonly eliminateSpeed = 100;      // 淘汰时候的速度


    private IsEliminate: boolean = false;
    private IsRest: boolean = false;



    protected onLoad(): void {

        //没淘汰 倒计时过程中一直加速

        //淘汰了 停止划船， 一直缓慢前进

        //休息时候  停止划船、不前进

        this.doSender();
        loadingManager.hideLoading();
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }


    doSender() {
        //播放背景音乐
        AudioManager.Instance.play(MUSIC_PATH_ENUM.game_bg).catch(err => {
            console.warn('播放游戏中背景音乐失败:', err);
        });

        if (!this.animNodePrefab || !this.operatorPrefab) {
            console.error('Required prefabs are not assigned');
            return;
        }
        //初始化
        this.animNode = instantiate(this.animNodePrefab);
        this.node.addChild(this.animNode);

        this.operatorNode = instantiate(this.operatorPrefab);
        const operatorRender = this.operatorNode.getComponent(SingleOperatorRender);
        operatorRender.eliminateBlock = (isSuccess) => {
            this.IsEliminate = true;
            UIRender.dieRender(isSuccess);
        };
        operatorRender.restBlock = () => {
            this.IsRest = true;
        };
        operatorRender.activeBlock = () => {
            this.reSetSec();
        };
        this.node.addChild(this.operatorNode);

        this.UINode = instantiate(this.UINodePrefab);
        const UIRender = this.UINode.getComponent(SingleUIRender);
        UIRender.countDownBlock = () => {
            operatorRender.scheduleTaskLabel();
        };
        UIRender.repeatBlock = () => {
            this.reSet();
            operatorRender.reSetAll();
        };
        UIRender.overBlock = () => {
            this.hide();
        };
        this.node.addChild(this.UINode);



        this.sideNode = this.animNode.getChildByName('side');
        this.boatBones = this.animNode.getChildByName('boat').getComponent(dragonBones.ArmatureDisplay);


        // PKGame显示后销毁创建队伍页面和首页 只保留游戏画面
        // EventManager.Instance.emit(EVENT_ENUM.HideTeam, false, true);
        // EventManager.Instance.emit(EVENT_ENUM.HideHome);

        this.boatSetAnim(BoatMoveSke.FAST);

    }

    reSet() {
        this.IsEliminate = false;
        this.IsRest = false;
        this.moveSpeed = 1;
    }

    reSetSec() {
        this.IsEliminate = false;
        this.IsRest = false;
        this.moveSpeed = 200;
    }

    hide() {

        //播放背景音乐
        AudioManager.Instance.play(MUSIC_PATH_ENUM.bgFight).catch(err => {
            console.warn('播放背景音乐失败:', err);
        });

        this.node.destroyAllChildren();
        this.node.destroy();
    }

    boatSetAnim(anim: BoatMoveSke) {
        if (!this.boatBones) {
            console.error('boatBones is null');
            return;
        }

        if (this.longBoatMoveSke === anim) {
            return;
        }
        if (anim === BoatMoveSke.STOP) {
            this.boatBones.playAnimation('newAnimation', 0.1);
            this.longBoatMoveSke = anim;
            return;

        }
        this.boatBones.playAnimation(anim);
        this.longBoatMoveSke = anim;

    }

    InfiniteMove(moveNode: Node, speed: number) {
        if (!moveNode || !moveNode.children) {
            return;
        }
        let maxY = 0;//放置的最高点
        let resetNode: Node = null;//重新放置的node

        moveNode.children.forEach((child: Node) => {
            const currentPostion = child.position;
            const nodeH = child.getComponent(UITransform)?.contentSize.height;
            if (maxY < currentPostion.y) {
                maxY = currentPostion.y;
            }
            child.setPosition(currentPostion.x, currentPostion.y - speed, currentPostion.z);
            if (!nodeH) {
                return;
            }
            // if (currentPostion.y + nodeH < 0) {
            //     resetNode = child;
            // }
            if (nodeH && (currentPostion.y - speed + nodeH < 0)) {
                resetNode = child;
            }

        });

        if (resetNode) {
            const postion = resetNode.position;
            const nodeH = resetNode.getComponent(UITransform)?.contentSize.height;
            resetNode.setPosition(postion.x, maxY + nodeH, postion.z);

        }

    }

    update(deltaTime: number) {

        const sp = this.moveSpeed * deltaTime;
        // console.log('sp = ',sp);

        if (this.IsEliminate) {
            this.moveSpeed = this.eliminateSpeed;
            this.InfiniteMove(this.sideNode, sp);
            this.boatSetAnim(BoatMoveSke.Slow);
            return;
        } else if (this.IsRest) {
            this.moveSpeed = Math.max(
                this.moveSpeed - this.restDeceleration * deltaTime,
                this.minMoveSpeed
            );
            this.InfiniteMove(this.sideNode, sp);
            this.boatSetAnim(BoatMoveSke.Slow);
            return;
        } else if (!this.IsRest) {
            this.moveSpeed = Math.min(
                this.moveSpeed + this.acceleration * deltaTime,
                this.maxMoveSpeed
            );
        }


        if (this.moveSpeed >= 300) {
            // console.log('moveSpeed >= 300');
            this.boatSetAnim(BoatMoveSke.FAST);
        }

        // if (this.moveSpeed <= 400) {
        //     this.moveSpeed += sp * randomFloor(2, 10);
        //     // 限制最大速度
        //     // if (this.moveSpeed > 400) {
        //     //     this.moveSpeed = 400;
        //     // }
        // }

        if (this.sideNode) {
            this.InfiniteMove(this.sideNode, sp);
        }


    }


}

