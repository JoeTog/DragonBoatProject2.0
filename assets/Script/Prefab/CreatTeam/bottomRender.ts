import { _decorator, Component, find, instantiate, Node, Prefab, UITransform, Widget } from 'cc';
import { TeamInfoManager } from '../../Data/TeamInfoManager';
import UserDataManager from '../../Data/UserDataManager';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { TsRpc } from '../../Net/TsRpc';
import { ToastManager } from '../UI/ToastManager';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, GameStatus } from '../../Data/Enum';
import { MsgTeamStatusChange } from '../../Net/Shared/protocols/team/MsgTeamStatusChange';
import { PopViewManager } from '../UI/Notice/PopViewManager';
import { BAG_CONFIG } from '../../Config';
import { EnrichedBagItem } from '../../Net/Shared/models/Interfaces';
import { loadingManager } from '../UI/LoadingManager';
import { GameDataManager } from '../../Data/GameDatamanager';
const { ccclass, property } = _decorator;




@ccclass('bottomRender')
export class bottomRender extends Component {


    @property(Prefab)
    popViewPrefab: Prefab = null;


    @property(Node)
    matchBtn: Node;

    @property(Node)
    matchActive: Node;

    @property(Node)
    matchDisable: Node;

    @property(Node)
    popBtn: Node;


    private IsMatching: boolean = false;


    protected start(): void {

        EventManager.Instance.on(EVENT_ENUM.TeamStatusChange, this.teamStatusChange, this);
        let isCaptain: boolean = TeamInfoManager.Instance.IsCaptainInTeam;
        if (isCaptain && TeamInfoManager.Instance.TeamInfo.id == UserDataManager.Instance.UserInfo.uid) {
            this.matchActive.active = true;
            this.matchDisable.active = false;
            UIButtonUtil.initBtn(this.matchBtn, () => {
                this.startMatch();
            });
        } else {
            this.matchActive.active = false;
            this.matchDisable.active = true;
        }
        UIButtonUtil.initBtn(this.popBtn, () => {
            this.exitTeam();
        });

    }

    async exitTeam() {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法停止匹配');
            ToastManager.showToast('网络连接异常，请稍后重试【退出队伍】');
            return;
        }
        const data = await TsRpc.Instance.Client.callApi('team/LeaveTeam', { __ssoToken: UserDataManager.Instance.SsoToken });
        if (!data.isSucc) {
            ToastManager.showToast('退出队伍失败 ' + data.err.message);
            return;
        }
    }


    //收到队伍状态改变
    teamStatusChange(msg: MsgTeamStatusChange) {
        GameDataManager.Instance.setGameStatus(GameStatus.NORMAL);
        if (msg.status == 1) {
            // 队长开启了匹配  队长队员都会收到1
            if (!this.IsMatching) {
                EventManager.Instance.emit(EVENT_ENUM.ShowMatching);
            }
        } else if (msg.status == 0) {
            //可能是队长取消匹配,有matchingFail通知 这里不需要做通知，做了通知 会导致刚hide又 show了一个
            EventManager.Instance.emit(EVENT_ENUM.HideMatching);
        }

    }

    async startMatch() {

        if (UserDataManager.Instance.IsDie) {
            // ToastManager.showToast('您已淘汰，请先复活');

            const popV = instantiate(this.popViewPrefab);
            const manager = popV.getComponent(PopViewManager);
            manager.messageText = '是否使用复活药水进行复活？';
            let itemId = UserDataManager.Instance.vipResurrection;
            let itemName = '';
            const config = BAG_CONFIG[itemId];
            console.log(config);
            const item: EnrichedBagItem = {
                id: itemId, count: 0, name: config[0], price: 0, status: 0,
                use: 0, desc: ''
            };
            manager.showItemList = [item];
            manager.messageText = '（当玩家淘汰后无法参与游戏，使用复活药水后方可继续游戏)';
            manager.confirmBlock = async () => {
                let ret = this.userProps();
                if (ret) {
                    popV.destroy();
                }
            };
            // this.node.addChild(popV);


            let windowsNode = find('Canvas/windows');
            if (!windowsNode) {
                const canvasNode = find('Canvas');
                if (canvasNode) {
                    windowsNode = canvasNode.getChildByName('windows');
                    if (!windowsNode) {
                        windowsNode = new Node('windows');
                        canvasNode.addChild(windowsNode);
                    }
                    const canvasTransform = canvasNode.getComponent(UITransform);
                    if (canvasTransform) {
                        const windowsTransform = windowsNode.getComponent(UITransform) ?? windowsNode.addComponent(UITransform);
                        windowsTransform.setContentSize(canvasTransform.contentSize);
                    }
                    const windowsWidget = windowsNode.getComponent(Widget) ?? windowsNode.addComponent(Widget);
                    windowsWidget.isAlignLeft = true;
                    windowsWidget.isAlignRight = true;
                    windowsWidget.isAlignTop = true;
                    windowsWidget.isAlignBottom = true;
                    windowsWidget.left = 0;
                    windowsWidget.right = 0;
                    windowsWidget.top = 0;
                    windowsWidget.bottom = 0;
                    windowsWidget.updateAlignment();
                    windowsNode.setSiblingIndex(canvasNode.children.length - 1);
                }
            }
            if (windowsNode) {
                windowsNode.addChild(popV);
                popV.setSiblingIndex(windowsNode.children.length - 1);
            } else {
                console.warn('[HomeManager] windows 节点未找到，fallback 到当前节点');
                this.node.addChild(popV);
                popV.setSiblingIndex(this.node.children.length - 1);
            }
            return;
        }


        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法进行匹配');
            ToastManager.showToast('网络连接异常，请稍后重试【匹配】');
            return;
        }
        this.IsMatching = true;

        const data = await TsRpc.Instance.Client.callApi('team/Matching', { __ssoToken: UserDataManager.Instance.SsoToken })
        if (!data.isSucc) {
            ToastManager.showToast(data.err.message)
            return;
        }

        EventManager.Instance.emit(EVENT_ENUM.ShowMatching);

    }

    /**
                     * 使用药水
                     * @param index 背包数组索引
                     */
    async userProps() {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法使用道具');
            ToastManager.showToast('网络连接异常，请稍后重试【使用药水】');
            return;
        }
        loadingManager.showLoading();
        let itemId = UserDataManager.Instance.vipResurrection;
        let data = await TsRpc.Instance.Client.callApi("shop/UseItem", { __ssoToken: UserDataManager.Instance.SsoToken, id: itemId })
        loadingManager.hideLoading();
        if (data.isSucc) {
            UserDataManager.Instance.IsDie = data.res.isdie;
            EventManager.Instance.emit(EVENT_ENUM.RequestUserInfo);
            ToastManager.showToast(data.res.msg);
            return true;
        } else {
            if (data) {
                ToastManager.showToast(data.err.message || '使用道具失败');
                return false;
            }
        }
    }

    protected onDestroy(): void {

        EventManager.Instance.off(EVENT_ENUM.TeamStatusChange, this.teamStatusChange);
    }




    update(deltaTime: number) {

    }


}

