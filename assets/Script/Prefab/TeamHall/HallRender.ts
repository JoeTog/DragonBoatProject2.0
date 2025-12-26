import { _decorator, Color, Component, EditBox, instantiate, Label, Node, Overflow, Prefab, ScrollView, Sprite, SpriteFrame, VerticalTextAlignment } from 'cc';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, popType, PREFAB_PATH_ENUM } from '../../Data/Enum';
import { TsRpc } from '../../Net/TsRpc';
import UserDataManager from '../../Data/UserDataManager';
import { ToastManager } from '../UI/ToastManager';
import { EnrichedBagItem, IShopItem, ITeam, ITeamBase } from '../../Net/Shared/models/Interfaces';
import { isValidPositiveInteger, loadAvatar, resAssetLoad, truncateString } from '../../Base/Utils';
import { BAG_CONFIG, IMG_URL_EXTRA_PARAM } from '../../Config';
import { TeamInfoManager } from '../../Data/TeamInfoManager';
import { loadingManager } from '../UI/LoadingManager';
import { PopViewManager } from '../UI/Notice/PopViewManager';
const { ccclass, property } = _decorator;

@ccclass('HallRender')
export class HallRender extends Component {

    @property(Prefab)
    hallCellPrefab: Prefab = null;

    @property(Prefab)
    hallCellNullPrefab: Prefab = null;

    @property(Node)
    contentView: Node = null;

    @property(Prefab)
    passwordInputPrefab: Prefab;

    @property(Prefab)
    pushNoticePrefab: Prefab;

    @property(Prefab)
    PersonalMoney: Prefab = null;
    @property(Prefab)
    popViewPrefab: Prefab = null;




    private closeBtn: Node = null;
    private createTeamBtn: Node = null;
    private refreshBtn: Node = null;

    private teamList: ITeamBase[] = [];
    private teamNodemap: Map<number, Node> = new Map();

    private _fullTeamName: string = null;



    protected onLoad(): void {

        const popNode = this.node.getChildByName('pop');
        this.closeBtn = popNode.getChildByName('close');
        UIButtonUtil.initBtn(this.closeBtn, () => {
            this.node.destroy();
        })

        this.createTeamBtn = popNode.getChildByName('create_btn');
        UIButtonUtil.initBtn(this.createTeamBtn, () => {
            this.toCreateTeam();//通知
        });

        this.refreshBtn = popNode.getChildByName('refresh');
        UIButtonUtil.initBtn(this.refreshBtn, () => {
            //展请求展示队伍列表
            this.doRender();
        });

        //注册通知 销毁队伍大厅
        EventManager.Instance.on(EVENT_ENUM.HideHall, this.hidehall, this);
        EventManager.Instance.on(EVENT_ENUM.AddTeam, this.AddTeam, this);
        EventManager.Instance.on(EVENT_ENUM.DelTeam, this.DelTeam, this);


        const pushNoticeNode = instantiate(this.pushNoticePrefab);
        this.node.addChild(pushNoticeNode);

        const personalMoney = instantiate(this.PersonalMoney);
        this.node.addChild(personalMoney);
        const powerLabel = personalMoney.getChildByName('Root').getChildByName('PowerNode').getChildByName('label');
        const IntegralLabel = personalMoney.getChildByName('Root').getChildByName('IntegralNode').getChildByName('label');
        const djLabel = personalMoney.getChildByName('Root').getChildByName('djNode').getChildByName('label');
        powerLabel.active = false;
        IntegralLabel.active = false;
        djLabel.active = false;

        //展请求展示队伍列表
        this.doRender();

        const SingleBtn = this.node.getChildByName('pop').getChildByName('SingleBtn');
        SingleBtn.active = false;
        UIButtonUtil.initBtn(SingleBtn, () => {
            //单机游戏
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.SingleGame,
                source: popType.null
            });

            // this.singleGameViewNode = instantiate(this.SingleGameView);
            // this.node.addChild(this.singleGameViewNode);
        });

    }

    AddTeam(team: ITeamBase) {

        this.renderOne(team);
        const popNode = this.node.getChildByName('pop');


    }

    DelTeam(teamid: number) {

        // console.log('=== 删除队伍 ===');
        // console.log('传入的 teamid:', teamid, '类型:', typeof teamid);
        // console.log('Map 中的所有 key:', Array.from(this.teamNodemap.keys()));
        // console.log('Map 的大小:', this.teamNodemap.size);

        this.teamList = this.teamList.filter(team => team.id !== teamid);
        const delNode = this.teamNodemap.get(teamid);
        // console.log('获取到的节点:', delNode);


        if (delNode && delNode.isValid) {

            delNode.destroy();
            this.teamNodemap.delete(teamid);
        }

    }

    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.HideHall, this.hidehall, this);
        EventManager.Instance.off(EVENT_ENUM.AddTeam, this.AddTeam, this);
        EventManager.Instance.off(EVENT_ENUM.DelTeam, this.DelTeam, this);
        this.unscheduleAllCallbacks();
    }


    async doRender() {

        this.contentView.destroyAllChildren();
        const data = await this.getListData();
        loadingManager.hideLoading();
        // this.teamList = data;
        let i = 0;
        const render = () => {
            if (i < data.length) {
                this.renderOne(data[i]);
                i++;
            } else {

                // const hallTeamCell = instantiate(this.hallCellNullPrefab);
                // this.contentView.addChild(hallTeamCell);
                this.unschedule(render);
            }
        };

        this.schedule(render, 0.01);


    }

    renderOne(data: ITeam) {
        this.teamList.push(data);

        const hallTeamCell = instantiate(this.hallCellPrefab);
        this.teamNodemap.set(data.id, hallTeamCell);
        this.contentView.addChild(hallTeamCell);
        const avatarNode = hallTeamCell.getChildByName('avatar')?.getChildByName('mask')?.getChildByName('img');
        const avatarIconSprite = avatarNode?.getComponent(Sprite);
        const capitainVipNode = hallTeamCell.getChildByName('avatar')?.getChildByName('vip');
        const capitainVipSprite = capitainVipNode?.getComponent(Sprite);
        const nameLabel = hallTeamCell.getChildByName('name').getComponent(Label);
        const numLabel = hallTeamCell.getChildByName('count').getChildByName('value').getComponent(Label);
        const joinBtn = hallTeamCell.getChildByName('join_btn');

        const teamMember = hallTeamCell.getChildByName('teamMember')
        const vipNodeFirst = teamMember?.getChildByName('first')?.getChildByName('vip');
        const vipNodeFirstSprite = vipNodeFirst?.getComponent(Sprite);
        const vipNodeSec = teamMember?.getChildByName('sec')?.getChildByName('vip');
        const vipNodeSecSprite = vipNodeSec?.getComponent(Sprite);
        const vipNodeThree = teamMember?.getChildByName('three')?.getChildByName('vip');
        const vipNodeThreeSprite = vipNodeThree?.getComponent(Sprite);
        const vipNodeFouth = teamMember?.getChildByName('fouth')?.getChildByName('vip');
        const vipNodeFouthSprite = vipNodeFouth?.getComponent(Sprite);

        if (data.hasPassword) {
            const passwardNode = hallTeamCell.getChildByName('join_btn').getChildByName('locked');
            passwardNode.active = true;
            // const joinLabel = hallTeamCell.getChildByName('join_btn').getChildByName('label').getComponent(Label);
            // joinLabel.string = '输入密码';
            // isLockedIcon.active = true;
        } else {
            const normal = hallTeamCell.getChildByName('join_btn').getChildByName('joinLabel');
            normal.active = true;
        }
        let avatarUrl = data.avatar + IMG_URL_EXTRA_PARAM;
        loadAvatar(avatarUrl).then((res: SpriteFrame) => {
            // 检查节点和组件是否仍然有效
            if (avatarIconSprite && avatarIconSprite.isValid && hallTeamCell && hallTeamCell.isValid) {
                avatarIconSprite.spriteFrame = res;
            }
        }).catch((err) => {
            console.warn('加载头像失败:', err);
        });

        let iconurl1 = "Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip1/spriteFrame";
        let iconurl2 = "Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip2/spriteFrame";
        let iconurl3 = "Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip3/spriteFrame";
        let iconurl4 = "Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip4/spriteFrame";
        let iconurl5 = "Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip5/spriteFrame";
        resAssetLoad<SpriteFrame>(iconurl1, SpriteFrame).then(res => {
            capitainVipSprite.spriteFrame = res;
        }).catch((err) => {
            console.error("vip图标 加载失败: " + err);
        });
        resAssetLoad<SpriteFrame>(iconurl2, SpriteFrame).then(res => {
            vipNodeFirstSprite.spriteFrame = res;
        }).catch((err) => {
            console.error("vip图标 加载失败: " + err);
        });
        resAssetLoad<SpriteFrame>(iconurl3, SpriteFrame).then(res => {
            vipNodeSecSprite.spriteFrame = res;
        }).catch((err) => {
            console.error("vip图标 加载失败: " + err);
        });
        resAssetLoad<SpriteFrame>(iconurl4, SpriteFrame).then(res => {
            vipNodeThreeSprite.spriteFrame = res;
        }).catch((err) => {
            console.error("vip图标 加载失败: " + err);
        });
        resAssetLoad<SpriteFrame>(iconurl5, SpriteFrame).then(res => {
            vipNodeFouthSprite.spriteFrame = res;
        }).catch((err) => {
            console.error("vip图标 加载失败: " + err);
        });

        // nameLabel.string = data.name;
        nameLabel.string = truncateString(data.name);
        numLabel.string = `${data.playersCount}/${data.maxCount}`;

        UIButtonUtil.initBtn(joinBtn, () => {
            this.joinTeam(data.id, data.status, data.name, data.hasPassword);
        });
        // if (data.hasPassword) {

        // this.contentView.addChild(hallTeamCell);
        // }

    }

    async joinTeam(iddd: number, status: number, teamNameD: string, isNeedPassword: boolean) {
        if (UserDataManager.Instance.IsDie) {
            ToastManager.showToast('您已淘汰，请先复活');

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
                    this.node.destroy();
                }
            };
            this.node.addChild(popV);

            return;
        }
        if (!UserDataManager.Instance.CanPlayToday) {
            ToastManager.showToast("游戏次数用完，明天再来吧")
            return;
        }
        if (status !== 0) {
            ToastManager.showToast("队伍不允许加入")
            return;
        }
        // if (UserDataManager.Instance.UserInfo.power < 10000) {
        //     ToastManager.showToast("武力值不足一万")
        //     return;
        // }
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法加入队伍');
            ToastManager.showToast('网络连接异常，请稍后重试【加入队伍】');
            return;
        }
        if (!isNeedPassword) {
            // let numStr = passwardInput.string.trim();
            let data = await TsRpc.Instance.Client.callApi("team/JoinTeam", { id: iddd, __ssoToken: UserDataManager.Instance.SsoToken })
            // console.log('JoinTeam = ', data);
            if (!data.isSucc) {
                //加入成功 跳转到队伍界面
                const errMsg = data?.err?.message || "加入队伍失败";
                ToastManager.showToast(errMsg);
                //这里没有输入密码，不会有密码错误提示，武力值不足会有提示
                if (!errMsg.includes('不足')) {
                    this.doRender();
                }
                return;
            }
            await this.requestGetTeamInfo();
            return;
        }

        //输入密码
        const passwardInputView = instantiate(this.passwordInputPrefab);
        this.node.addChild(passwardInputView);
        const sureBtn = passwardInputView.getChildByName('btn');
        // const passBtn = passwardInputView.getChildByName('pass');
        const closeBtn = passwardInputView.getChildByName('close');
        const teamNameNode = passwardInputView
            .getChildByName('pop')
            ?.getChildByName('teamName')
            ?.getChildByName('bg')
            ?.getChildByName('value');
        const teamNameInput = teamNameNode?.getComponent(EditBox);
        if (teamNameInput) {
            teamNameInput.enabled = false;
            const editLabel = teamNameInput.textLabel?.getComponent(Label);
            if (editLabel) {
                editLabel.color = Color.GRAY;
            }
            // teamNameInput.node.on(EditBox.EventType.EDITING_DID_ENDED, () => {
            //     const fullName = teamNameInput.string;
            //     // this._fullTeamName = fullName;                // 自己挂个字段保存真实值
            //     const textLabel = teamNameInput.textLabel?.getComponent(Label);
            //     if (textLabel) {
            //         const visible = fullName.length > 5 ? fullName.slice(0, 8) + '...' : fullName;
            //         textLabel.string = visible;
            //     }
            // });
        }
        if (teamNameInput) {
            teamNameInput.string = teamNameD?.length ? teamNameD : '空';
        } else {
            console.warn('[HallRender] teamName EditBox 未找到');
        }
        const popNode = passwardInputView.getChildByName('pop');
        const passwardInputRoot = popNode.getChildByName('input');
        const passwardInputValue = passwardInputRoot.getChildByName('bg').getChildByName('value');
        const passwardInput = passwardInputValue.getComponent(EditBox);
        const placeHolder = passwardInputValue.getChildByName('PLACEHOLDER_LABEL').getComponent(Label);
        placeHolder.string = '请输入密码';
        UIButtonUtil.initBtn(closeBtn, () => {
            passwardInputView.destroy();
        })
        UIButtonUtil.initBtn(sureBtn, async () => {
            let numStr = passwardInput.string.trim();
            if (!isValidPositiveInteger(numStr, { allowZero: true })) {
                ToastManager.showToast('请输入合理数字');
                passwardInput.string = '';
                return;
            }
            if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
                console.warn('WebSocket 未连接，无法加入队伍');
                ToastManager.showToast('网络连接异常，请稍后重试【加入队伍】');
                return;
            }
            let data = await TsRpc.Instance.Client.callApi("team/JoinTeam", { password: numStr, id: iddd, __ssoToken: UserDataManager.Instance.SsoToken })
            // console.log('JoinTeam = ', data);
            if (!data.isSucc) {
                const errMsg = data?.err?.message || "加入队伍失败";
                ToastManager.showToast(errMsg);
                if (!errMsg.includes('密码错误') && !errMsg.includes('不足')) {
                    this.doRender();
                }
                return;
            }
            sureBtn.parent.destroy();
            //加入成功 跳转到队伍界面
            await this.requestGetTeamInfo();
        });
        // UIButtonUtil.initBtn(passBtn, async () => {
        //     // let numStr = passwardInput.string.trim();
        //     let data = await TsRpc.Instance.Client.callApi("team/JoinTeam", { id: iddd, __ssoToken: UserDataManager.Instance.SsoToken })
        //     // console.log('JoinTeam = ', data);
        //     if (!data.isSucc) {
        //         //加入成功 跳转到队伍界面
        //         ToastManager.showToast(data?.err?.message || "加入队伍失败")
        //         return;
        //     }
        //     passBtn.parent.destroy();
        //     await this.requestGetTeamInfo();
        // });
    }

    async requestGetTeamInfo() {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法获取队伍信息');
            ToastManager.showToast('网络连接异常，请稍后重试【队伍信息】');
            return;
        }
        //请求队伍信息，赋值到userdata 通知跳转、通知隐藏hall
        let teamInfo = await TsRpc.Instance.Client.callApi("team/GetTeamInfo", { __ssoToken: UserDataManager.Instance.SsoToken })
        if (!teamInfo.isSucc) {
            ToastManager.showToast('加入队伍后，获取队伍信息异常');
            return;
        }
        if (!teamInfo.res.hasTeam) {
            ToastManager.showToast('队伍不存在');
            //通知刷新队伍列表
            this.doRender();
            return;
        }
        //赋值队伍信息
        TeamInfoManager.Instance.TeamInfo = teamInfo.res.info;
        //显示队伍详情大厅
        EventManager.Instance.emit(EVENT_ENUM.ShowTeam);
        //隐藏队伍大厅列表
        EventManager.Instance.emit(EVENT_ENUM.HideHall);
    }

    async getListData(): Promise<ITeamBase[]> {

        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法获取队伍列表');
            ToastManager.showToast('网络连接异常，请稍后重试【获取商品】');
            return [];
        }

        let data = await TsRpc.Instance.Client.callApi("team/GetTeamList", { __ssoToken: UserDataManager.Instance.SsoToken })
        if (data.isSucc) {
            return data.res.teams;
        } else {

            ToastManager.showToast(data?.err?.message || "队伍显示失败");
            return [];
        }
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

    hidehall() {

        // console.log('HallRender node = ', this.node);

        if (!this.node || !this.node.isValid) {
            console.log('节点已销毁，跳过');
            return;
        }

        this.node.destroy();
    }

    toCreateTeam() {
        //首页底部的组件中 创建队伍的 这里只需要通知
        EventManager.Instance.emit(EVENT_ENUM.ToCreateTeam);
    }








    update(deltaTime: number) {

    }



}

