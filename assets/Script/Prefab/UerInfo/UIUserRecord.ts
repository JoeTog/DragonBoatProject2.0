import { _decorator, Color, color, Component, easing, instantiate, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame, tween, v3, warn, Widget } from 'cc';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { EnrichedBagItem, IGameRecord, IShopItem } from '../../Net/Shared/models/Interfaces';
import { TsRpc } from '../../Net/TsRpc';
import UserDataManager from '../../Data/UserDataManager';
import { ResGetPowerRecord } from '../../Net/Shared/protocols/user/PtlGetPowerRecord';
import { BigNumUtils, loadAvatar, resAssetLoad, TimeDateUtils } from '../../Base/Utils';
import { EVENT_ENUM, powerRecordType, UnfreezeStatus } from '../../Data/Enum';
import EventManager from '../../Base/EventManager';
import { ResUnfreezePowerRecord } from '../../Net/Shared/protocols/user/PtlUnfreezePowerRecord';
import { ToastManager } from '../UI/ToastManager';
import { loadingManager } from '../UI/LoadingManager';
import { PopViewManager } from '../UI/Notice/PopViewManager';
import { BAG_CONFIG, IMG_URL_EXTRA_PARAM } from '../../Config';
import { JoeFunc } from '../../Base/JoeFunc';


enum RecordType {
    /** 个人比赛记录 */
    personalGameRecord,
    /** 武力值记录 */
    powerRecord,
}

const { ccclass, property } = _decorator;

type PowerRecordItemData = ResGetPowerRecord['list'][number];

@ccclass('UIUserInfo')
export class UIUserRecord extends Component {

    @property(Prefab)
    recordItem: Prefab = null;
    @property(Prefab)
    powerRecordItem: Prefab = null;
    @property(Prefab)
    popViewPrefab: Prefab = null;
    @property(Node)
    contentViewNode: Node = null;
    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Node)
    historyGameChosed: Node = null;
    @property(Node)
    historyGameUnChosed: Node = null;
    @property(Node)
    historyPowerChosed: Node = null;
    @property(Node)
    historyPowerUnChosed: Node = null;

    
    //为了分页功能
    public recordType: RecordType = RecordType.personalGameRecord;

    private popNode: Node = null;
    private closeNode: Node = null;

    private totalNum: number = 0;// 总记录数
    private pageNum: number = 1;// 当前页码 默认1
    private pageSize: number = 20;// 每页数量
    private isLoadingPowerRecord: boolean = false;//是否加载的武力值记录
    private hasMorePowerRecord: boolean = true;

    //是否含有复活中的武力值记录，用于点击复活的时候提示 是否取消上一个
    private IshasInResurrection: boolean = false;

    private gameRecordData: IGameRecord[] = [];
    private powerRecordData: IGameRecord[] = [];







    protected onLoad(): void {

        this.popNode = this.node.getChildByName("pop");
        this.popNode.setScale(v3(0, 0, 0));

        tween(this.popNode)
            .to(0.2, { scale: v3(1, 1, 1) }, { easing: 'backInOut' })
            .start();

        this.closeNode = this.popNode.getChildByName("close_res")
        UIButtonUtil.initBtn(this.closeNode, () => {
            this.node.destroy();
        })

        this.doPersonalInfo();
        // if (this.IsPersonalGameResult) {
        //     this.titlelabel.string = '游戏记录';
        //     loadingManager.showLoading();
        //     this.doRenderPersonalGameR()
        // } else if (this.IsPowerRecord) {
        //     this.titlelabel.string = '武力值记录';
        //     loadingManager.showLoading();
        //     this.doRenderPowerRecord();
        // }

        this.historyGameChosed.active = true;
        this.historyPowerUnChosed.active = true;

        this.doRenderPersonalGameR();


        UIButtonUtil.initBtn(this.historyGameUnChosed, () => {
            this.historyGameChosed.active = true;
            this.historyGameUnChosed.active = false;
            this.historyPowerChosed.active = false;
            this.historyPowerUnChosed.active = true;
            this.recordType = RecordType.personalGameRecord;
            this.doRenderPersonalGameR();
        });
        UIButtonUtil.initBtn(this.historyPowerUnChosed, () => {
            this.historyGameChosed.active = false;
            this.historyGameUnChosed.active = true;
            this.historyPowerChosed.active = true;
            this.historyPowerUnChosed.active = false;
            this.recordType = RecordType.powerRecord;
            this.doRenderPowerRecord();
        });




        const scrollNode = this.scrollView?.node;
        scrollNode?.on(ScrollView.EventType.SCROLL_TO_BOTTOM, this.onScrollToBottom, this);

    }

    doPersonalInfo() {

        const myInfo = this.node.getChildByName('pop').getChildByName('MyInfo').getChildByName('info');
        const nameLabel = myInfo.getChildByName('nameBg').getChildByName('name').getComponent(Label);
        const avatar = myInfo.getChildByName('avatar').getChildByName('mask').getChildByName('img').getComponent(Sprite);
        const vip = myInfo.getChildByName('avatar').getChildByName('vip').getComponent(Sprite);
        const idValueLabel = myInfo.getChildByName('ID').getChildByName('idValue').getComponent(Label);
        const idValueCopy = myInfo.getChildByName('ID').getChildByName('copyBtn');
        const totalGameValueLabel = myInfo.getChildByName('totalGame').getChildByName('totalGameValue').getComponent(Label);
        const rateValueLabel = myInfo.getChildByName('rate').getChildByName('rateValue').getComponent(Label);
        const powerValueLabel = myInfo.getChildByName('power').getChildByName('powerValue').getComponent(Label);

        nameLabel.string = UserDataManager.Instance.UserInfo.user.nickname;
        let avatarUrl = UserDataManager.Instance.UserInfo.user.avatar + IMG_URL_EXTRA_PARAM;
        loadAvatar(avatarUrl).then((res: SpriteFrame) => {
            // 检查节点和组件是否仍然有效
            avatar.spriteFrame = res;
        }).catch((err) => {
            console.warn('加载头像失败:', err);
        });
        //vipResurrectionPic
        let iconurl = UserDataManager.Instance.vipResurrectionPic;
        resAssetLoad<SpriteFrame>(iconurl, SpriteFrame).then(res => {
            vip.spriteFrame = res;
        }).catch((err) => {
            console.error("icon加载失败: " , err);
        });
        idValueLabel.string = `ID:${UserDataManager.Instance.UserInfo.player_code}`;
        UIButtonUtil.initBtn(idValueCopy, () => {
            let ret = JoeFunc.copyToClipboard(UserDataManager.Instance.UserInfo.player_code);
            if (ret) {
                ToastManager.showToast('复制成功');
            }
        });
        let {
            user, power, win_games, total_games, point, times, times_max
        } = UserDataManager.Instance.UserInfo;
        let winnum = win_games == 0 || total_games == 0 ? 0 : win_games / total_games * 100;
        if (winnum >= 100) {
            winnum = 100;
        }
        totalGameValueLabel.string = `${total_games}次`
        rateValueLabel.string = winnum.toFixed(2) + "%";
        powerValueLabel.string = BigNumUtils.getNumberStringWan(power);

    }

    //武力值记录 item
    doSenderOnePowerRecord(recordItem: PowerRecordItemData) {
        const powerRecordItemNode = instantiate(this.powerRecordItem);
        // const taskTypeNode = powerRecordItemNode.getChildByName('first').getChildByName('type');
        // const taskTypeThaw = taskTypeNode.getChildByName('ThawBg');
        // const taskTypeFail = taskTypeNode.getChildByName('FailBg');
        // const taskTypeEliminate = taskTypeNode.getChildByName('EliminateBg');
        // const taskTypeExChange = taskTypeNode.getChildByName('ExChangeBg');
        // const ElininateBtnBg = taskTypeEliminate.getChildByName('ElininateBtnBg');
        // const ResurrectionBg = ElininateBtnBg.getChildByName('ResurrectionBg');
        // const InResurrectionBg = ElininateBtnBg.getChildByName('InResurrectionBg');
        // const CancelResurrectionBg = ElininateBtnBg.getChildByName('CancelResurrectionBg');
        // const CompeleteResurrectionBg = ElininateBtnBg.getChildByName('CompeleteResurrectionBg');
        // const detailLabel = powerRecordItemNode.getChildByName('first').getChildByName('detail').getComponent(Label);
        // const dateLabel = powerRecordItemNode.getChildByName('first').getChildByName('dateTime').getComponent(Label);
        // dateLabel.string = TimeDateUtils.formatTimestamp(recordItem.time * 1000);


        const power = powerRecordItemNode.getChildByName('bg').getChildByName('Root').getChildByName('power').getComponent(Label);
        const date = powerRecordItemNode.getChildByName('bg').getChildByName('Root').getChildByName('date').getComponent(Label);
        //判断显示类型
        if (recordItem.operationType === powerRecordType.ExChange) {
            //兑换点卷
            power.string = `${recordItem.amount}武力值`;
            date.string = TimeDateUtils.formatTimestampForPowerRecord(recordItem.time * 1000);

        }

        this.contentViewNode.addChild(powerRecordItemNode);

    }


    //监听scrollerview划到底部
    private onScrollToBottom() {
        if (!this.hasMorePowerRecord) return;

        if (this.recordType == RecordType.personalGameRecord) {

        } else if (this.recordType == RecordType.powerRecord) {
            this.loadMorePowerRecord();
        }

    }

    protected onDestroy(): void {

        const scrollNode = this.scrollView?.node;
        scrollNode?.off(ScrollView.EventType.SCROLL_TO_BOTTOM, this.onScrollToBottom, this);
        this.unscheduleAllCallbacks()
    }


    async doRenderPowerRecord() {
        this.resetPowerRecordState();
        await this.fetchPowerRecordPage(true);
    }

    //加载更多
    public async loadMorePowerRecord() {
        await this.fetchPowerRecordPage(false);
    }

    private resetPowerRecordState() {
        this.totalNum = 0;
        this.pageNum = 1;
        this.pageSize = Math.max(this.pageSize, 1);
        this.hasMorePowerRecord = true;
        this.isLoadingPowerRecord = false;
        this.contentViewNode.destroyAllChildren();
    }

    private async fetchPowerRecordPage(reset: boolean) {
        if (this.isLoadingPowerRecord) {
            return;
        }
        if (!reset && !this.hasMorePowerRecord) {
            return;
        }

        const targetPage = reset ? 1 : this.pageNum;
        this.isLoadingPowerRecord = true;
        const records = await this.getPowerRecordData(targetPage);
        this.isLoadingPowerRecord = false;

        if (!records || records.length === 0) {
            if (reset) {
                this.hasMorePowerRecord = false;
            }
            return;
        }
        this.renderPowerRecordItems(records);
    }

    //武力值记录 item
    private renderPowerRecordItems(records: PowerRecordItemData[]) {
        for (const record of records) {
            this.doSenderOnePowerRecord(record);
        }
    }

    async requestFreePower(recordid: number): Promise<ResUnfreezePowerRecord> {
        const data = await TsRpc.Instance.Client.callApi('user/UnfreezePowerRecord', { recordId: recordid, __ssoToken: UserDataManager.Instance.SsoToken })

        if (!data.isSucc) {
            ToastManager.showToast(data.err.message ? '复活失败333 ' + `${data.err.message}` : '复活失败333');
            return;
        }
        //复活成功 扣掉复活币
        UserDataManager.Instance.delBag(5);
        UserDataManager.Instance.UserInfo.freezePower = data.res.newFreezePower;
        EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo);
        return data.res;

    }


    //比赛记录
    doSenderOnePersonalGameR(recordItem: IGameRecord) {
        // console.log(typeof dayjs, dayjs );
        // 初始化 create_time 为 2025-08-23（对应日期对象）
        // const yearmon = dayjs(recordItem.create_time).format('YYYY-MM-DD'); // "2025-11-08"
        // const time = dayjs(recordItem.create_time).format('HH:mm');
        //比赛结果：-1平局，0失败，1胜利
        const date = recordItem.create_time;
        let IsDZ: boolean = false;
        if (recordItem.captain_id == UserDataManager.Instance.UserInfo.uid) {
            IsDZ = true;
        }
        const recordItemNode = instantiate(this.recordItem);
        const leftNode = recordItemNode.getChildByName('left');
        const dateLabel = leftNode.getChildByName('date').getComponent(Label);
        const resultTitle = leftNode.getChildByName('title');
        const gameTypeBg = recordItemNode.getChildByName('gameTypeBg');
        //队伍胜利、失败、平局
        const successBg = gameTypeBg.getChildByName('success');
        const failBg = gameTypeBg.getChildByName('fail');
        const drawBg = gameTypeBg.getChildByName('draw');
        //个人淘汰、完赛
        const rightNode = recordItemNode.getChildByName('right');
        const rightTopNode = rightNode.getChildByName('top');
        const personalIsEliminate = rightTopNode.getChildByName('personalIsEliminate');
        //是否队长
        const captain = rightTopNode.getChildByName('isCaptain').getChildByName('captain');
        const member = rightTopNode.getChildByName('isCaptain').getChildByName('member');
        //第几轮失败
        const rightBottomNode = rightNode.getChildByName('bottom');
        const roundLabel = rightBottomNode.getChildByName('roundLabel');
        const failLabel = rightBottomNode.getChildByName('failReason').getComponent(Label);
        //复活按钮
        const eliminateBtn = rightNode.getChildByName('eliminateBtn');
        // const eliminateFinishBtn = rightNode.getChildByName('eliminateFinishBtn');

        if (recordItem.revival_status == UnfreezeStatus.can_revive) {
            eliminateBtn.active = true;
        } else if (recordItem.revival_status == UnfreezeStatus.revived) {
            // eliminateFinishBtn.active = true;
        }
        UIButtonUtil.initBtn(eliminateBtn, () => {
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
        });
        roundLabel.getComponent(Label).string = `第${recordItem.task_detail.taskIndex}轮`;
        if (!recordItem.task_detail.failReason || recordItem.task_detail.failReason.length == 0) {
            failLabel.string = '您已完成所有任务！';
            roundLabel.active = false;
            failLabel.getComponent(Widget).left = 5;
            personalIsEliminate.getComponent(Label).string = '个人完赛';
        } else {
            failLabel.string = recordItem.task_detail.failReason;
            personalIsEliminate.getComponent(Label).string = '个人淘汰';
        }
        // const datePlus8 = new Date(date.getTime() + 8 * 60 * 60 * 1000);
        const datePlus8 = new Date(date.getTime());
        dateLabel.string = `${datePlus8.toLocaleDateString('zh-CN')}` + ' ' + `${datePlus8.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
        //         const base = new Date(date).getTime();
        //   if (isNaN(base)) return;
        //   const bj = new Date(base + 8 * 3600 * 1000);
        //   const pad = (n:number)=>n.toString().padStart(2,'0');
        // let timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        // const hh = parseInt(timeStr.slice(0, 2), 10);
        // if (!isNaN(hh)) {
        //     const nh = (hh + 8) % 24;
        //     const h2 = nh < 10 ? '0' + nh : '' + nh;
        //     timeStr = h2 + timeStr.slice(2);
        // }
        // timeeLabel.string = timeStr;
        if (recordItem.team_res == 1) {
            //胜利
            successBg.active = true;
        } else if (recordItem.team_res == 0) {
            //失败
            failBg.active = true;
        } else {
            //平局
            drawBg.active = true;
        }
        if (IsDZ) {
            captain.active = true;
        } else {
            member.active = true;
        }

        this.contentViewNode.addChild(recordItemNode);

    }

    async doRenderPersonalGameR() {
        // 清空内容 防止重复添加
        loadingManager.showLoading();
        this.contentViewNode.destroyAllChildren();
        if (!this.gameRecordData || this.gameRecordData.length <= 0) {
            this.gameRecordData = await this.getGameRecordData();
        }
        let i = 0;
        const render = () => {
            if (i < this.gameRecordData.length) {
                this.doSenderOnePersonalGameR(this.gameRecordData[i]);
                i++;
            } else {
                loadingManager.hideLoading();
                this.unscheduleAllCallbacks();
            }
        };
        this.schedule(render, 0.01);
    }

    //获取武力值记录
    async getPowerRecordData(page: number = 1): Promise<PowerRecordItemData[]> {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法获取游戏记录');
            ToastManager.showToast('网络连接异常，请稍后重试【获取记录】');
            this.hasMorePowerRecord = false;
            loadingManager.hideLoading();
            return [];
        }
        try {
            const data = await TsRpc.Instance.Client.callApi('user/GetPowerRecord', {
                page: page,
                pageSize: this.pageSize,
                __ssoToken: UserDataManager.Instance.SsoToken
            });
            if (!data.isSucc || !data.res || !data.res.list) {
                console.error('获取武力值记录失败:', data.err?.message || '未知错误');
                ToastManager.showToast("获取武力值记录失败")
                this.hasMorePowerRecord = false;
                loadingManager.hideLoading();
                return [];
            }
            const { list, total, page: currentPage, pageSize } = data.res;
            loadingManager.hideLoading();

            if (typeof total === 'number') {
                this.totalNum = total;
            }
            // if (typeof pageSize === 'number' && pageSize > 0) {
            //     this.pageSize = pageSize;
            // }

            const resolvedCurrentPage = typeof currentPage === 'number' ? currentPage : page;
            this.pageNum = resolvedCurrentPage + 1;

            const effectivePageSize = this.pageSize > 0 ? this.pageSize : list.length || 1;
            const totalPages = effectivePageSize > 0 ? Math.ceil(this.totalNum / effectivePageSize) : 0;
            this.hasMorePowerRecord = list.length > 0 && (totalPages === 0 ? false : this.pageNum <= totalPages);

            // const arr: PowerRecordItemData[] = [];
            // for (let index = 0; index < list.length; index++) {
            //     const element = list[index];
            //     if (element.unfreezeStatus) {
            //         arr.push(element);
            //     }
            // }
            // console.log('arr = ', arr);
            // return arr;
            return list;

        } catch (error) {
            console.error('获取武力值记录失败:', error);
            ToastManager.showToast("获取武力值记录失败")
            this.hasMorePowerRecord = false;
            loadingManager.hideLoading();
            return [];
        }
    }

    //获取比赛记录
    async getGameRecordData(): Promise<IGameRecord[]> {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法获取游戏记录');
            ToastManager.showToast('网络连接异常，请稍后重试【获取记录】');
            loadingManager.hideLoading();
            return;
        }
        try {
            const data = await TsRpc.Instance.Client.callApi('user/GetGameRecord', { uid: UserDataManager.Instance.UserInfo.uid, __ssoToken: UserDataManager.Instance.SsoToken });
            if (!data.isSucc || !data.res || !data.res.list) {
                console.error('获取比赛列表失败:', data.err?.message || '未知错误');
                ToastManager.showToast("获取比赛列表失败")
                loadingManager.hideLoading();
                return [];
            }
            return data.res.list;
        } catch (error) {
            ToastManager.showToast("获取比赛列表失败")
            loadingManager.hideLoading();
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

    update(deltaTime: number) {

    }
}

