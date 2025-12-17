import { _decorator, Component, Node } from 'cc';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { ResGetGameConfig } from '../../Net/Shared/protocols/PtlGetGameConfig';
import { TsRpc } from '../../Net/TsRpc';
import { ToastManager } from '../UI/ToastManager';
import UserDataManager from '../../Data/UserDataManager';
import ConfigManager from '../../Base/ConfigManager';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, popType, PREFAB_PATH_ENUM } from '../../Data/Enum';
import { loadingManager } from '../UI/LoadingManager';
import { TaskMessageDto } from '../../Net/Shared/protocols/user/PtlGetTaskMessages';
import { MyTask } from '../MyTask/MyTask';
const { ccclass, property } = _decorator;

@ccclass('BottomMuneView')
export class BottomMuneView extends Component {

    @property(Node)
    bagBtn: Node = null;
    @property(Node)
    shopBtn: Node = null;
    @property(Node)
    taskBtn: Node = null;
    @property(Node)
    noticeBtn: Node = null;
    @property(Node)
    messageBtn: Node = null;
    @property(Node)
    messageBage: Node = null;


    protected onLoad(): void {

        this.requestInfoData();
        this.doRender();

        EventManager.Instance.on(EVENT_ENUM.systemMessageUpdate,this.requestInfoData,this);

    }



    async requestInfoData() {
        const gameConfig: ResGetGameConfig = await this.requestGameConfig();
        const gonggaoArr = gameConfig.game_notice
            .split(/\r?\n+/)        // 按换行拆分
            .map(s => s.trim())
            .filter(Boolean);
        const shuomingArr = gameConfig.game_desc
            .split(/\r?\n+/)        // 按换行拆分
            .map(s => s.trim())
            .filter(Boolean);
        ConfigManager.Instance.systemInfo = gonggaoArr;
        ConfigManager.Instance.introduction = shuomingArr;


        const messageArr = await this.GetTaskMessages();
        let Is_unRead: boolean = false;
        for (const element of messageArr) {
            if (element.is_read == 0) {
                Is_unRead = true;
                break;
            }
        }
        if (messageArr && Is_unRead) {
            //设置红点
            if (this.messageBage) {
                this.messageBage.active = true;
            }
        }else{
            if (this.messageBage) {
                this.messageBage.active = false;
            }
        }



    }


    doRender() {
        //背包
        UIButtonUtil.initBtn(this.bagBtn, () => {
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.BagPrefab,
                source: popType.null
            });
        });
        //商店
        UIButtonUtil.initBtn(this.shopBtn, () => {
            //商店按钮 添加点击事件
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.ShopPrefab,
                source: popType.null
            });
        });
        //任务
        UIButtonUtil.initBtn(this.taskBtn, () => {
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.MyTask,
                source: popType.null
            });
        });
        //公告
        UIButtonUtil.initBtn(this.noticeBtn, () => {
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.SystemAnnouncement,
                source: popType.null
            });
        });
        //消息
        UIButtonUtil.initBtn(this.messageBtn, () => {
            //
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.SystemMessage,
                source: popType.null
            });
        });



    }

    async requestGameConfig(): Promise<ResGetGameConfig> {
        const gonggaoData = await TsRpc.Instance.Client.callApi('GetGameConfig', { __ssoToken: UserDataManager.Instance.SsoToken })
        if (!gonggaoData.isSucc || !gonggaoData.res || !gonggaoData.res.game_desc) {
            ToastManager.showToast(gonggaoData.err?.message || '获取公告失败:未知错误');
            return null;
        }
        return gonggaoData.res;
    }

    //获取系统消息
    async GetTaskMessages(): Promise<TaskMessageDto[]> {
        const Data = await TsRpc.Instance.Client.callApi('user/GetTaskMessages', { __ssoToken: UserDataManager.Instance.SsoToken })
        if (!Data.isSucc || !Data.res) {
            ToastManager.showToast(Data.err?.message || '获取系统消息失败:未知错误');
            return null;
        }
        loadingManager.hideLoading();
        return Data.res.list;
    }

    update(deltaTime: number) {

    }

    protected onDestroy(): void {
            //页面销毁 销毁监听 
            EventManager.Instance.off(EVENT_ENUM.systemMessageUpdate, this.requestInfoData, this);
            
        }

}

