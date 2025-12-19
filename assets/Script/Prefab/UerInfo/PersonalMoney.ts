import { _decorator, Color, Component, Label, Node, Sprite } from 'cc';
import { EVENT_ENUM, popType, PREFAB_PATH_ENUM } from '../../Data/Enum';
import EventManager from '../../Base/EventManager';
import { TsRpc } from '../../Net/TsRpc';
import { ToastManager } from '../UI/ToastManager';
import UserDataManager from '../../Data/UserDataManager';
import { BigNumUtils } from '../../Base/Utils';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
const { ccclass, property } = _decorator;

@ccclass('PersonalMoney')
export class PersonalMoney extends Component {



    @property(Label)
    power_value: Label = null;
    @property(Label)
    point_value: Label = null;
    @property(Label)
    dj_value: Label = null;
    @property(Node)
    djNode: Node = null;
    @property(Node)
    pointNode: Node = null;
    @property(Node)
    settingNode: Node = null;

    @property(Node)
    powerText: Node = null;
    @property(Node)
    djText: Node = null;
    @property(Node)
    pointText: Node = null;


    //是否显示描述文字
    public IsShow: boolean = true;

    //武力值icon 冻结时需要显示为灰色
    private powerIcon: Node = null;


    protected onLoad(): void {


        EventManager.Instance.on(EVENT_ENUM.UpdateUserInfo, this.doRander, this);


        this.doRander();

        UIButtonUtil.initBtn(this.djNode, () => {
            //
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.DjExchangePrefab,
                source: popType.null
            });
        });

        UIButtonUtil.initBtn(this.pointNode, () => {
            //
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.DjExchangePrefab,
                source: popType.null
            });

        });

        UIButtonUtil.initBtn(this.settingNode, () => {
            //
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.Setting,
                source: popType.null
            });

        });

    }



    async doRander(IsRequest: boolean = false) {
        // console.trace('调用栈信息');
        // console.log('刷新usercard ');
        if (!this.IsShow) {
            this.powerText.active = false;
            this.djText.active = false;
            this.pointText.active = false;
        }
        if (IsRequest) {
            if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
                console.warn('WebSocket 未连接，无法获取个人信息');
                ToastManager.showToast('网络连接异常，请稍后重试【showHome】');
                return;
            }
            const userData = await TsRpc.Instance.Client.callApi('user/GetInfo', { __ssoToken: UserDataManager.Instance.SsoToken });
            const userInfo = userData.res.info;
            UserDataManager.Instance.UserInfo = userInfo;
        }
        //当其他页面中的usercard销毁的时候 走了off ，会影响home中的usercard的this.node
        if (!this.node || !this.node.isValid) {
            console.log('节点已销毁或属性未绑定，跳过渲染');
            return;
        }
        //获取单例中的用户信息
        let {
            user, power, win_games, total_games, point, times, times_max
        } = UserDataManager.Instance.UserInfo;
        let { level, nickname, avatar } = user;
        // this.vip_level.string = `${level}`;
        // this.nickname.string = truncateString(nickname);
        this.dj_value.string = BigNumUtils.getNumberStringWan(point);
        this.point_value.string = BigNumUtils.getNumberStringWan(UserDataManager.Instance.GameCoin);

        // const remainTimes = times_max - times;
        // this.remain_value.string = "剩余次数: " + `${remainTimes}`;

        // let winnum = win_games == 0 || total_games == 0 ? 0 : win_games / total_games * 100;
        // if (winnum >= 100) {
        //     winnum = 100;
        // }
        // this.win_value.string = winnum.toFixed(2) + "%";
        //加载我的头像
        // if (!this.avatar_img.spriteFrame || !this.avatar_img) {
        //     this.avatar_img = this.node.getChildByName('userinfo').getChildByName('avatar').getChildByName('mask').getChildByName('img').getComponent(Sprite);
        // }
        // loadAvatar(avatar + IMG_URL_EXTRA_PARAM).then((res: SpriteFrame) => {
        //     this.avatar_img.spriteFrame = res;
        // })

        //武力值冻结
        let freezePower = UserDataManager.Instance.UserInfo.freezePower;
        const rootNode = this.node.getChildByName('Root');
        this.powerIcon = rootNode.getChildByName('PowerNode').getChildByName('icon');
        if (freezePower <= 0) {
            // if(freezePower < 0){
            //解冻状态 不需要改变
            this.powerIcon.getComponent(Sprite).grayscale = false;
            this.power_value.color = Color.WHITE;
            // this.power_value.string = `${BigNumUtils.getNumberString(power)}/${BigNumUtils.getNumberString(freezePower)}`;
            //用户自己兑换了n武力值 就可以解冻n武力值
            // const thawPowers = power-freezePower;
            this.power_value.string = `${BigNumUtils.getNumberStringWan(power)}`;
        } else {
            //变成灰色 需要解冻
            this.powerIcon.getComponent(Sprite).grayscale = true;
            this.power_value.color = Color.GRAY;
            // this.power_value.string = `${BigNumUtils.getNumberString(power)}/${BigNumUtils.getNumberString(freezePower)}`;
            //用户自己兑换了n武力值 就可以解冻n武力值
            // const thawPowers = power-freezePower;
            this.power_value.string = `${BigNumUtils.getNumberStringWan(power)}/${BigNumUtils.getNumberStringWan(freezePower)}`;

        }

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



    update(deltaTime: number) {

    }

    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.UpdateUserInfo, this.doRander, this);
    }

}

