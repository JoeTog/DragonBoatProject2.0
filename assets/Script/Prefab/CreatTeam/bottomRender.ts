import { _decorator, Component, Node } from 'cc';
import { TeamInfoManager } from '../../Data/TeamInfoManager';
import UserDataManager from '../../Data/UserDataManager';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { TsRpc } from '../../Net/TsRpc';
import { ToastManager } from '../UI/ToastManager';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM } from '../../Data/Enum';
import { MsgTeamStatusChange } from '../../Net/Shared/protocols/team/MsgTeamStatusChange';
const { ccclass, property } = _decorator;




@ccclass('bottomRender')
export class bottomRender extends Component {


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
            ToastManager.showToast('网络连接异常，请稍后重试【exitTeam】');
            return;
        }
        const data = await TsRpc.Instance.Client.callApi('team/LeaveTeam', { __ssoToken: UserDataManager.Instance.SsoToken });
        if (!data.isSucc) {
            ToastManager.showToast('退出队伍失败 ' + data.err.message);
            //TeamInfoManager.Instance.closeteam(false);
            return;
        }
    }


    //收到队伍状态改变
    teamStatusChange(msg: MsgTeamStatusChange) {
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
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法进行匹配');
            ToastManager.showToast('网络连接异常，请稍后重试【startMatch】');
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

    protected onDestroy(): void {

        EventManager.Instance.off(EVENT_ENUM.TeamStatusChange, this.teamStatusChange);
    }




    update(deltaTime: number) {

    }


}

