import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { IShopItem } from '../../Net/Shared/models/Interfaces';
import { BAG_CONFIG } from '../../Config';
import { resAssetLoad } from '../../Base/Utils';
const { ccclass, property } = _decorator;

@ccclass('rewardViewRender')
export class rewardViewRender extends Component {


    @property(Prefab)
    iconItem: Node = null;

    @property(Node)
    contentView: Node = null;

    public rewardDataList: IShopItem[] = [];

    protected onLoad(): void {
        
        if (this.rewardDataList.length > 0) {
            for (let index = 0; index < this.rewardDataList.length; index++) {
                const element: IShopItem = this.rewardDataList[index];
                const iconItem = instantiate(this.iconItem);
                const icon = iconItem.getChildByName('iconBg').getChildByName('icon').getComponent(Sprite);
                const config = BAG_CONFIG[element.id];
                let icon_urll = 'Texture/2.0/5游戏商店/道具图片/112x114/' + config[1] + '/spriteFrame';
                resAssetLoad<SpriteFrame>(icon_urll, SpriteFrame).then(res => {
                    icon.spriteFrame = res;
                }).catch((err) => {
                    console.error("icon加载失败: " + err + 'id =' + element.id);
                });
                this.contentView.addChild(iconItem);
            }
        }

    }

    update(deltaTime: number) {

    }
}

