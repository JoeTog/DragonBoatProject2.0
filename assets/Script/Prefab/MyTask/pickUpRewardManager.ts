import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { IShopItem } from '../../Net/Shared/models/Interfaces';
import { pickupRewardCellManager } from './pickupRewardCellManager';
import { BAG_CONFIG } from '../../Config';
import { resAssetLoad } from '../../Base/Utils';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
const { ccclass, property } = _decorator;

@ccclass('pickUpRewardManager')
export class pickUpRewardManager extends Component {


    @property(Prefab)
    pickupRewardCell: Prefab = null;

    @property(Node)
    pickupRewardContentV: Node = null;

    @property(Node)
    pickupActionBtn: Node = null;

    @property(Label)
    chooseRewardTextSHow: Label = null;

    @property(Node)
    popBtn: Node = null;

    public rewardDataList: IShopItem[] = [];

    private chosedItem: IShopItem = null;
    private chosedNode: Node = null;


    protected onLoad(): void {


        this.doUI();
        this.doRender();


    }

    doUI() {

        UIButtonUtil.initBtn(this.popBtn, () => {
            this.node.destroy();
        });



    }

    doRender() {

        this.rewardDataList = [{
            id: 21, name: '半碳桨', price: 0, status: 0, use: 0,
            desc: '每次划桨，任务次数1.5倍'
        }, {
            id: 31, name: '高级能量炮', price: 0, status: 0, use: 0,
            desc: '对方船队全员无法操作5s（非消耗品）'
        }, {
            id: 46, name: '服装', price: 0, status: 0, use: 0,
            desc: '船队受到高级闪电炮攻击时，可免除1次'
        }, {
            id: 44, name: '皮肤', price: 0, status: 0, use: 0,
            desc: '个人受到闪电炮攻击时，可免除1次'
        }];

        for (let index = 0; index < this.rewardDataList.length; index++) {
            const element = this.rewardDataList[index];
            const pickupRewardCell = instantiate(this.pickupRewardCell);
            const dailyTaskItemManager = pickupRewardCell.getComponent(pickupRewardCellManager);
            if (false) {
                //判断背景框
                // const path = 单例函数
                // resAssetLoad<SpriteFrame>(path, SpriteFrame).then(res => {
                //     dailyTaskItemManager.iconNode.getComponent(Sprite).spriteFrame = res;
                // }).catch((err) => {
                //     console.error("vip图标 加载失败: " , err);
                // });
            }
            const config = BAG_CONFIG[element.id];
            let icon_url = `Texture/2.0/5游戏商店/道具图片/330x336/${config[1]}/spriteFrame`;
            resAssetLoad<SpriteFrame>(icon_url, SpriteFrame).then(res => {
                dailyTaskItemManager.iconNode.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.error("vip图标 加载失败: " , err);
            });
            dailyTaskItemManager.nameLabel.string = element.name;
            const infoNode = instantiate(dailyTaskItemManager.labelPrefab);
            infoNode.getComponent(Label).string = element.desc;
            dailyTaskItemManager.desContentV.destroyAllChildren();
            dailyTaskItemManager.desContentV.addChild(infoNode);
            this.pickupRewardContentV.addChild(pickupRewardCell);
            const chosed = pickupRewardCell.getChildByName('detail').getChildByName('chosedNode');
            //选择奖励
            UIButtonUtil.initBtn(pickupRewardCell, () => {
                if (this.chosedNode) {
                    this.chosedNode.active = false;
                }
                chosed.active = true;
                this.chosedNode = chosed;
                this.chooseReward(element);
            });
        }
    }

    chooseReward(shopItem: IShopItem) {
        this.pickupActionBtn.active = true;
        this.chosedItem = shopItem;
        this.chooseRewardTextSHow.string = `您已选择【${shopItem.name}】`;

    }

    update(deltaTime: number) {

    }
}

