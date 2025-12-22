import { _decorator, Color, Component, Label, Material, Node, Prefab, Sprite, view, Size, UITransform, director, v3, tween, Vec3, instantiate, SpriteFrame } from 'cc';
import { EnrichedBagItem, IShopItem } from '../../Net/Shared/models/Interfaces';
import { GetOrUsePopType } from '../../Data/Enum';
import { loadingManager } from '../UI/LoadingManager';
import { BAG_CONFIG } from '../../Config';
import { resAssetLoad } from '../../Base/Utils';
const { ccclass, property } = _decorator;

@ccclass('GetOrUsePop')
export class GetOrUsePop extends Component {


    @property(Prefab)
    itemGetOrUseItem: Prefab = null;

    @property(Node)
    contentView: Node = null;

    @property(Label)
    titleLabel: Label = null;

    @property(Node)
    maskBgView: Node = null;

    @property(Node)
    IsSuccessBg: Node = null;

    // 模糊材质
    private blurMaterial: Material = null;
    private blurRadius: number = 2.0;
    private tintColor: Color = new Color(255, 255, 255, 150);  // 毛玻璃色调

    public getOrUsePopShowType: GetOrUsePopType = null;
    public bagItemList: EnrichedBagItem[] = [];//背包合成

    private popNode: Node = null;
    // 动画参数
    private popDuration: number = 0.3;  // 弹出/缩小动画时长
    private showDuration: number = 1;   // 显示时长



    protected onLoad(): void {

        this.doRender();
        this.initAnimation();

    }

    doRender() {

        if (this.getOrUsePopShowType == GetOrUsePopType.shopBuy) {
            this.titleLabel.string = '购买成功';
            this.doRenderOneShopBuyRender();
        } else if (this.getOrUsePopShowType == GetOrUsePopType.exchange) {
            this.titleLabel.string = '兑换成功';
            this.doRenderOneExchangeRender();

        } else if (this.getOrUsePopShowType == GetOrUsePopType.bagSynthesisSuccess) {
            this.titleLabel.string = '合成成功';
            this.doRenderOneShopBuyRender();

        }else if (this.getOrUsePopShowType == GetOrUsePopType.bagSynthesisFail) {
            this.titleLabel.string = '合成失败';
            let failBg = 'Texture/2.0/7合成界面/合成失败/spriteFrame';
            resAssetLoad<SpriteFrame>(failBg, SpriteFrame).then(res => {
            this.IsSuccessBg.getComponent(Sprite).spriteFrame = res;
        }).catch((err) => {
            console.log('icon加载失败',err);
        })
            this.doRenderOneShopBuyRender();

        }




    }

    //购买弹窗
    doRenderOneExchangeRender(){
        let i = 0;
            const render = () => {
                if (i < this.bagItemList.length) {
                    this.doRenderOneExchange(this.bagItemList[i]);
                    i++;
                } else {
                    this.unschedule(render);
                    loadingManager.hideLoading();
                }
            }
            this.schedule(render, 0.01);
    }

    doRenderOneExchange(bagItem: EnrichedBagItem) {
        //itemGetOrUseItem
        const config = BAG_CONFIG[bagItem.id];
        let name = bagItem.name;

        let djIcon = 'Texture/2.0/1.游戏大厅/状态栏/点劵/spriteFrame';
        let powerIcon = 'Texture/2.0/1.游戏大厅/状态栏/武力值/spriteFrame';
        let icon_urll = '';
        if (bagItem.id == 1) {
            icon_urll = djIcon;
        }else{
            icon_urll = powerIcon;
        }
        const itemGetOrUseItem = instantiate(this.itemGetOrUseItem);
        const iconBg = itemGetOrUseItem.getChildByName('iconBg');
        const countLabel = iconBg.getChildByName('mark').getChildByName('count');
        const icon = iconBg.getChildByName('icon');
        const nameLabel = iconBg.getChildByName('name').getComponent(Label);
        nameLabel.string = name;
        if (bagItem.count>0) {
            countLabel.getComponent(Label).string = `x${bagItem.count}`;
        }else{
            countLabel.active = false;
        }
        
        //根据类型判断边框
        // resAssetLoad<SpriteFrame>(icon_urll, SpriteFrame).then(res => {
        //     iconBg.getComponent(Sprite).spriteFrame = res;
        // }).catch((err) => {
        //     console.log('icon加载失败');
        // })
        //加载icon
        resAssetLoad<SpriteFrame>(icon_urll, SpriteFrame).then(res => {
            icon.getComponent(Sprite).spriteFrame = res;
        }).catch((err) => {
            console.log('icon加载失败',err);
        })
        this.contentView.addChild(itemGetOrUseItem);
    }

    //购买弹窗
    doRenderOneShopBuyRender(){
        let i = 0;
            const render = () => {
                if (i < this.bagItemList.length) {
                    this.doRenderOneShopBuy(this.bagItemList[i]);
                    i++;
                } else {
                    this.unschedule(render);
                    loadingManager.hideLoading();
                }
            }
            this.schedule(render, 0.01);
    }

    doRenderOneShopBuy(bagItem: EnrichedBagItem) {
        //itemGetOrUseItem
        const config = BAG_CONFIG[bagItem.id];
        let name = bagItem.name;
        let icon_urll = 'Texture/2.0/5游戏商店/道具图片/112x114/' + config[1] + '/spriteFrame';
        const itemGetOrUseItem = instantiate(this.itemGetOrUseItem);
        const iconBg = itemGetOrUseItem.getChildByName('iconBg');
        const countLabel = iconBg.getChildByName('mark').getChildByName('count');
        const icon = iconBg.getChildByName('icon');
        const nameLabel = iconBg.getChildByName('name').getComponent(Label);
        nameLabel.string = name;
        if (bagItem.count>0) {
            countLabel.getComponent(Label).string = `x${bagItem.count}`;
        }else{
            countLabel.active = false;
        }
        
        //根据类型判断边框
        // resAssetLoad<SpriteFrame>(icon_urll, SpriteFrame).then(res => {
        //     iconBg.getComponent(Sprite).spriteFrame = res;
        // }).catch((err) => {
        //     console.log('icon加载失败');
        // })
        //加载icon
        resAssetLoad<SpriteFrame>(icon_urll, SpriteFrame).then(res => {
            icon.getComponent(Sprite).spriteFrame = res;
        }).catch((err) => {
            console.log('icon加载失败');
        })
        this.contentView.addChild(itemGetOrUseItem);
    }


    private initAnimation(): void {
        if (!this.popNode) {
            this.popNode = this.node.getChildByName('Pop');
        }
        // 初始状态：缩小到0
        this.popNode.setScale(Vec3.ZERO);
        // 弹出动画
        tween(this.popNode)
            .to(this.popDuration, { scale: Vec3.ONE }, { easing: 'backOut' })  // 弹出
            .delay(this.showDuration)  // 保持显示
            .to(this.popDuration, { scale: Vec3.ZERO }, { easing: 'backIn' })  // 缩小消失
            .call(() => {
                // 动画完成后销毁节点
                this.node.destroy();
            })
            .start();
    }









    private initFrostedGlass() {
        // 获取或添加Sprite组件
        const sprite = this.maskBgView.getComponent(Sprite);

        // 设置颜色和透明度
        sprite.color = this.tintColor;

        // 加载材质
        const material = new Material();
        material.initialize({
            effectName: 'materials/surface-effect',
            technique: 0,
            defines: {
                USE_TEXTURE: true,
                CC_USE_MODEL: true,
                USE_COLOR: true,
            },
        });

        // 设置材质属性
        this.blurMaterial.setProperty('blurRadius', this.blurRadius);
        // this.blurMaterial.setProperty('resolution', view.getVisibleSize());

        // 应用材质
        sprite.material = this.blurMaterial;

        // 设置节点大小
        this.updateSize();
    }

    private updateSize() {
        const uiTransform = this.getComponent(UITransform) || this.addComponent(UITransform);
        const screenSize = view.getVisibleSize();
        uiTransform.setContentSize(screenSize);
    }

    update(deltaTime: number) {

    }



}

