import { _decorator, Color, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, tween, UITransform, v3, Widget } from 'cc';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import UserDataManager from '../../Data/UserDataManager';
import { TsRpc } from '../../Net/TsRpc';
import { IShopItem, BagItem, EnrichedBagItem } from '../../Net/Shared/models/Interfaces';
import { BAG_CONFIG } from '../../Config';
import { BigNumUtils, loadAvatar, resAssetLoad } from '../../Base/Utils';
import { ToastManager } from '../UI/ToastManager';
import { loadingManager } from '../UI/LoadingManager';
import { GetOrUsePopType } from '../../Data/Enum';
import { GetOrUsePop } from './GetOrUsePop';
const { ccclass, property } = _decorator;

@ccclass('ShopRender')
export class ShopRender extends Component {


    @property(Prefab)
    PersonalMoney: Prefab = null;

    @property(Prefab)
    getOrUsePop: Prefab = null;


    @property(Prefab)
    shopItem: Prefab = null;
    @property(Prefab)
    shopMerit: Prefab = null;
    @property(Node)
    contentViewNode: Node = null;

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
    @property(Label)
    goodValue: Label = null;
    @property(Node)
    buyGoodBtn: Node = null;

    @property(Node)
    allBtn: Node = null;
    @property(Node)
    bonusBtn: Node = null;
    @property(Node)
    materialBtn: Node = null;
    @property(Node)
    funcBtn: Node = null;
    @property(Node)
    attackBtn: Node = null;
    @property(Node)
    defenseBtn: Node = null;

    private chosedBtn: Node = null;
    private chosedGood:IShopItem = null;


    private popNode: Node = null;
    private closeNode: Node = null;
    private showGoodDesIndex = -1;

    private shopDataList: IShopItem[] = [];


    protected onLoad(): void {
        this.popNode = this.node.getChildByName('pop');
        this.closeNode = this.popNode.getChildByName('close');
        this.popNode.setScale(0, 0, 0);

        tween(this.popNode)
            .to(0.2, { scale: v3(1, 1, 1) }, { easing: 'backInOut' })
            .start();

        UIButtonUtil.initBtn(this.closeNode, () => {
            this.node.destroy();
        });

        this.doUI();
        this.doSender();


    }

    //选择类型筛选
    showSpecificWitgType() {
    }

    //请求商品 后期加入筛选字段
    async doSender() {
        this.contentViewNode.destroyAllChildren();
        if (this.shopDataList.length == 0) {
            this.shopDataList = await this.getShopList();
            // UserDataManager.Instance.ShopData = this.shopDataList;
            // UserDataManager.Instance.ShopData = JSON.parse(JSON.stringify(this.shopDataList));
            loadingManager.hideLoading();
        }
        let userShopData = [];
        for (let index = 0; index < this.shopDataList.length; index++) {
            const element = this.shopDataList[index];
            if (BAG_CONFIG[element.id]) {
                userShopData.push(element);
            }
        }
        if (userShopData.length == 0) {
            ToastManager.showToast('商品列表为空');
            return;
        }
        if (BAG_CONFIG[userShopData[0].id]) {
            this.showDetail(userShopData[0]);
        }
        let i = 0;
        const render = () => {
            if (i < userShopData.length) {
                if (i == 0) {
                    this.doMerit();
                }
                // this.doRenderOne(userShopData[i].id, userShopData[i].price, userShopData[i].desc);
                this.doRenderOne(userShopData[i]);
                i++;
                if (i % 4 == 0) {
                    if (userShopData.length > i) {
                        this.doMerit();
                    }
                }
            } else {
                //设置层级
                // this.setZIndex();
                this.unschedule(render);
            }
        }
        this.schedule(render, 0.01);
    }

    doMerit() {
        const shopMeritNode = instantiate(this.shopMerit);
        // shopMeritNode.setSiblingIndex(0);  // 先放到最底层
        this.contentViewNode.addChild(shopMeritNode);

    }

    // doRenderOne(itemid: number, price: number, description: string) {
    doRenderOne(itemGood:IShopItem) {
        const config = BAG_CONFIG[itemGood.id];
        let name = itemGood.name;
        // let icon_urll = 'Texture/2.0/5游戏商店/道具图片/112x114/' + config[1] + '/spriteFrame';
        let icon_urll = `Texture/2.0/5游戏商店/道具图片/112x114/${config[1]}/spriteFrame`;
        const shopItemNode = instantiate(this.shopItem);
        // shopItemNode.setSiblingIndex(1);
        const bg = shopItemNode.getChildByName('bg');
        const nameLabel = bg.getChildByName('label').getComponent(Label);
        const iconSprite = bg.getChildByName('icon').getComponent(Sprite);
        const priceLabel = bg.getChildByName('value').getComponent(Label);
        nameLabel.string = name;
        // priceLabel.string = `${BigNumUtils.getNumberStringWan(itemGood.price)}`;
        priceLabel.string = `${itemGood.price}`;
        if (itemGood.price>100000) {
            priceLabel.fontSize = 30;
        }
        resAssetLoad<SpriteFrame>(icon_urll, SpriteFrame).then(res => {
            iconSprite.spriteFrame = res;
        }).catch((err) => {
            console.log('icon加载失败');
        })
        UIButtonUtil.initBtn(this.closeNode, () => {
            this.node.destroy();
        });

        //点击图标 显示详细描述在右侧
        UIButtonUtil.initBtn(shopItemNode, () => {
            //itemName iconShow deetailContentViewNode
            if (this.chosedGood && this.chosedGood.id != itemGood.id) {
                this.showDetail(itemGood);
            } else {
                console.log('一样不渲染');
            }

        })

        this.contentViewNode.addChild(shopItemNode);

    }

    // showDetail(config: any[], price: number) {
    showDetail(item:IShopItem) {
        this.chosedGood = item;
        const config = BAG_CONFIG[item.id];
        this.itemName.getComponent(Label).string = item.name;
        // let icon_url = 'Texture/2.0/5游戏商店/道具图片/330x336/' + config[1] + '/spriteFrame';
        let icon_url = `Texture/2.0/5游戏商店/道具图片/330x336/${config[1]}/spriteFrame`;
        resAssetLoad<SpriteFrame>(icon_url, SpriteFrame).then(res => {
            this.iconShow.getComponent(Sprite).spriteFrame = res;
        }).catch((err) => {
            console.error("vip图标 加载失败: " + err);
        });
        const node = instantiate(this.labelPrefab);
        node.getComponent(Label).string = item.desc;
        this.deetailContentViewNode.destroyAllChildren();
        this.deetailContentViewNode.addChild(node);
        this.goodValue.getComponent(Label).string = BigNumUtils.getNumberStringWan(item.price);
    }

    async doShopAction() {
        if (!this.chosedGood) {
            ToastManager.showToast('未识别商品');
            return;
        }
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法购买道具');
            ToastManager.showToast('网络连接异常，请稍后重试【doShopAction】');
            return;
        }

        const data = await TsRpc.Instance.Client.callApi("shop/BuyItem", 
            { __ssoToken: UserDataManager.Instance.SsoToken, id: this.chosedGood.id });
        if (!data.isSucc || !data.res) {
            console.error('购买失败:', data.err?.message || '购买失败:未知错误');
            ToastManager.showToast(data.err?.message || '购买失败:未知错误');
            return;
        }
        // const resItem = (data.res as { item?: BagItem })?.item;
        const bagItem: EnrichedBagItem = {
            id: this.chosedGood.id,
            count: 1,
            name:this.chosedGood.name,
            price:this.chosedGood.price,
            status:this.chosedGood.status,
            use:this.chosedGood.use,
            desc:this.chosedGood.desc
        };
        UserDataManager.Instance.addBag(bagItem);
        if (this.chosedGood.id == 4) {
            //购买了旗鼓手 说明自己拥有击鼓手
            UserDataManager.Instance.IsCaptain = true;
        }
        let game_coin = UserDataManager.Instance.GameCoin;
        let point = UserDataManager.Instance.Point - this.chosedGood.price;
        let power = UserDataManager.Instance.UserInfo.power;
        let freePower = UserDataManager.Instance.UserInfo.freezePower;
        // ToastManager.showToast('购买成功');
        //(game_icon:number,point:number,power:number)
        UserDataManager.Instance.updateUserInfo(game_coin, point, power, freePower);


        //getOrUsePop 弹窗购买成功
        const getOrUsePop = instantiate(this.getOrUsePop);
        const GetOrUsePopComponent = getOrUsePop.getComponent(GetOrUsePop);
        GetOrUsePopComponent.getOrUsePopShowType = GetOrUsePopType.shopBuy;
        GetOrUsePopComponent.bagItemList.push(bagItem);
        this.node.addChild(getOrUsePop);


    }

    async getShopList(): Promise<IShopItem[]> {

        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法获取商品列表');
            ToastManager.showToast('网络连接异常，请稍后重试【getShopList】');
            return;
        }

        const data = await TsRpc.Instance.Client.callApi("shop/GetItemList", { __ssoToken: UserDataManager.Instance.SsoToken });
        if (!data.isSucc || !data.res || !data.res.items) {
            console.error('获取商品列表失败:', data.err?.message || '获取商品列表失败:未知错误');
            ToastManager.showToast(data.err?.message || '获取商品列表失败:未知错误');
            return [];
        }

        return data.res.items;
    }

    doUI() {
        const personalMoney = instantiate(this.PersonalMoney);
        this.node.addChild(personalMoney);
        const powerLabel = personalMoney.getChildByName('Root').getChildByName('PowerNode').getChildByName('label');
        const IntegralLabel = personalMoney.getChildByName('Root').getChildByName('IntegralNode').getChildByName('label');
        const djLabel = personalMoney.getChildByName('Root').getChildByName('djNode').getChildByName('label');
        powerLabel.active = false;
        IntegralLabel.active = false;
        djLabel.active = false;

        this.allBtn.name = 'all';
        this.bonusBtn.name = 'bonus';
        this.materialBtn.name = 'material';
        this.funcBtn.name = 'func';
        this.attackBtn.name = 'attack';
        this.defenseBtn.name = 'defense';

        //购买按钮
        UIButtonUtil.initBtn(this.buyGoodBtn, () => {
            this.doShopAction();
        })

        let icon_urllChosed = 'Texture/2.0/5游戏商店/选择按钮/spriteFrame';
        this.chosedBtn = this.allBtn;
        UIButtonUtil.initBtn(this.allBtn, () => {
            if (this.chosedBtn.name.includes('all')) {
                return;
            }

            this.doSender();

            this.setChosedToUnchosed();
            this.chosedBtn = this.allBtn;
            //更改文字颜色、图片、文字top、大小
            this.allBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.allBtn.getComponent(Widget).verticalCenter = 16;
            let label = this.allBtn.getChildByName('label');
            // label.getComponent(Label).color = new Color('#E27900');
            label.getComponent(Label).fontSize = 60;
            label.getComponent(Widget).isAlignVerticalCenter = true;
            label.getComponent(Widget).verticalCenter = -15;
            resAssetLoad<SpriteFrame>(icon_urllChosed, SpriteFrame).then(res => {
                this.allBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        });

        UIButtonUtil.initBtn(this.bonusBtn, () => {
            if (this.chosedBtn.name.includes('bonus')) {
                return;
            }
            this.doSender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.bonusBtn;
            this.bonusBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.bonusBtn.getComponent(Widget).verticalCenter = 16;
            let label = this.bonusBtn.getChildByName('label');
            // label.getComponent(Label).color = new Color('#E27900');
            label.getComponent(Label).fontSize = 60;
            label.getComponent(Widget).isAlignVerticalCenter = true;
            label.getComponent(Widget).verticalCenter = -15;
            resAssetLoad<SpriteFrame>(icon_urllChosed, SpriteFrame).then(res => {
                this.bonusBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })

        });
        UIButtonUtil.initBtn(this.materialBtn, () => {
            if (this.chosedBtn.name.includes('material')) {
                return;
            }
            this.doSender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.materialBtn;
            //更改文字颜色、图片、文字top、大小
            this.materialBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.materialBtn.getComponent(Widget).verticalCenter = 16;
            let label = this.materialBtn.getChildByName('label');
            // label.getComponent(Label).color = new Color('#E27900');
            label.getComponent(Label).fontSize = 60;
            label.getComponent(Widget).isAlignVerticalCenter = true;
            label.getComponent(Widget).verticalCenter = -15;
            resAssetLoad<SpriteFrame>(icon_urllChosed, SpriteFrame).then(res => {
                this.materialBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        });
        UIButtonUtil.initBtn(this.funcBtn, () => {
            if (this.chosedBtn.name.includes('func')) {
                return;
            }
            this.doSender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.funcBtn;
            //更改文字颜色、图片、文字top、大小
            this.funcBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.funcBtn.getComponent(Widget).verticalCenter = 16;
            let label = this.funcBtn.getChildByName('label');
            // label.getComponent(Label).color = new Color('#E27900');
            label.getComponent(Label).fontSize = 60;
            label.getComponent(Widget).isAlignVerticalCenter = true;
            label.getComponent(Widget).verticalCenter = -15;
            resAssetLoad<SpriteFrame>(icon_urllChosed, SpriteFrame).then(res => {
                this.funcBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        });
        UIButtonUtil.initBtn(this.attackBtn, () => {
            if (this.chosedBtn.name.includes('attack')) {
                return;
            }
            this.doSender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.attackBtn;
            //更改文字颜色、图片、文字top、大小
            this.attackBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.attackBtn.getComponent(Widget).verticalCenter = 16;
            let label = this.attackBtn.getChildByName('label');
            // label.getComponent(Label).color = new Color('#E27900');
            label.getComponent(Label).fontSize = 60;
            label.getComponent(Widget).isAlignVerticalCenter = true;
            label.getComponent(Widget).verticalCenter = -15;
            resAssetLoad<SpriteFrame>(icon_urllChosed, SpriteFrame).then(res => {
                this.attackBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        });
        UIButtonUtil.initBtn(this.defenseBtn, () => {
            if (this.chosedBtn.name.includes('defense')) {
                return;
            }
            this.doSender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.defenseBtn;
            //更改文字颜色、图片、文字top、大小
            this.defenseBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.defenseBtn.getComponent(Widget).verticalCenter = 16;
            let label = this.defenseBtn.getChildByName('label');
            // label.getComponent(Label).color = new Color('#E27900');
            label.getComponent(Label).fontSize = 60;
            label.getComponent(Widget).isAlignVerticalCenter = true;
            label.getComponent(Widget).verticalCenter = -15;
            resAssetLoad<SpriteFrame>(icon_urllChosed, SpriteFrame).then(res => {
                this.defenseBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        });

    }

    setChosedToUnchosed() {
        let icon_urllUnchosed = 'Texture/2.0/5游戏商店/分类按钮/spriteFrame';
        if (this.chosedBtn.name.includes('all')) {
            this.allBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.allBtn.getComponent(Widget).verticalCenter = 6;
            let labell = this.allBtn.getChildByName('label');
            labell.getComponent(Label).fontSize = 50;
            labell.getComponent(Widget).isAlignVerticalCenter = true;
            labell.getComponent(Widget).verticalCenter = 3;
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.allBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('bonus')) {
            this.bonusBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.bonusBtn.getComponent(Widget).verticalCenter = 6;
            let labell = this.bonusBtn.getChildByName('label');
            labell.getComponent(Label).fontSize = 50;
            labell.getComponent(Widget).isAlignVerticalCenter = true;
            labell.getComponent(Widget).verticalCenter = 3;
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.bonusBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('material')) {
            this.materialBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.materialBtn.getComponent(Widget).verticalCenter = 6;
            let labell = this.materialBtn.getChildByName('label');
            labell.getComponent(Label).fontSize = 50;
            labell.getComponent(Widget).isAlignVerticalCenter = true;
            labell.getComponent(Widget).verticalCenter = 3;
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.materialBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('func')) {
            this.funcBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.funcBtn.getComponent(Widget).verticalCenter = 6;
            let labell = this.funcBtn.getChildByName('label');
            labell.getComponent(Label).fontSize = 50;
            labell.getComponent(Widget).isAlignVerticalCenter = true;
            labell.getComponent(Widget).verticalCenter = 3;
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.funcBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('attack')) {
            this.attackBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.attackBtn.getComponent(Widget).verticalCenter = 6;
            let labell = this.attackBtn.getChildByName('label');
            labell.getComponent(Label).fontSize = 50;
            labell.getComponent(Widget).isAlignVerticalCenter = true;
            labell.getComponent(Widget).verticalCenter = 3;
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.attackBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('defense')) {
            this.defenseBtn.getComponent(Widget).isAlignVerticalCenter = true;
            this.defenseBtn.getComponent(Widget).verticalCenter = 6;
            let labell = this.defenseBtn.getChildByName('label');
            labell.getComponent(Label).fontSize = 50;
            labell.getComponent(Widget).isAlignVerticalCenter = true;
            labell.getComponent(Widget).verticalCenter = 3;
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.defenseBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        }
    }

    update(deltaTime: number) {

    }



//显示描述
    // showDes(shopItemNode: Node, index: number, des: string) {
    //     // console.log('index = ',index);
    //     // console.log('showGoodDesIndex = ',this.showGoodDesIndex);
    //     const descriptionNode = this.node.getChildByName('description');
    //     if (index == this.showGoodDesIndex || index == -1) {
    //         this.showGoodDesIndex = -1;
    //         descriptionNode.active = false;
    //         return;
    //     }
    //     this.showGoodDesIndex = index;
    //     const info = BAG_CONFIG[index];
    //     // console.log('shopItemNode.position = ',shopItemNode.position);

    //     const worldPos = shopItemNode.getWorldPosition();
    //     const descParent = descriptionNode.parent;
    //     const descParentUITransform = descParent.getComponent(UITransform);
    //     const localPos = descParentUITransform.convertToNodeSpaceAR(worldPos);

    //     descriptionNode.setPosition(localPos.x < 0 ? localPos.x + 160 : localPos.x, localPos.y - 90);
    //     descriptionNode.getChildByName('desNameLabel').getComponent(Label).string = info[0];
    //     descriptionNode.getChildByName('deslabel').getComponent(Label).string = des;
    //     descriptionNode.active = true;
    // }


    protected onDestroy(): void {

        this.unscheduleAllCallbacks()
    }




}

