import { _decorator, Component, Label, Node, Prefab, Sprite, SpriteFrame, instantiate, Color } from 'cc';
import UserDataManager from '../../Data/UserDataManager';
import { BigNumUtils, loadAvatar, truncateString } from '../../Base/Utils';
import { IMG_URL_EXTRA_PARAM } from '../../Config';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, popType, PREFAB_PATH_ENUM } from '../../Data/Enum';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import GameConfig from '../../Config/GameConfig';
import { TsRpc } from '../../Net/TsRpc';
import { ToastManager } from '.././UI/ToastManager';
import { JoeFunc } from '../../Base/JoeFunc';

const { ccclass, property } = _decorator;

@ccclass('UserCardRender')
export class UserCardRender extends Component {
    @property(Sprite)
    avatar_img: Sprite = null;
    @property(Label)
    vip_level: Label = null;
    @property(Label)
    nickname: Label = null;
    @property(Label)
    idValueLabel: Label = null;



    private avatarNode: Node = null;
    //头像按钮
    private userInfoNode: Node = null;
    //次数红心
    private redFirstNode: Node = null;
    private redSecNode: Node = null;
    private redThreeNode: Node = null;
    private redFouthNode: Node = null;
    private redFifthNode: Node = null;
    //版本号
    private versionNode: Label = null;

    private copyBtnNode: Node = null;

    protected onLoad(): void {


        this.userInfoNode = this.node.getChildByName("userinfo");
        this.avatarNode = this.userInfoNode.getChildByName("avatar");
        this.copyBtnNode = this.userInfoNode.getChildByName("IdNode").getChildByName("CopyBtnn");

        this.doRander();
        //注册通知
        EventManager.Instance.on(EVENT_ENUM.UpdateUserInfo, this.doRander, this);

        this.versionNode = this.node.getChildByName("version").getComponent(Label);
        this.versionNode.string = '版本号:' + GameConfig.version;
        const ret = GameConfig.ws_url.includes('test');
        if (ret) {
            this.versionNode.string = '测试版:' + GameConfig.version;
        }


        //我的背包按钮 添加点击事件
        // UIButtonUtil.initBtn(this.bagNode, () => {
        //     EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
        //         prefab_url: PREFAB_PATH_ENUM.BagPrefab,
        //         source: popType.null
        //     });
        // })

        // //商店按钮 添加点击事件
        // UIButtonUtil.initBtn(this.shopNode, () => {
        //     EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
        //         prefab_url: PREFAB_PATH_ENUM.ShopPrefab,
        //         source: popType.null
        //     });
        // })

        // //我的点卷兑换按钮 添加点击事件
        // UIButtonUtil.initBtn(this.djNode, () => {
        //     EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
        //         prefab_url: PREFAB_PATH_ENUM.DjExchangePrefab,
        //         source: popType.null
        //     });
        // })

        
        UIButtonUtil.initBtn(this.copyBtnNode, () => {
            let ret = JoeFunc.copyToClipboard(UserDataManager.Instance.UserInfo.player_code);
            if (ret) {
                ToastManager.showToast('复制成功');
            }   
        });

        //点击头像可查看记录
        UIButtonUtil.initBtn(this.avatarNode, () => {
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.UIUserInfo,
                source: popType.null
            });
        });

        // UIButtonUtil.initBtn(this.powerBtn, () => {
        //     EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
        //         prefab_url: PREFAB_PATH_ENUM.UIUserInfo,
        //         source: popType.powerRecord
        //     });
        // });


    }


    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.UpdateUserInfo, this.doRander, this);
    }


    async doRander(IsRequest: boolean = false) {
        // console.trace('调用栈信息');
        // console.log('刷新usercard ');
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
        if (!this.node || !this.node.isValid || !this.vip_level) {
            console.log('节点已销毁或属性未绑定，跳过渲染');
            return;
        }
        //获取单例中的用户信息
        let {
            user, power, win_games, total_games, point, times, times_max
        } = UserDataManager.Instance.UserInfo;
        let { level, nickname, avatar } = user;
        this.vip_level.string = `${level}`;
        this.nickname.string = truncateString(nickname);

        //用户id
        this.idValueLabel.string = UserDataManager.Instance.UserInfo.player_code;
        //游戏次数
        this.redFirstNode = this.userInfoNode.getChildByName('remain').getChildByName('red').getChildByName('Sprite');
        this.redSecNode = this.userInfoNode.getChildByName('remain').getChildByName('red').getChildByName('SpriteSec');
        this.redThreeNode = this.userInfoNode.getChildByName('remain').getChildByName('red').getChildByName('SpriteThree');
        this.redFouthNode = this.userInfoNode.getChildByName('remain').getChildByName('red').getChildByName('SpriteFouth');
        this.redFifthNode = this.userInfoNode.getChildByName('remain').getChildByName('red').getChildByName('SpriteFifth');
        //游戏次数相关
        const remainTimes = times_max - times;
        if (remainTimes == 0) {
        } else if (remainTimes == 1) {
            this.redFirstNode.active = true;
        } else if (remainTimes == 2) {
            this.redFirstNode.active = true;
            this.redSecNode.active = true;
        } else if (remainTimes == 3) {
            this.redFirstNode.active = true;
            this.redSecNode.active = true;
            this.redThreeNode.active = true;
        } else if (remainTimes == 4) {
            this.redFirstNode.active = true;
            this.redSecNode.active = true;
            this.redThreeNode.active = true;
            this.redFouthNode.active = true;
        } else if (remainTimes == 5) {
            this.redFirstNode.active = true;
            this.redSecNode.active = true;
            this.redThreeNode.active = true;
            this.redFouthNode.active = true;
            this.redFifthNode.active = true;
        }

        // //加载我的头像
        if (!this.avatar_img.spriteFrame || !this.avatar_img) {
            this.avatar_img = this.node.getChildByName('userinfo').getChildByName('avatar').getChildByName('mask').getChildByName('img').getComponent(Sprite);
        }
        loadAvatar(avatar + IMG_URL_EXTRA_PARAM).then((res: SpriteFrame) => {
            this.avatar_img.spriteFrame = res;
        })


        // this.power_value.string = BigNumUtils.getNumberStringWan(power);
        // this.dj_value.string = BigNumUtils.getNumberStringWan(point);
        // const remainTimes = times_max - times;
        // this.remain_value.string = "剩余次数: " + `${remainTimes}`;

        // let winnum = win_games == 0 || total_games == 0 ? 0 : win_games / total_games * 100;
        // if (winnum >= 100) {
        //     winnum = 100;
        // }
        // this.win_value.string = winnum.toFixed(2) + "%";


        // //武力值冻结
        // let freezePower = UserDataManager.Instance.UserInfo.freezePower;
        // if (freezePower <= 0) {
        //     // if(freezePower < 0){
        //     //解冻状态 不需要改变
        //     this.powerIcon = this.node.getChildByName('userinfo').getChildByName('powerView').getChildByName('power').getChildByName('icon');
        //     this.powerIcon.getComponent(Sprite).grayscale = false;
        //     this.power_value.color = Color.WHITE;
        //     // this.power_value.string = `${BigNumUtils.getNumberString(power)}/${BigNumUtils.getNumberString(freezePower)}`;
        //     //用户自己兑换了n武力值 就可以解冻n武力值
        //     // const thawPowers = power-freezePower;
        //     this.power_value.string = `${BigNumUtils.getNumberStringWan(power)}`;

        // } else {
        //     //变成灰色 需要解冻
        //     this.powerIcon = this.node.getChildByName('userinfo').getChildByName('powerView').getChildByName('power').getChildByName('icon');
        //     this.powerIcon.getComponent(Sprite).grayscale = true;
        //     this.power_value.color = Color.GRAY;
        //     // this.power_value.string = `${BigNumUtils.getNumberString(power)}/${BigNumUtils.getNumberString(freezePower)}`;
        //     //用户自己兑换了n武力值 就可以解冻n武力值
        //     // const thawPowers = power-freezePower;
        //     this.power_value.string = `${BigNumUtils.getNumberStringWan(power)}/${BigNumUtils.getNumberStringWan(freezePower)}`;
        // }






    }


    update(deltaTime: number) {

    }




}

