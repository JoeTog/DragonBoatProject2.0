import { _decorator, Component, dragonBones, instantiate, Node, Prefab, random, UITransform, utils } from 'cc';
import { EVENT_ENUM, MUSIC_PATH_ENUM } from '../../Data/Enum';
import { GameDataManager } from '../../Data/GameDatamanager';
import { randomFloor } from '../../Base/Utils';
import EventManager from '../../Base/EventManager';
import { AudioManager } from '../../Base/AudioManager';
import ConfigManager from '../../Base/ConfigManager';
import { AudioBGMManager } from '../../Base/AudioBGMManager';
const { ccclass, property } = _decorator;

//定义龙舟动画状态：停止、慢速、快速
enum BoatMoveSke {
    STOP = '',
    Slow = 'newAnimation',
    FAST = 'newAnimation_复制1'
}


@ccclass('PkGameManager')
export class PkGameManager extends Component {

    //河边、船、背景
    @property(Prefab)
    animNodePrefab: Prefab;
    //方向UI
    @property(Prefab)
    operatorPrefab: Prefab;

    // @property(Prefab)
    // pkResultPrefab: Prefab;
    //UI，进度条、倒计时、死亡
    @property(Prefab)
    UINodePrefab: Prefab;
    //道具的item
    @property(Prefab)
    useIconPrefab: Prefab;
    //用户使用的道具
    @property(Prefab)
    usedddIconPrefab: Prefab;
    //结算界面 失败
    @property(Prefab)
    pkGameResultPrefab: Prefab;
    //结算界面 胜利
    @property(Prefab)
    pkSuccessResultPrefab: Prefab;

    private animNode: Node = null;
    private operatorNode: Node = null;
    // private pkResultNode: Node = null;
    private UINode: Node = null;
    private useIconNode: Node = null;
    private usedddIconNode: Node = null;

    private thispkGameResultPrefab: Node = null;
    private thispkSuccessResultPrefab: Node = null;

    // private needLoadPrefabPath = [];
    // private _bgNode :Node = null;

    //anim中 小船、轮播的边景
    private moveSpeed: number = 100;//背景移动速度
    private sideNode: Node = null;//
    private boatBones: dragonBones.ArmatureDisplay = null;
    //当前龙舟播放动画
    private longBoatMoveSke: BoatMoveSke = BoatMoveSke.STOP;

    protected start(): void {



        EventManager.Instance.on(EVENT_ENUM.ShowPKGame, this.doSender, this);
        EventManager.Instance.on(EVENT_ENUM.StartGame, this.StartGame, this);
        EventManager.Instance.on(EVENT_ENUM.StopGame, this.stopGame, this);

        EventManager.Instance.on(EVENT_ENUM.HidePkGame, this.hide, this)
        EventManager.Instance.on(EVENT_ENUM.ShowPkResult, this.renderPkResult, this)

    }


    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.ShowPKGame, this.doSender);
        EventManager.Instance.off(EVENT_ENUM.StartGame, this.StartGame);
        EventManager.Instance.off(EVENT_ENUM.StopGame, this.stopGame);
        EventManager.Instance.off(EVENT_ENUM.HidePkGame, this.hide)
        EventManager.Instance.off(EVENT_ENUM.ShowPkResult, this.renderPkResult)

    }

    hide() {
        this.thispkGameResultPrefab = null;
        this.thispkSuccessResultPrefab = null;
        this.node.destroyAllChildren();
    }

    //游戏结束
    renderPkResult() {
        
        const data = GameDataManager.Instance.GameResult;
        if (data.winIndex == GameDataManager.Instance.MyTeamIndex) {
            if (!this.thispkSuccessResultPrefab) {
                this.thispkSuccessResultPrefab = instantiate(this.pkSuccessResultPrefab);
                this.node.addChild(this.thispkSuccessResultPrefab);
            }
        } else if (data.winIndex == GameDataManager.Instance.EnemyTeamIndex) {
            if (!this.thispkGameResultPrefab) {
                this.thispkGameResultPrefab = instantiate(this.pkGameResultPrefab);
                this.node.addChild(this.thispkGameResultPrefab);
            }
        } else {
            if (!this.thispkGameResultPrefab) {
                this.thispkGameResultPrefab = instantiate(this.pkGameResultPrefab);
                this.node.addChild(this.thispkGameResultPrefab);
            }
        }
    }

    doSender() {

        //播放背景音乐
        AudioBGMManager.Instance.play(MUSIC_PATH_ENUM.game_bg,ConfigManager.Instance.personalSetting.musicBGMVolume).catch(err => {
            console.warn('播放游戏中背景音乐失败:', err);
        });

        if (!this.animNodePrefab || !this.operatorPrefab || !this.UINodePrefab) {
            console.error('Required prefabs are not assigned');
            return;
        }
        //初始化
        this.animNode = instantiate(this.animNodePrefab);
        this.node.addChild(this.animNode);

        this.operatorNode = instantiate(this.operatorPrefab);
        this.node.addChild(this.operatorNode);

        // this.pkResultNode = instantiate(this.pkResultPrefab);
        // this.node.addChild(this.pkResultNode);

        this.UINode = instantiate(this.UINodePrefab);
        this.node.addChild(this.UINode);

        this.usedddIconNode = instantiate(this.usedddIconPrefab);
        this.node.addChild(this.usedddIconNode);


        this.sideNode = this.animNode.getChildByName('side');
        this.boatBones = this.animNode.getChildByName('boat').getComponent(dragonBones.ArmatureDisplay);

        
        // PKGame显示后销毁创建队伍页面和首页 只保留游戏画面
        EventManager.Instance.emit(EVENT_ENUM.HideTeam, false, true);
        EventManager.Instance.emit(EVENT_ENUM.HideHome);


    }

    //anim相关
    StartGame() {
        this.boatSetAnim(BoatMoveSke.Slow);
    }
    stopGame() {
        this.boatSetAnim(BoatMoveSke.STOP);
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
        if (!GameDataManager.Instance.InPlaying) {
            return;
        }
        const sp = this.moveSpeed * deltaTime;
        if (this.moveSpeed >= 300) {
            this.boatSetAnim(BoatMoveSke.FAST);
        }
        if (this.moveSpeed <= 400) {
            this.moveSpeed += sp * randomFloor(2, 10);
            // 限制最大速度
            if (this.moveSpeed > 400) {
                this.moveSpeed = 400;
            }
        }
        if (this.sideNode) {
            this.InfiniteMove(this.sideNode, sp);
        }

    }





}

