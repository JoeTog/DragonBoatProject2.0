import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { EnrichedBagItem } from '../../Net/Shared/models/Interfaces';
import { resAssetLoad } from '../../Base/Utils';
import { BAG_CONFIG } from '../../Config';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { GetOrUsePop } from './GetOrUsePop';
import { GetOrUsePopType } from '../../Data/Enum';
const { ccclass, property } = _decorator;

@ccclass('SynthesisRender')
export class SynthesisRender extends Component {

    //拥有道具
    @property(Node)
    earnIconFirst: Node = null;
    @property(Label)
    earnIconBageFirst: Label = null;
    @property(Node)
    earnIconSec: Node = null;
    @property(Label)
    earnIconBageSec: Label = null;

    //消耗
    @property(Node)
    depleteIconFirst: Node = null;
    @property(Label)
    depleteBageFirst: Label = null;
    @property(Node)
    depleteIconSec: Node = null;
    @property(Label)
    depleteBageSec: Label = null;

    //右侧详细展示 
    @property(Node)
    typeBg: Node = null;
    @property(Label)
    itemName: Label = null;
    @property(Node)
    iconShow: Node = null;
    @property(Node)
    deetailContentViewNode: Node = null;
    @property(Prefab)
    labelPrefab: Prefab = null;

    @property(Node)
    bagActionBtn: Node = null;
    @property(Prefab)
    getOrUsePop: Prefab = null;
    @property(Node)
    closeBtn: Node = null;

    //拥有道具数组
    earnBageItemList: EnrichedBagItem[] = [];
    //消耗的道具数组
    depleteBageItemList: EnrichedBagItem[] = [];
    //合成成功能得到的道具数组
    successBageItemList: EnrichedBagItem[] = [];
    //合成失败能得到的道具数组
    failBageItemList: EnrichedBagItem[] = [];






    protected onLoad(): void {



        this.doSender();

        //合成
        UIButtonUtil.initBtn(this.bagActionBtn, () => {
            //getOrUsePop 弹窗购买成功
            const getOrUsePop = instantiate(this.getOrUsePop);
            const GetOrUsePopComponent = getOrUsePop.getComponent(GetOrUsePop);
            const isSuccess = Math.random() < 0.5;
            if (isSuccess) {
                GetOrUsePopComponent.showType = GetOrUsePopType.bagSynthesisSuccess;
            } else {
                GetOrUsePopComponent.showType = GetOrUsePopType.bagSynthesisFail;
            }
            GetOrUsePopComponent.bagItemList = this.successBageItemList;
            console.log('bagItemList = ', GetOrUsePopComponent.bagItemList);
            this.node.addChild(getOrUsePop);
        });

        UIButtonUtil.initBtn(this.closeBtn, () => {
            this.node.destroy();
        });


    }


    doSender() {

        //拥有道具
        if (this.earnBageItemList.length == 2) {
            const itemFirst = this.earnBageItemList[0];
            const configFirst = BAG_CONFIG[itemFirst.id];
            let icon_urlFirst = 'Texture/2.0/5游戏商店/道具图片/112x114/' + configFirst[1] + '/spriteFrame';
            resAssetLoad<SpriteFrame>(icon_urlFirst, SpriteFrame).then(res => {
                this.earnIconFirst.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.error("图标 加载失败: " + err);
            });
            this.earnIconBageFirst.string = `x${itemFirst.count}`;

            const itemSec = this.earnBageItemList[1];
            const configSec = BAG_CONFIG[itemSec.id];
            let icon_urlSec = 'Texture/2.0/5游戏商店/道具图片/112x114/' + configSec[1] + '/spriteFrame';
            resAssetLoad<SpriteFrame>(icon_urlSec, SpriteFrame).then(res => {
                this.earnIconSec.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.error("图标 加载失败: " + err);
            });
            this.earnIconBageSec.string = `x${itemSec.count}`;
        }

        //消耗道具
        if (this.depleteBageItemList.length == 2) {
            const itemFirst = this.depleteBageItemList[0];
            const configFirst = BAG_CONFIG[itemFirst.id];
            let icon_urlFirst = 'Texture/2.0/5游戏商店/道具图片/112x114/' + configFirst[1] + '/spriteFrame';
            resAssetLoad<SpriteFrame>(icon_urlFirst, SpriteFrame).then(res => {
                this.depleteIconFirst.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.error("图标 加载失败: " + err);
            });
            this.depleteBageFirst.string = `x${itemFirst.count}`;

            const itemSec = this.depleteBageItemList[1];
            const configSec = BAG_CONFIG[itemSec.id];
            let icon_urlSec = 'Texture/2.0/5游戏商店/道具图片/112x114/' + configSec[1] + '/spriteFrame';
            resAssetLoad<SpriteFrame>(icon_urlSec, SpriteFrame).then(res => {
                this.depleteIconSec.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.error("图标 加载失败: " + err);
            });
            this.depleteBageSec.string = `x${itemSec.count}`;
        }

        if (this.successBageItemList.length > 0) {
            const successGetItem = this.successBageItemList[0];
            const configSuccessItem = BAG_CONFIG[successGetItem.id];
            if (successGetItem.id == -1) {
                //品质
                resAssetLoad<SpriteFrame>('', SpriteFrame).then(res => {
                    this.typeBg.getComponent(Sprite).spriteFrame = res;
                }).catch((err) => {
                    console.error("图标 加载失败: " + err);
                });
            }
            //    //itemName iconShow deetailContentViewNode labelPrefab
            this.itemName.getComponent(Label).string = successGetItem.name;
            //let iconurl = "Texture/bag/icon/" + config[1] + "/spriteFrame";
            let icon_url = 'Texture/2.0/5游戏商店/道具图片/330x336/' + configSuccessItem[1] + '/spriteFrame';
            resAssetLoad<SpriteFrame>(icon_url, SpriteFrame).then(res => {
                this.iconShow.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.error("图标 加载失败: " + err);
            });
            const node = instantiate(this.labelPrefab);
            node.getComponent(Label).string = successGetItem.desc;
            this.deetailContentViewNode.destroyAllChildren();
            this.deetailContentViewNode.addChild(node);
        }




    }





    update(deltaTime: number) {

    }



}

