import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { UIButtonUtil } from '../../../Base/UIButtonUtil';
import ConfigManager from '../../../Base/ConfigManager';
import { EnrichedBagItem } from '../../../Net/Shared/models/Interfaces';
import { BAG_CONFIG } from '../../../Config';
import { resAssetLoad } from '../../../Base/Utils';
const { ccclass, property } = _decorator;

@ccclass('PopViewManager')
export class PopViewManager extends Component {

    //倒计时结束 通知回调
    confirmBlock?: () => void;
    //游戏结束
    cancelBlock?: () => void;




    @property(Prefab)
    itemPrefab: Prefab = null;

    @property(Node)
    confirmBtn: Node = null;

    @property(Node)
    cancelBtn: Node = null;


    @property(Label)
    confirmLabel: Label = null;



    private contentNode: Node = null;

    public messageText: string = '';
    public _confirmText: string = '使用复活药水';
    public _cancelText: string = '返回';

    public showItemList: EnrichedBagItem[] = [];//背包合成

    // public confirmLabel :Label = null;

    //复活药水弹框
    protected start(): void {

        const popNode = this.node.getChildByName('pop');
        this.contentNode = popNode.getChildByName('bg').getChildByName('detailScrollV').getChildByName('view').getChildByName('content');
        // this.confirmLabel = popNode.getChildByName('BtnConfirm').getChildByName('label').getComponent(Label);
        // console.log('confirmLabel = ',this.confirmLabel);
        
        this.confirmLabel.string = this._confirmText;
        // this.cancelLabel.string = this._confirmText;
        const closeNode = this.node.getChildByName('close');
        UIButtonUtil.initBtn(closeNode, () => {
            this.node.destroy();
        });
        for (let index = 0; index < this.showItemList.length; index++) {
            const element = this.showItemList[index];
            this.showMessgae(element);
        }

        if (this.confirmBtn) {
            UIButtonUtil.initBtn(this.confirmBtn,()=>{
                this.confirmBlock?.();
            })
        }
        if (this.cancelBtn) {
            UIButtonUtil.initBtn(this.cancelBtn,()=>{
                this.node.destroy();
                this.cancelBlock?.();
            })
        }


    }


    showMessgae(showItem:EnrichedBagItem) {
        // let data = ['确认复活后，将取消上一个复活记录'];
        // for (let i = 0; i < data.length; i++) {
        const item = instantiate(this.itemPrefab);
        const icon = item.getChildByName('iconBg').getChildByName('icon').getComponent(Sprite);
        const nameLabel = item.getChildByName('name').getComponent(Label);
        const config = BAG_CONFIG[showItem.id];
        // let iconurl = 'Texture/2.0/5游戏商店/道具图片/112x114/' + config[1] + '/spriteFrame';
        let iconurl = `Texture/2.0/5游戏商店/道具图片/112x114/${config[1]}/spriteFrame`;
        resAssetLoad<SpriteFrame>(iconurl, SpriteFrame).then(res => {
            icon.spriteFrame = res;
        }).catch((err) => {
            console.error("icon加载失败: " + err);
        })
        nameLabel.string = showItem.name;
        this.contentNode.addChild(item);
        // }
        // this.GonggaoNode.active = true;
    }


    update(deltaTime: number) {

    }


}

