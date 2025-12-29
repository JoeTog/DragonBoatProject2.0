import { _decorator, Component, instantiate, Node, Prefab, Widget, UITransform, macro, EditBox, find, Overflow, Label, sp, Sprite, Color } from 'cc';
import { EVENT_ENUM, MUSIC_PATH_ENUM, NetType, popType, PREFAB_PATH_ENUM } from '../../Data/Enum';
import { isValidPositiveInteger, resAssetLoad } from '../../Base/Utils';
import { TsRpc } from '../../Net/TsRpc';
import UserDataManager from '../../Data/UserDataManager';
import { loadingManager } from '../../Prefab/UI/LoadingManager';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { TeamInfoManager } from '../../Data/TeamInfoManager';
import { ToastManager } from '../../Prefab/UI/ToastManager';
import { AudioManager } from '../../Base/AudioManager';
import { NetManager, NetworkQualityChangePayload } from '../../Net/NetManager';
import EventManager from '../../Base/EventManager';
import ConfigManager from '../../Base/ConfigManager';
import { Setting } from '../UI/Setting/Setting';

const { ccclass, property } = _decorator;

@ccclass('HomeManager')
export class HomeManager extends Component {
    @property(Prefab)
    usercard: Prefab = null;
    @property(Prefab)
    homedown: Prefab = null;
    @property(Prefab)
    role: Prefab = null;
    @property(Prefab)
    PersonalMoney: Prefab = null;

    @property(Prefab)
    passwordInputPrefab: Prefab;

    // @property(Prefab)
    // confirmDialogPrefab: Prefab;
    // @property(Prefab)
    // noticePrefab: Prefab;

    @property(Prefab)
    networkViewPrefab: Prefab;


    @property(Prefab)
    zhanshiPrefab: Prefab;

    //homeDown中 创建队伍按钮
    private createTeamNode: Node = null;

    private _fullTeamName: string = null;

    private passwardInputView: Node = null;
    private windowsNode: Node = null;

    private spineDemoSkeleton: sp.Skeleton | null = null;
    private spineDemoAnimations: string[] = ['idle', 'atk01', 'skill01', 'spSkill01', 'mov', 'knock6', 'hit'];
    private spineAnimationIndex: number = 0;

    private noticeNode: Node = null;

    //网络状态
    private newtworkView: Node = null;
    private newtworkViewFirst: Node = null;
    private newtworkViewSec: Node = null;
    private newtworkViewThree: Node = null;



    protected onLoad(): void {

        //初始化获取父节点中 我的队伍 节点，用于收到创建队伍、进入队伍通知后 设置myteam为active

        //监听 展示我的队伍，用于收到创建队伍、进入队伍通知后 设置myteam为active
        // EventManager.Instance.on(EVENT_ENUM.ShowTeam, this.showMyTeam, this);

        EventManager.Instance.on(EVENT_ENUM.ShowHome, this.showHome, this);
        EventManager.Instance.on(EVENT_ENUM.HideHome, this.hideHome, this);

        EventManager.Instance.on(EVENT_ENUM.ToCreateTeam, this.createTeam, this);
        EventManager.Instance.on(EVENT_ENUM.RequestUserInfo, this.upupdateUserInfo, this);
        // EventManager.Instance.on(EVENT_ENUM.WssInited, this.wssInited, this);




        // if (this.zhanshiPrefab) {
        //     const zhanshiPrefab = instantiate(this.zhanshiPrefab);
        //     if (zhanshiPrefab && zhanshiPrefab.isValid) {
        //         this.node.addChild(zhanshiPrefab);
        //         const bodyNode = zhanshiPrefab.getChildByName('body');
        //         this.initBodySpineDemo(bodyNode);
        //     }
        // } else {
        //     console.warn('[HomeManager] zhanshiPrefab 未配置，跳过 Spine 示例');
        // }

    }

    //ws初始化完成，收到通知
    // wssInited() {
    //     if (this.noticeNode && this.noticeNode.isValid) {
    //         // 或者直接销毁
    //         this.hide();
    //     }
    //     this.noticeNode = instantiate(this.noticePrefab);
    //     this.node.addChild(this.noticeNode);
    // }

    // hide() {
    //         //如果是队员收到队长匹配成功，不判断会报错
    //         if (this.noticeNode) {
    //             console.log('this.noticeNode = ', this.noticeNode);
    //             if (this.noticeNode && this.noticeNode.isValid) {
    //                 this.noticeNode.destroy();
    //                 this.noticeNode = null;
    //             }
    //         }

    //     }

    private initBodySpineDemo(bodyNode: Node | null): void {
        if (!bodyNode) {
            console.warn('[HomeManager] bodyNode 未找到，无法初始化 Spine 示例');
            return;
        }
        const skeleton = bodyNode.getComponent(sp.Skeleton);
        if (!skeleton) {
            console.warn('[HomeManager] bodyNode 上未找到 sp.Skeleton 组件');
            return;
        }
        this.spineDemoSkeleton = skeleton;
        this.spineAnimationIndex = 0;
        // 先播放 idle 循环
        skeleton.setAnimation(0, 'idle', true);
        // 开启定时轮播其他动作
        this.unschedule(this.playNextSpineAnimation);
        this.schedule(this.playNextSpineAnimation, 3);

    }

    private playNextSpineAnimation(): void {
        if (!this.spineDemoSkeleton || !this.spineDemoSkeleton.isValid) {
            this.unschedule(this.playNextSpineAnimation);
            return;
        }
        if (this.spineDemoAnimations.length === 0) {
            return;
        }
        const animName = this.spineDemoAnimations[this.spineAnimationIndex];
        this.spineAnimationIndex = (this.spineAnimationIndex + 1) % this.spineDemoAnimations.length;

        const loopAnimations = new Set(['idle', 'mov']);
        const needLoop = loopAnimations.has(animName);

        this.spineDemoSkeleton.setAnimation(0, animName, needLoop);
        if (!needLoop) {
            // 每个非循环动作结束后回到 idle
            this.spineDemoSkeleton.addAnimation(0, 'idle', true, 0);
        }
    }

    //展示home 并且需不需要刷新用户信息 默认需要
    async showHome(needGetUserInfo: boolean = false) {
        if (this.node.children.length > 0) {
            return;
        }
        try {

            // 使用前
            Setting.Instance.init();
            this.scheduleNextRippleSound();

            if (needGetUserInfo) {
                // console.trace('当前调用栈');
                if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
                    console.warn('WebSocket 未连接，无法获取个人信息');
                    ToastManager.showToast('网络连接异常，请稍后重试【个人信息】');
                    return;
                }
                const userData = await TsRpc.Instance.Client.callApi('user/GetInfo', { __ssoToken: UserDataManager.Instance.SsoToken });
                const userInfo = userData.res.info;
                UserDataManager.Instance.UserInfo = userInfo;
                // 增加刷新usercard信息
                EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo);

            }
        } catch (e) { } finally {
            this.doRender();
        }
    }

    async upupdateUserInfo() {
        const userData = await TsRpc.Instance.Client.callApi('user/GetInfo', { __ssoToken: UserDataManager.Instance.SsoToken });
        const userInfo = userData.res.info;
        UserDataManager.Instance.UserInfo = userInfo;
        EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo);
    }

    doRender() {
        //判断有没有这三个预制体预制体
        if (!this.homedown || !this.usercard || !this.role) {
            console.log('!this.homedown || !this.usercard||!this.role');
            return;
        }
        const roleNode = instantiate(this.role);
        this.createTeamNode = roleNode.getChildByName('CreateTeam').getChildByName('bg');
        this.node.addChild(roleNode);

        //初始化用户信息usercard 预制体
        const usercardNode = instantiate(this.usercard);
        this.node.addChild(usercardNode);

        //个人武力值、点卷、积分
        const personalMoney = instantiate(this.PersonalMoney);
        this.node.addChild(personalMoney);

        //网络
        //网络状态监听
        this.newtworkView = instantiate(this.networkViewPrefab);
        this.node.addChild(this.newtworkView);
        const netWidget = this.newtworkView.getComponent(Widget) ?? this.newtworkView.addComponent(Widget);
        netWidget.isAlignTop = true;
        netWidget.top = 20;
        netWidget.isAlignRight = true;
        netWidget.right = 10;
        netWidget.isAlignBottom = false;
        netWidget.isAlignLeft = false;
        netWidget.updateAlignment();

        const homedownNode = instantiate(this.homedown);
        this.node.addChild(homedownNode);

        UIButtonUtil.initBtn(this.createTeamNode, async () => {
            const ret = await this.CheckMaintenance();
            if (ret) {
                this.createTeam();
            }
        });
        loadingManager.hideLoading();
    }




    private triggerRippleSound(): void {
        AudioManager.Instance.playOneShot(MUSIC_PATH_ENUM.eft_suihua, ConfigManager.Instance.personalSetting.soundEffectsVolume).catch((err) => {
            console.warn('[HomeManager] 播放水花音效失败', err);
        });
        this.scheduleNextRippleSound();
    }

    private scheduleNextRippleSound(): void {
        this.unschedule(this.triggerRippleSound);
        const delay = 1 + Math.random() * 5; // 3-5 秒
        this.scheduleOnce(this.triggerRippleSound, delay);
    }


    protected onDestroy(): void {
        //页面销毁 销毁监听 
        EventManager.Instance.off(EVENT_ENUM.ShowHome, this.showHome, this);
        EventManager.Instance.off(EVENT_ENUM.HideHome, this.hideHome, this);
        EventManager.Instance.off(EVENT_ENUM.ToCreateTeam, this.createTeam, this);
        EventManager.Instance.off(EVENT_ENUM.RequestUserInfo, this.upupdateUserInfo, this);
        // EventManager.Instance.off(EVENT_ENUM.WssInited, this.wssInited, this);
        this.unschedule(this.triggerRippleSound);
        this.unschedule(this.playNextSpineAnimation);
    }

    hideHome() {
        this.node.destroyAllChildren();
    }


    //检查是否维护中
    async CheckMaintenance(): Promise<boolean> {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，检查');
            ToastManager.showToast('网络连接异常，请稍后重试【检查】');
            return false;
        }
        try {
            const data = await TsRpc.Instance.Client.callApi('common/CheckMaintenance', { __ssoToken: UserDataManager.Instance.SsoToken });
            if (!data.isSucc || !data.res || data.res.isMaintenance) {
                if (!data.isSucc) {
                    ToastManager.showToast('维护中...')
                    return false;
                } else if (data.res.isMaintenance) {
                    ToastManager.showToast('维护中');
                    // ToastManager.showToast(data.res.maintenanceMessage);
                    return false;
                }
                ToastManager.showToast('紧急维护中:');
                return false;
            }
            return true;
        } catch (error) {
            ToastManager.showToast("获取比赛列表失败")
            return false;
        }
    }

    // 显示创建队伍页面 ,默认是创建，如果是点击游戏结算的返回则传入false
    async createTeam(IsCreate = true) {
        //判断是否为 创建队伍，点击按钮创建队伍要传true，游戏结束等其他逻辑传false 刷新队伍信息即可
        if (IsCreate) {
            //创建队伍成功后，还有一个获取队伍信息的函数 不需要共用下面的
            await this.createTeamRequest();
        } else {
            //如果是直接获取信息 那就获取信息
            await this.getTeamInfo();
        }
    }
    async createTeamRequest() {
        if (UserDataManager.Instance.IsDie) {
            ToastManager.showToast('您已淘汰，请先复活!');
            return;
        }
        if (!UserDataManager.Instance.CanPlayToday) {
            ToastManager.showToast("游戏次数用完，明天再来吧!")
            return;
        }
        if (!UserDataManager.Instance.CanCreateTeam) {
            ToastManager.showToast("请先购买旗鼓手!")
            return;
        }
        //输入密码
        this._fullTeamName = '';
        this.passwardInputView = instantiate(this.passwordInputPrefab);

        this.windowsNode = find('Canvas/windows');
        if (!this.windowsNode) {
            const canvasNode = find('Canvas');
            if (canvasNode) {
                this.windowsNode = canvasNode.getChildByName('windows');
                if (!this.windowsNode) {
                    this.windowsNode = new Node('windows');
                    canvasNode.addChild(this.windowsNode);
                }

                const canvasTransform = canvasNode.getComponent(UITransform);
                if (canvasTransform) {
                    const windowsTransform = this.windowsNode.getComponent(UITransform) ?? this.windowsNode.addComponent(UITransform);
                    windowsTransform.setContentSize(canvasTransform.contentSize);
                }

                const windowsWidget = this.windowsNode.getComponent(Widget) ?? this.windowsNode.addComponent(Widget);
                windowsWidget.isAlignLeft = true;
                windowsWidget.isAlignRight = true;
                windowsWidget.isAlignTop = true;
                windowsWidget.isAlignBottom = true;
                windowsWidget.left = 0;
                windowsWidget.right = 0;
                windowsWidget.top = 0;
                windowsWidget.bottom = 0;
                windowsWidget.updateAlignment();

                this.windowsNode.setSiblingIndex(canvasNode.children.length - 1);
            }
        }
        if (this.windowsNode) {
            this.windowsNode.addChild(this.passwardInputView);
            this.passwardInputView.setSiblingIndex(this.windowsNode.children.length - 1);
        } else {
            console.warn('[HomeManager] windows 节点未找到，fallback 到当前节点');
            this.node.addChild(this.passwardInputView);
            this.passwardInputView.setSiblingIndex(this.node.children.length - 1);
        }

        const sureBtn = this.passwardInputView.getChildByName('btn');
        // const passBtn = passwardInputView.getChildByName('pass');
        const closeBtn = this.passwardInputView.getChildByName('close');
        const popNode = this.passwardInputView.getChildByName('pop');
        const teamNameInput = popNode.getChildByName('teamName').getChildByName('bg').getChildByName('value').getComponent(EditBox);
        if (teamNameInput) {
            teamNameInput.node.on(EditBox.EventType.EDITING_DID_ENDED, () => {
                const fullName = teamNameInput.string;
                this._fullTeamName = fullName;                // 自己挂个字段保存真实值
                const textLabel = teamNameInput.textLabel?.getComponent(Label);
                if (textLabel) {
                    const visible = fullName.length > 5 ? fullName.slice(0, 10) + '...' : fullName;
                    textLabel.string = visible;
                }
            });
        }
        const passwardInput = popNode.getChildByName('input').getChildByName('bg').getChildByName('value').getComponent(EditBox);;
        UIButtonUtil.initBtn(closeBtn, () => {
            this.passwardInputView.destroy();
        })
        UIButtonUtil.initBtn(sureBtn, async () => {
            let numStr = passwardInput.string.trim();
            if (numStr.length == 0) {
                //无密码
            } else if (numStr.length > 0) {
                if (!isValidPositiveInteger(numStr, { allowZero: true })) {
                    ToastManager.showToast('请输入合理数字');
                    passwardInput.string = '';
                    return;
                }
            }
            if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
                console.warn('WebSocket 未连接，无法创建队伍');
                ToastManager.showToast('网络连接异常，请稍后重试【创建队伍】');
                return;
            }
            let data = null;
            loadingManager.showLoadingImmediately();
            if (numStr.length > 0) {
                data = await TsRpc.Instance.Client.callApi('team/CreateTeam', { password: numStr.length > 0 ? numStr : numStr, teamName: this._fullTeamName.length > 0 ? this._fullTeamName : UserDataManager.Instance.UserInfo.user.nickname, __ssoToken: UserDataManager.Instance.SsoToken });
            } else {
                data = await TsRpc.Instance.Client.callApi('team/CreateTeam', { teamName: this._fullTeamName.length > 0 ? this._fullTeamName : UserDataManager.Instance.UserInfo.user.nickname, __ssoToken: UserDataManager.Instance.SsoToken });

            }
            console.log('CreateTeam =', data);
            loadingManager.hideLoading();
            if (data.isSucc && data.res.id == 0) {
                if (data.res.inGame) {
                    // 有队伍并且 在游戏中
                    // this.showConfirmDialog('您参与的游戏还未结束，请稍后再试', false);
                    return;
                } else if (data.res.inTeam && !data.res.inGame) {
                    //游戏已经结束 但是在队伍中 询问是否跳转
                    // this.showConfirmDialog('您已经有队伍，需要进入么', true);
                    return;
                }
                const errorMessage = data?.res?.error || "";
                ToastManager.showToast(errorMessage || `创建队伍失败${data}`);
                return;
            } else if (!data.isSucc) {
                let errorMessage = data?.res?.error || "";
                if (errorMessage.length == 0) {
                    errorMessage = data?.err?.message || "";
                }
                ToastManager.showToast(errorMessage || `创建队伍失败${data}`);
                return;
            }
            // if (!data.isSucc) {
            //     const errorMessage = data?.err?.message || "";
            //     if (errorMessage.includes("你已经在队伍中")) {
            //         // 处理已在队伍中的情况
            //         console.log('用户已在队伍中');
            //         this.showConfirmDialog('');
            //         return;
            //     }
            //     ToastManager.showToast(errorMessage || "创建队伍失败")
            //     // ToastManager.showToast(data?.err?.message  + data?.err?.message  + data?.err?.message  +data?.err?.message || "创建队伍失败")
            //     return;
            // }
            //创建了队伍 说明自己拥有击鼓手
            loadingManager.showLoading();
            UserDataManager.Instance.IsCaptain = true;
            sureBtn.parent.destroy();
            //请求队伍信息，赋值到userdata 通知跳转、通知隐藏hall
            await this.getTeamInfo();
        });
    }

    //创建队伍失败 游戏中提示请稍后再试，未在游戏中但是在队伍中 提示进入我的队伍界面
    // showConfirmDialog(message: string, Ispop: boolean) {
    //     this.passwardInputView.destroy();
    //     const confirmDialogNode = instantiate(this.confirmDialogPrefab);
    //     if (this.windowsNode) {
    //         this.windowsNode.addChild(confirmDialogNode);
    //         this.passwardInputView.setSiblingIndex(this.windowsNode.children.length - 1);
    //     } else {
    //         console.warn('[HomeManager] windows 节点未找到，fallback 到当前节点');
    //         this.node.addChild(confirmDialogNode);
    //         this.passwardInputView.setSiblingIndex(this.node.children.length - 1);
    //     }
    //     const messgaeLabel = confirmDialogNode.getChildByName('pop').getChildByName('message').getComponent(Label);
    //     // messgaeLabel.string = '您已在队伍中或者比赛未结束,请稍后操作';
    //     messgaeLabel.string = message && message.length > 0 ? message : '创建队伍失败';
    //     const closeBtn = confirmDialogNode.getChildByName('close');
    //     const popBtn = confirmDialogNode.getChildByName('btn');
    //     UIButtonUtil.initBtn(closeBtn, () => {
    //         confirmDialogNode.destroy();
    //     });
    //     UIButtonUtil.initBtn(popBtn, async () => {
    //         confirmDialogNode.destroy();
    //         // 弹框提示是否跳转到队伍
    //         if (Ispop) {
    //             await this.getTeamInfo();
    //         }

    //     });
    // }

    async getTeamInfo() {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法获取队伍GetTeamInfo');
            ToastManager.showToast('网络连接异常，请稍后重试【队伍信息】');
            return;
        }
        loadingManager.showLoading();
        //请求队伍信息，赋值到userdata 通知跳转、通知隐藏hall
        let teamInfo = await TsRpc.Instance.Client.callApi("team/GetTeamInfo", { __ssoToken: UserDataManager.Instance.SsoToken })


        if (!teamInfo.isSucc) {
            // ToastManager.showToast('加入队伍后，获取队伍信息异常');
            ToastManager.showToast('获取队伍信息异常');
            return;
        }
        if (!teamInfo.res.hasTeam) {
            ToastManager.showToast('队伍不存在');
            //通知刷新队伍列表
            // this.doRender();
            return;
        }
        //赋值队伍信息
        TeamInfoManager.Instance.TeamInfo = teamInfo.res.info;
        //显示队伍详情大厅
        EventManager.Instance.emit(EVENT_ENUM.ShowTeam);
        //隐藏队伍大厅列表
        EventManager.Instance.emit(EVENT_ENUM.HideHall);
    }



    update(deltaTime: number) {




    }








}



