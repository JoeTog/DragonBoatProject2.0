import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import EventManager from '../../../Base/EventManager';
import { EVENT_ENUM } from '../../../Data/Enum';
import { UIButtonUtil } from '../../../Base/UIButtonUtil';
import { TsRpc } from '../../../Net/TsRpc';
import UserDataManager from '../../../Data/UserDataManager';
import { ToastManager } from '../ToastManager';
import { TeamInfoManager } from '../../../Data/TeamInfoManager';
const { ccclass, property } = _decorator;

@ccclass('UIMatchManager')
export class UIMatchManager extends Component {

    @property(Prefab)
    UIMathingPrefab: Prefab;

    private _countdownNum = 30;
    private _timeLabel: Label = null;

    private _thisMatchNode: Node = null;

    private _thisCloseMatchNode: Node = null;




    start() {

        EventManager.Instance.on(EVENT_ENUM.ShowMatching, this.show, this);
        EventManager.Instance.on(EVENT_ENUM.HideMatching, this.hide, this);





    }

    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.ShowMatching, this.show);
        EventManager.Instance.off(EVENT_ENUM.HideMatching, this.hide);
    }

    show() {
        console.log('show');
        // 如果已经存在匹配节点，先销毁
        if (this._thisMatchNode && this._thisMatchNode.isValid) {
            this.hide(); // 或者直接销毁
        }
        const matchNode = instantiate(this.UIMathingPrefab);
        this._timeLabel = matchNode.getChildByName('time').getComponent(Label);
        this._timeLabel.string = this._countdownNum + 's';
        this.node.addChild(matchNode);
        this._thisMatchNode = matchNode;
        this.countDownTime();

        let isCaptain: boolean = TeamInfoManager.Instance.IsCaptainInTeam;
        this._thisCloseMatchNode = this._thisMatchNode.getChildByName('closeBtn');
        if (isCaptain && TeamInfoManager.Instance.TeamInfo.id == UserDataManager.Instance.UserInfo.uid) {
            this._thisCloseMatchNode.active = true;
            UIButtonUtil.initBtn(this._thisCloseMatchNode, () => {
                this.stopMatching();
            });
        } else {
            this._thisCloseMatchNode.active = false;
        }


    }

    countDownTime() {
        const countDown = () => {
            if (this._countdownNum <= 0) {
                this.hide();
                return;
            }
            this._countdownNum--;
            this._timeLabel.string = this._countdownNum + 's';

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


    update(deltaTime: number) {

    }
}


