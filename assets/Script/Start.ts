import { _decorator, Component, instantiate, Node, Prefab, sys, utils } from 'cc';
import { TsRpc } from './Net/TsRpc';
import { ToastManager } from './Prefab/UI/ToastManager';
import UserDataManager from './Data/UserDataManager';
import { TsrpcError } from 'tsrpc-browser';
import { getUrlParam, resAssetLoad } from './Base/Utils';
import GameConfig from './Config/GameConfig';
import { TeamInfoManager } from './Data/TeamInfoManager';
import { EVENT_ENUM, IPlayerSetInfo, LocalStorageKey, MUSIC_PATH_ENUM } from './Data/Enum';
import EventManager from './Base/EventManager';
import { AudioManager } from './Base/AudioManager';
import { loadingManager } from './Prefab/UI/LoadingManager';
import { HomeManager } from './Prefab/Home/HomeManager';
import { GameDataManager } from './Data/GameDatamanager';
import ConfigManager from './Base/ConfigManager';
import { AudioBGMManager } from './Base/AudioBGMManager';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {


    private loadingNode: Node = null;


    async start() {

        //jiangsuxingtu
        if (GameConfig.ws_url.includes('test')) {
        } else {
            window.console.log = () => { };
        }
        // ① 禁用 console.log（生产环境）
        // window.console.log = ()=>{};

        loadingManager.showLoading();



        try {
            //加载spine动画 资源加载中
            // await resAssetLoad<Prefab>("Prefab/UI/Loading", Prefab).then(prefab => {
            //     this.loadingNode = instantiate(prefab);
            //     this.node.addChild(this.loadingNode);
            // }).catch(err => {
            //     console.warn('加载 Loading 预制体失败:', err);
            // });

            await this.doLogin();
            this.logined();

        } catch (error) {
            console.error('Start 初始化失败:', error);
            ToastManager.showToast('初始化失败，请刷新页面重试', error);
        }

    }

    logined() {
        const savedData = sys.localStorage.getItem(LocalStorageKey.PersonalConfig + `_${UserDataManager.Instance.UserInfo.uid}`);
        const personalSetting = savedData ? JSON.parse(savedData) : this.getDefaultSettings();
        ConfigManager.Instance.personalSetting = personalSetting;

        //播放背景音乐
        AudioBGMManager.Instance.play(MUSIC_PATH_ENUM.bgFight, ConfigManager.Instance.personalSetting.musicBGMVolume).catch(err => {
            console.warn('播放背景音乐失败:', err);
        });

    }

    private async doLogin() {
        //获取网址中的参数
        let getUrl = getUrlParam();
        let { u, p, i } = getUrl as { u: string, p: string, i: string };
        // if (i != null)
        //     GameConfig.ws_url = 'wss://' + i;
        const client = await TsRpc.Instance.init();
        if (!client.isSucc) {
            return;
        }

        // 设置重连成功回调，自动重新登录
        TsRpc.Instance.setOnReconnectCallback(async () => {
            console.log('【重连成功】开始重新登录...');
            if (GameConfig.ws_url.includes('test')) {
                await this.reLogin(u ? u : '15061296909');
            } else {
                await this.reLogin(u);
            }

        });

        //请求用户登陆
        console.warn('第一次登录');
        let data = null;
        if (GameConfig.ws_url.includes('test')) {
            data = await TsRpc.Instance.Client.callApi("user/Login", {
                account: u ? u : '15061296909',
                // account: u,
                password: '123'
            });
        } else {
            data = await TsRpc.Instance.Client.callApi("user/Login", {
                account: u,
                password: '123'
            });
        }
        if (!data || data.isSucc == false) {
            ToastManager.showToast("登录失败，页面即将自动刷新重新登陆 " + data.err.message);
            return;
        }
        //记录用户token
        UserDataManager.Instance.SsoToken = data.res.__ssoToken;
        //获取用户信息
        const userData = await TsRpc.Instance.Client.callApi("user/GetInfo", {
            __ssoToken: data.res.__ssoToken
        });
        //请求用户状态，是否在游戏中、队伍中
        const teamData = await TsRpc.Instance.Client.callApi('user/GetStatus', {
            __ssoToken: data.res.__ssoToken
        });
        const userinfo = userData.res.info;
        console.log('start userinfo = ', userinfo);
        //单例记录用户信息

        UserDataManager.Instance.UserInfo = userinfo;
        // console.log('start zdoRender');
        //正常加载首页 移到最下面
        // if (this.loadingNode) {
        //     this.loadingNode.destroy();
        // }
        // this.node.getComponent(HomeManager).doRender();

        // 判断用户将要进入的界面，提前加载对应UI
        //用户有队伍或者游戏中
        if (teamData.res.teamId > 0 && teamData.res.roomId > 0) {
            //游戏中
            // 表示在游戏中,请求获取队伍信息，直接进入
            const teamInfo = await TsRpc.Instance.Client.callApi("team/GetTeamInfo", { __ssoToken: UserDataManager.Instance.SsoToken });
            TeamInfoManager.Instance.TeamInfo = teamInfo.res.info
            const pk_info = await TsRpc.Instance.Client.callApi("room/GetRoomInfo", { __ssoToken: UserDataManager.Instance.SsoToken });
            GameDataManager.Instance.restoreGame(pk_info.res.roomIndex, pk_info.res.info, userData.res.gameItems, pk_info.res.currentTask?.status, pk_info.res?.currentTask);

        } else if (teamData.res.teamId > 0) {
            //有队伍
            const myTeamInfo = await TsRpc.Instance.Client.callApi('team/GetTeamInfo', { __ssoToken: UserDataManager.Instance.SsoToken });
            console.log('myTeamInfo = ', myTeamInfo);
            if (!myTeamInfo || !myTeamInfo.res || !myTeamInfo.res.hasTeam) {
                ToastManager.showToast('队伍不存在: ' + myTeamInfo);
                return;
            }
            if (!myTeamInfo.isSucc) {
                ToastManager.showToast('加载队伍后，获取队伍信息异常');
                return;
            }
            if (!myTeamInfo.res.hasTeam) {
                ToastManager.showToast('加载队伍后：队伍不存在');
                //通知刷新队伍列表
                return;
            }
            //赋值队伍信息
            TeamInfoManager.Instance.TeamInfo = myTeamInfo.res.info;
            //通知homemanager中设置 myteam 为 active
            EventManager.Instance.emit(EVENT_ENUM.ShowTeam);
        }
        //不管 用户有没有 队伍中、游戏状态 都正常加载 首页 显示个人信息usercard、role、bottomview等
        // if (this.loadingNode) {
        //     this.loadingNode.destroy();
        // }
        // start、homemagaer 都挂载在home节点上，在start组件中调用homeManager中的方法 初始化usercard、role、bottom
        this.node.getComponent(HomeManager).doRender();
    }

    /**
     * 重新登录（重连后调用）
     */
    private async reLogin(account: string): Promise<void> {
        try {
            if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
                console.error('【重新登录失败】连接未建立');
                return;
            }

            // 重新登录
            console.warn('重新登录');
            const data = await TsRpc.Instance.Client.callApi("user/Login", {
                account: account,
                password: '123'
            });

            if (!data || data.isSucc == false) {
                console.error('【重新登录失败】', data?.err?.message || '未知错误');
                ToastManager.showToast("重新登录失败，请刷新页面");
                return;
            }

            // 更新 token
            UserDataManager.Instance.SsoToken = data.res.__ssoToken;

            // 重新获取用户信息
            const userData = await TsRpc.Instance.Client.callApi("user/GetInfo", {
                __ssoToken: data.res.__ssoToken
            });

            if (userData && userData.isSucc && userData.res) {
                UserDataManager.Instance.UserInfo = userData.res.info;
                ToastManager.showToast('token失效，身份验证成功请重新操作!');
                console.warn('登陆失效，身份验证成功请重新操作!');
            } else {
                console.warn('【重新登录】获取用户信息失败');
            }
        } catch (error) {
            console.error('【重新登录异常】', error);
            ToastManager.showToast("重新登录失败，请刷新页面");
        }
    }

    private getDefaultSettings(): IPlayerSetInfo {
        sys.localStorage.setItem(
            LocalStorageKey.PersonalConfig + `_${UserDataManager.Instance.UserInfo.uid}`,
            JSON.stringify({
                userId: UserDataManager.Instance.UserInfo.uid,
                musicBGMVolume: 0.3,
                soundEffectsVolume: 0.3,
                musicBGMIsOn:true,
                soundEffectsIsOn:true
            })
        );
        return {
            userId: UserDataManager.Instance.UserInfo.uid,
            musicBGMVolume: 0.3,
            soundEffectsVolume: 0.3,
            musicBGMIsOn:true,
            soundEffectsIsOn:true
        };
    }

    update(deltaTime: number) {

    }






}


