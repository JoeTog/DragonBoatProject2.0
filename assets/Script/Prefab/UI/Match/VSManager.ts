import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, tween, UITransform, v3, Vec3 } from 'cc';
import EventManager from '../../../Base/EventManager';
import { EVENT_ENUM, PREFAB_PATH_ENUM } from '../../../Data/Enum';
import { GameDataManager } from '../../../Data/GameDatamanager';
import { loadAvatar, resAssetLoad } from '../../../Base/Utils';
import { IMG_URL_EXTRA_PARAM } from '../../../Config';
import UserDataManager from '../../../Data/UserDataManager';
const { ccclass, property } = _decorator;

@ccclass('VSManager')
export class VSManager extends Component {

    @property(Prefab)
    VsPrefab: Prefab = null;



    protected onLoad(): void {
        EventManager.Instance.on(EVENT_ENUM.ShowVs, this.doSender, this);
    }

    protected onDestroy(): void {
        //在
        EventManager.Instance.off(EVENT_ENUM.ShowVs, this.doSender, this);
    }

    initVSNode(VSNode: Node) {
        if (!VSNode) {
            console.error('VSNode is null');
            return;
        }


        const iconNode = VSNode.getChildByName('icon');
        const myNode = VSNode.getChildByName('pk_my');
        const enemyNode = VSNode.getChildByName('pk_enemy');
        if (!myNode || !enemyNode || !iconNode) {
            console.error('Required child nodes not found');
            return;
        }

        const teamInfo = GameDataManager.Instance.VsTeamInfo;
        if (!teamInfo) {
            console.error('VsTeamInfo is null');
            return;
        }
        const myTeamIndex = GameDataManager.Instance?.MyTeamIndex;
        const enemyTeamIndex = GameDataManager.Instance?.EnemyTeamIndex;
        if (myTeamIndex === undefined || enemyTeamIndex === undefined ||
            !teamInfo[myTeamIndex] || !teamInfo[enemyTeamIndex]) {
            console.error('Team index or team info is invalid');
            return;
        }
        //设置vs队伍信息 , 传入node 
        this.renderInfo(myNode, teamInfo[GameDataManager.Instance.MyTeamIndex]);
        this.renderInfo(enemyNode, teamInfo[GameDataManager.Instance.EnemyTeamIndex]);
        EventManager.Instance.emit(EVENT_ENUM.HideMatching);
        // 在添加子节点之前检查 this.node 是否存在
        if (!this.node || !this.node.isValid) {
            console.error('VSManager node is null or invalid');
            return;
        }

        this.node.addChild(VSNode);

        // 动画完成后 通知 展示 游戏
        this.showAnim(myNode, enemyNode, iconNode, () => {
            EventManager.Instance.emit(EVENT_ENUM.ShowPKGame);
        });
    }

    async doSender() {

        //今日使用次数+1
        UserDataManager.Instance.UserInfo.times += 1;
        EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo);

        let VSNode: Node = null;
        if (this.VsPrefab) {
            VSNode = instantiate(this.VsPrefab);
            this.initVSNode(VSNode);
        } else {
            await resAssetLoad<Prefab>(PREFAB_PATH_ENUM.UIVsPrefab, Prefab).then(prefab => {
                VSNode = instantiate(prefab);
                this.initVSNode(VSNode);
            })
        }

    }

    //渲染vs队伍的信息
    renderInfo(teamNode: Node, teamInfo) {
        if (!teamNode || !teamInfo) {
            console.error('teamNode or teamInfo is null');
            return;
        }

        const avatarNode = teamNode.getChildByName('avatar');
        if (!avatarNode) {
            console.error('avatar node not found');
            return;
        }

        const maskNode = avatarNode.getChildByName('mask');
        if (!maskNode) {
            console.error('mask node not found');
            return;
        }

        const imgNode = maskNode.getChildByName('img');
        if (!imgNode) {
            console.error('img node not found');
            return;
        }
        const avatarImg = teamNode.getChildByName('avatar').getChildByName('mask').getChildByName('img').getComponent(Sprite);
        const teamNameLabel = teamNode.getChildByName('teamName').getComponent(Label);
        const teamCountLabel = teamNode.getChildByName('count').getChildByName('value').getComponent(Label);
        teamNameLabel.string = teamInfo.name;
        teamCountLabel.string = `${teamInfo.count}/${teamInfo.maxCount}`;
        loadAvatar(teamInfo.avatar + IMG_URL_EXTRA_PARAM).then((res: SpriteFrame) => {
            avatarImg.spriteFrame = res;
        })

    }

    showAnim(myNode: Node, enemyNode: Node, iconNode: Node, onComplete?: () => void) {
        let w = this.node.getComponent(UITransform).width / 2;
        let offset = w + 100;
        const myNodeWidth = myNode.getComponent(UITransform).width
        let startPosX = myNodeWidth + offset
        //我的队伍节点
        myNode.position = v3(-startPosX, myNode.position.y, myNode.position.z)
        this.moveAnim(myNode, -w + myNodeWidth / 2);
        //敌方队伍节点
        enemyNode.position = v3(startPosX, enemyNode.position.y, enemyNode.position.z)
        this.moveAnim(enemyNode, w - myNodeWidth / 2);
        iconNode.setScale(v3(0, 0, 1))
        tween(iconNode)
            .to(1.2, { scale: v3(1, 1, 1) }, { easing: 'elasticOut' })
            .call(() => {
                this.moveAnim(myNode, -startPosX);
                this.moveAnim(enemyNode, startPosX);
                tween(iconNode)
                    .to(1, { scale: v3(0, 0, 0) }, { easing: 'elasticIn' })
                    .call(() => {
                        const parentNode = myNode?.parent;
                        if (parentNode) {
                            parentNode.destroy();
                        }
                        // 动画完成后触发 ShowPKGame
                        if (onComplete) {
                            onComplete();
                        }
                    })
                    .start()
            })
            .start()
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





}


