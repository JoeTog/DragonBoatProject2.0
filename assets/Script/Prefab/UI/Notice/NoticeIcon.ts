import { _decorator, Component, find, instantiate, Node, Prefab } from 'cc';
import { UIButtonUtil } from '../../../Base/UIButtonUtil';
import { GonggaoManager } from './GonggaoManager';
import { TsRpc } from '../../../Net/TsRpc';
import UserDataManager from '../../../Data/UserDataManager';
import { ToastManager } from '../ToastManager';
import ConfigManager from '../../../Base/ConfigManager';
import { ResGetGameConfig } from '../../../Net/Shared/protocols/PtlGetGameConfig';
import { NoticesType } from '../../../Data/Enum';
const { ccclass, property } = _decorator;

@ccclass('NoticeIcon')
export class NoticeIcon extends Component {

    @property(Node)
    noticeBtnNode: Node = null;
    @property(Node)
    detailBtnNode: Node = null;

    @property(Prefab)
    noticeViewPrefab: Prefab = null;

    private windowsNode: Node = null;






    protected async onLoad(): Promise<void> {

        // console.trace('当前调用栈');

        
        
        // const noticeBtn = instantiate(this.noticeBtnNode);
        // const detailBtn = instantiate(this.detailBtnNode);

        this.windowsNode = find('Canvas/windows');
        if (!this.windowsNode) {
            const canvasNode = find('Canvas');
            if (canvasNode) {
                this.windowsNode = canvasNode.getChildByName('windows');
                if (!this.windowsNode) {
                    this.windowsNode = new Node('windows');
                    canvasNode.addChild(this.windowsNode);
                    this.windowsNode.setSiblingIndex(canvasNode.children.length - 1);
                }
            }
        }

        const gameConfig: ResGetGameConfig = await this.requestGameConfig();
        const gonggaoArr = gameConfig.game_notice
            .split(/\r?\n+/)        // 按换行拆分
            .map(s => s.trim())
            .filter(Boolean);
        const shuomingArr = gameConfig.game_desc
            .split(/\r?\n+/)        // 按换行拆分
            .map(s => s.trim())
            .filter(Boolean);

        ConfigManager.Instance.announcement = gonggaoArr;
        ConfigManager.Instance.introduction = shuomingArr;

        UIButtonUtil.initBtn(this.noticeBtnNode, () => {
            // this.node.addChild(noticeView);
            const noticeView = instantiate(this.noticeViewPrefab);
            const gonggaoManager = noticeView.getComponent(GonggaoManager);
            gonggaoManager.noticesType = NoticesType.Gonggao;
            
            if (this.windowsNode) {
                this.windowsNode.addChild(noticeView);
                noticeView.setSiblingIndex(this.windowsNode.children.length - 1);
            } else {
                console.warn('[NoticeIcon] windows 节点未找到，fallback 到当前节点');
                this.node.addChild(noticeView);
                noticeView.setSiblingIndex(this.node.children.length - 1);
            }
        });

        UIButtonUtil.initBtn(this.detailBtnNode, () => {
            const noticeView = instantiate(this.noticeViewPrefab);
            const gonggaoManager = noticeView.getComponent(GonggaoManager);
            gonggaoManager.noticesType = NoticesType.Introduction;
            
            if (this.windowsNode) {
                this.windowsNode.addChild(noticeView);
                noticeView.setSiblingIndex(this.windowsNode.children.length - 1);
            } else {
                console.warn('[detailBtnNode] windows 节点未找到，fallback 到当前节点');
                this.node.addChild(noticeView);
                noticeView.setSiblingIndex(this.node.children.length - 1);
            }
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

    // async requestShuoming(): Promise<string> {
    //     const gonggaoData = await TsRpc.Instance.Client.callApi('GetGameConfig', { __ssoToken: UserDataManager.Instance.SsoToken })
    //     if (!gonggaoData.isSucc || !gonggaoData.res || !gonggaoData.res.game_desc) {
    //         ToastManager.showToast(gonggaoData.err?.message || '获取公告失败:未知错误');
    //         return '';
    //     }
    //     return gonggaoData.res.game_desc;

    // }



    update(deltaTime: number) {

    }
}

