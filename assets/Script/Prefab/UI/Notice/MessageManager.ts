import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { EVENT_ENUM, showType, systemMessageType } from '../../../Data/Enum';
import { UIButtonUtil } from '../../../Base/UIButtonUtil';
import ConfigManager from '../../../Base/ConfigManager';
import { TaskMessageDto } from '../../../Net/Shared/protocols/user/PtlGetTaskMessages';
import { TsRpc } from '../../../Net/TsRpc';
import { ToastManager } from '../ToastManager';
import UserDataManager from '../../../Data/UserDataManager';
import { resAssetLoad, TimeDateUtils } from '../../../Base/Utils';
import { loadingManager } from '../LoadingManager';
import EventManager from '../../../Base/EventManager';
const { ccclass, property } = _decorator;

@ccclass('MessageManager')
export class MessageManager extends Component {

    @property(Prefab)
    labelPrefab: Prefab = null;

    @property(Prefab)
    messageListCell: Prefab = null;

    @property(Node)
    messageListContentV: Node = null;
    @property(Node)
    messageDetailContentV: Node = null;

    @property(Label)
    titleLabel: Label = null;
    @property(Label)
    dateLabel: Label = null;
    

    private chosedListCell: Node = null;
    private isRequestReaded: boolean = false;

    //显示什么
    // public showType: showType = showType.Gonggao;






    protected onLoad(): void {

        const popNode = this.node.getChildByName('pop');
        this.messageListContentV = popNode.getChildByName('bg').getChildByName('messageListScrollV').getChildByName('view').getChildByName('content');
        this.messageDetailContentV = popNode.getChildByName('bg').getChildByName('detailScrollV').getChildByName('view').getChildByName('content');
        this.titleLabel = popNode.getChildByName('bg').getChildByName('title').getComponent(Label);


        this.showMessage();

        const closeNode = this.node.getChildByName('close');
        UIButtonUtil.initBtn(closeNode, () => {
            this.node.destroy();
        });


    }


    async showMessage() {

        const messageArr = await this.GetTaskMessages();
        ConfigManager.Instance.messageArr = messageArr;


        for (let i = 0; i < messageArr.length; i++) {
            const messageListCell = instantiate(this.messageListCell);
            const unChosedbg = messageListCell.getChildByName('unChosedBg');
            // const chosedBg = messageListCell.getChildByName('chosedBg');
            const titleLabel = messageListCell.getChildByName('title').getComponent(Label);
            const bageIcon = messageListCell.getChildByName('bage');
            const item: TaskMessageDto = messageArr[i];
            unChosedbg.active = true;
            if (i == 0) {
                this.doListCellChosedShow(messageListCell, item);
            }
            if (item.type == systemMessageType.fail_penalty) {
                titleLabel.string = '游戏扣除次数';
            } else if (item.type == systemMessageType.reach_min_games) {
                titleLabel.string = '游戏难度通知';
            }
            //0=未读，1=已读
            if (item.is_read == 0) {
                bageIcon.active = true;
                if (!this.isRequestReaded) {
                    this.isRequestReaded = true;
                    //设置已读
                    this.MarkTaskMessagesRead();
                }
            }
            UIButtonUtil.initBtn(messageListCell, () => {
                this.doListCellChosedShow(messageListCell, item);
            });
            this.messageListContentV.addChild(messageListCell);
        }


        // let data = ConfigManager.Instance.systemInfo;
        // if (this.showType == showType.Gonggao) {
        // } else if (this.showType == showType.Introduction) {
        //     data = ConfigManager.Instance.introduction;
        // }
        // for (let i = 0; i < data.length; i++) {
        //     const node = instantiate(this.labelPrefab);
        //     node.getComponent(Label).string = data[i];
        //     this.contentNode.addChild(node);
        // }
        // this.GonggaoNode.active = true;
    }

    doListCellChosedShow(cell: Node, item: TaskMessageDto) {
        if (this.chosedListCell) {
            this.chosedListCell.getChildByName('chosedBg').active = false;
            this.chosedListCell.getChildByName('unChosedBg').active = true;
        }
        this.chosedListCell = cell;
        const unChosedbg = cell.getChildByName('unChosedBg');
        const chosedBg = cell.getChildByName('chosedBg');
        unChosedbg.active = false;
        chosedBg.active = true;

        //显示内容变化
        if (item.type == systemMessageType.fail_penalty) {
            this.titleLabel.string = '游戏次数通知';
        } else if (item.type == systemMessageType.reach_min_games) {
            this.titleLabel.string = '游戏难度通知';
        }

        this.dateLabel.string = TimeDateUtils.formatTimestampForPowerRecord(item.created_at);

        this.messageDetailContentV.destroyAllChildren();
        const detailCell = instantiate(this.labelPrefab);
        detailCell.getComponent(Label).string = item.content;
        this.messageDetailContentV.addChild(detailCell);




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

    async MarkTaskMessagesRead() {
        const Data = await TsRpc.Instance.Client.callApi('user/MarkTaskMessagesRead', { __ssoToken: UserDataManager.Instance.SsoToken })
        if (!Data.isSucc || !Data.res) {
            ToastManager.showToast(Data.err?.message || '获取系统消息失败:未知错误');
            return;
        }
        EventManager.Instance.emit(EVENT_ENUM.systemMessageUpdate);
    }

    update(deltaTime: number) {

    }
}

