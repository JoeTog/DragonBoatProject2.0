import { _decorator, Component, instantiate, Label, Node, Prefab, Tween, tween, Widget } from 'cc';
import EventManager from '../../Base/EventManager';
import { ToastManager } from '../UI/ToastManager';
import { loadingManager } from '../UI/LoadingManager';
import { EVENT_ENUM } from '../../Data/Enum';
const { ccclass, property } = _decorator;

@ccclass('MyTeamRender')
export class MyTeamRender extends Component {

    @property(Prefab)
    memberItem: Prefab = null;

    @property(Prefab)
    teamMemberListView: Prefab = null;

    @property(Prefab)
    roleView: Prefab = null;

    @property(Prefab)
    bottomView: Prefab = null;


    @property(Prefab)
    pushNoticePrefab: Prefab;

    public pushNotice: Node = null;

    private bgNode: Node = null

    protected onEnable(): void {

        EventManager.Instance.on(EVENT_ENUM.HideTeam, this.disableMyTeam, this);
        EventManager.Instance.on(EVENT_ENUM.ShowTeam, this.showMyTeam, this);


    }

    showMyTeam() {
        //展示我的队伍 设置为active 走onable
        // this.bgNode.active = true;
        this.doSender();

    }


    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.HideTeam, this.disableMyTeam, this);
        EventManager.Instance.off(EVENT_ENUM.ShowTeam, this.showMyTeam, this);
    }

    protected onDisable(): void {
        console.log('=== disableMyTeam 调试 ===');
        console.log('this.node 名称:', this.node.name);  // ← 应该是 "MyTeam"
        console.log('this.node 的父节点:', this.node.parent?.name);  // ← 应该是 "Canvas"
        console.log('this.node 的子节点数量:', this.node.children.length);
        console.log('子节点列表:', this.node.children.map(c => c.name));

    }

    doSender() {

        loadingManager.hideLoading();

        const bottomView = instantiate(this.bottomView);
        this.node.addChild(bottomView);

        this.pushNotice = instantiate(this.pushNoticePrefab);
        this.node.addChild(this.pushNotice);

        const teamMemberListView = instantiate(this.teamMemberListView);
        this.node.addChild(teamMemberListView);

        const roleView = instantiate(this.roleView);
        this.node.addChild(roleView);

    }



    //销毁我的队伍中 所有子节点 跟节点不销毁 等通知重新渲染
    disableMyTeam(isClose: boolean = false, IsInGame: boolean = false) {
        // Tween.stopAllByTarget(this.bgNode);
        // console.log('disableMyTeam 2参数', IsInGame);
        this.node.destroyAllChildren();
        // this.bgNode.active = false;
        if (isClose) {
            ToastManager.showToast("队伍解散");
        } else {
            if (!IsInGame) {
                //进游戏后，会收到离开队伍
                //隐藏队伍界面时候，看看是怎么隐藏的
                ToastManager.showToast("您已离开队伍");
            }
        }
    }


    update(deltaTime: number) {

    }



}

