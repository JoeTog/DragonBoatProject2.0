import { _decorator, Component, instantiate, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame, tween, UITransform, v3, Widget } from 'cc';
import UserDataManager from '../../Data/UserDataManager';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { BAG_CONFIG } from '../../Config';
import { BigNumUtils, resAssetLoad } from '../../Base/Utils';
import { TsRpc } from '../../Net/TsRpc';
import GameConfig from '../../Config/GameConfig';
import { loadingManager } from '../UI/LoadingManager';
import { BagItem, EnrichedBagItem } from '../../Net/Shared/models/Interfaces';
import { ToastManager } from '../UI/ToastManager';
import { doSender } from '../PkGame/SingleGame/SingleGameManager';
import { SynthesisRender } from './SynthesisRender';
const { ccclass, property } = _decorator;

@ccclass('BagRender')
export class BagRender extends Component {


    @property(Prefab)
    PersonalMoney: Prefab = null;

    @property(Prefab)
    bagItem: Prefab;
    @property(Node)
    containNode: Node;

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

    @property(Prefab)
    SynthesisPrefab: Prefab = null;

    private popNode: Node = null;
    private closeNode: Node = null;
    private tipNode: Node = null;

    private showGoodDesIndex: number = -1;

    private maskNode: Node = null;//详情展示的背景 弃用
    private descriptionNode: Node = null;//详情展示框 弃用

    private scrollView: ScrollView = null;
    private versionNodeLabel: Label = null;

    private chosedBtn: Node = null;
    private chosedGood: EnrichedBagItem = null;
    private bagDataList: EnrichedBagItem[] = [];


    protected onLoad(): void {

        this.versionNodeLabel = this.node.getChildByName('pop').getChildByName('version').getComponent(Label);
        this.versionNodeLabel.string = '版本号:' + GameConfig.version;
        const ret = GameConfig.ws_url.includes('test');
        if (ret) {
            this.versionNodeLabel.string = '测试版:' + GameConfig.version;
        }

        this.popNode = this.node.getChildByName('pop');
        this.tipNode = this.popNode.getChildByName('List').getChildByName('Tip');
        // console.log('popNode',this.popNode);
        // console.log('tipNode',this.tipNode);
        this.popNode.setScale(v3(0, 0, 0));

        tween(this.popNode)
            .to(0.2, { scale: v3(1, 1, 1) }, { easing: 'backInOut' })
            .start();

        this.closeNode = this.popNode.getChildByName('close');
        UIButtonUtil.initBtn(this.closeNode, () => {
            this.node.destroy();
        });

        // this.maskNode = this.popNode.getChildByName('mask');
        // UIButtonUtil.initBtn(this.maskNode, () => {
        //     this.hideMask();
        // });

        this.scrollView = this.containNode.parent.parent.getComponent(ScrollView);
        this.scrollView.enabled = false;


        this.doUI();
        this.doRender();
        //合成按钮，需要等chosedGood赋值后才能设置
        const label = this.bagActionBtn.getChildByName('label').getComponent(Label);
        if (this.chosedGood && this.chosedGood.id == -1) {
            label.string = '合 成';
        } else if (this.chosedGood && this.chosedGood.id == -2) {
            label.string = '使 用';
        }



    }

    async getUserInfoOfBag() {
        const userData = await TsRpc.Instance.Client.callApi('user/GetInfo', { __ssoToken: UserDataManager.Instance.SsoToken });
        const userInfo = userData.res.info;
        UserDataManager.Instance.UserInfo = userInfo;
        return userInfo.bag_data;
    }

    //是否来自使用，使用的话 需要选中为使用的道具 coun>0
    async doRender(isFromUse: boolean = false) {
        this.containNode.destroyAllChildren();

        this.bagDataList = await this.getUserInfoOfBag();


        this.popNode.active = true;
        let userBagData = [];
        for (let index = 0; index < this.bagDataList.length; index++) {
            const element = this.bagDataList[index];
            if (BAG_CONFIG[element.id]) {
                userBagData.push(element);
            }
        }
        if (userBagData.length == 0) {
            // this.popNode.active = false;
            this.tipNode.active = true;
            this.bagActionBtn.active = false;
            loadingManager.hideLoading();
            return;
        } else {
            this.tipNode.active = false;
        }
        console.log('element = ' , userBagData[0]);
        if (!isFromUse && BAG_CONFIG[userBagData[0].id]) {
            this.showDetail(userBagData[0]);
        } else if (isFromUse && this.chosedGood.id && this.chosedGood.count > 0) {
            this.showDetail(this.chosedGood);
        } else {
            this.showDetail(userBagData[0]);
        }


        let i = 0;
        const render = () => {
            if (i < userBagData.length) {
                this.doRenderOne(userBagData[i], i + 1);
                i++;
            } else {
                this.unschedule(render);
                this.scheduleOnce(() => {
                    if (this.scrollView) {
                        // 使用缓动滚动
                        this.scrollView.scrollToTop(0.3);  // 内置就有缓动效果
                    }
                }, 0.1);
                this.scrollView.enabled = true;
                loadingManager.hideLoading();

            }
        }
        this.schedule(render, 0.01);

    }

    doRenderOne(bagItem: EnrichedBagItem, indexI: number) {
        const config = BAG_CONFIG[bagItem.id];
        let name = bagItem.name;
        // let icon_urll = 'Texture/2.0/5游戏商店/道具图片/112x114/' + config[1] + '/spriteFrame';
        let icon_urll = `Texture/2.0/5游戏商店/道具图片/112x114/${config[1]}/spriteFrame`;
        //初始化item
        const bagItemNode = instantiate(this.bagItem);
        //获取item上的namelabeel
        const nameLabel = bagItemNode.getChildByName('name').getComponent(Label);
        //获取item上的icon
        const bagIcon = bagItemNode.getChildByName('iconBg');
        const iconSprite = bagIcon.getChildByName('icon').getComponent(Sprite);
        //获取使用按钮node
        // const btnProps = bagItemNode.getChildByName('btnNode');
        //设置角标
        const bagMarkLabel = bagItemNode.getChildByName('iconBg').getChildByName('mark').getChildByName('count').getComponent(Label);
        bagMarkLabel.string = `x${BigNumUtils.getNumberStringWan(bagItem.count)}`;

        if (indexI % 5 == 1) {
            const first = bagItemNode.getChildByName('bg').getChildByName('first');
            first.active = true;
        } else if (indexI % 5 == 2) {
            const sec = bagItemNode.getChildByName('bg').getChildByName('sec');
            sec.active = true;
        } else if (indexI % 5 == 3) {
            const three = bagItemNode.getChildByName('bg').getChildByName('three');
            three.active = true;
        } else if (indexI % 5 == 4) {
            const fouth = bagItemNode.getChildByName('bg').getChildByName('fouth');
            fouth.active = true;
        } else if (indexI % 5 == 0) {
            const fifth = bagItemNode.getChildByName('bg').getChildByName('fifth');
            fifth.active = true;
        }

        //点击事件
        UIButtonUtil.initBtn(bagIcon, () => {
            this.showDetail(bagItem);
        });

        //赋值name
        nameLabel.string = name;
        // console.log('iconurl = ',iconurl)
        //res加载iconurl <>一个恶spr （）里面2参数1是url 2是sprf 然后then 括号一个（）回调 里面赋值icons 再加个catch
        resAssetLoad<SpriteFrame>(icon_urll, SpriteFrame).then(res => {
            iconSprite.spriteFrame = res;
        }).catch((err) => {
            console.error("icon加载失败: " + `${err} ` + 'id =' + `${bagItem.id}`);
            ToastManager.showToast('道具加载失败 道具id = ' + `${bagItem.id}` );
        })


        //初始化uibu 使用的 点击调用userProps传index
        // UIButtonUtil.initBtn(btnProps, () => {
        //     this.userProps(bagItem.id);
        // })

        this.containNode.addChild(bagItemNode);


    }

    // hideMask() {
    //     this.maskNode.active = false;
    //     this.descriptionNode.active = false;
    // }

    showDetail(bagItem: EnrichedBagItem) {
        this.chosedGood = bagItem;

        const label = this.bagActionBtn.getChildByName('label').getComponent(Label);
        if (this.chosedGood && this.chosedGood.id == 20) {
            label.string = '合 成';
        } else {
            label.string = '使 用';
        }

        const config = BAG_CONFIG[bagItem.id];
        this.itemName.getComponent(Label).string = bagItem.name;
        let icon_url = `Texture/2.0/5游戏商店/道具图片/330x336/${config[1]}/spriteFrame`;
        resAssetLoad<SpriteFrame>(icon_url, SpriteFrame).then(res => {
            this.iconShow.getComponent(Sprite).spriteFrame = res;
        }).catch((err) => {
            console.error("vip图标 加载失败: " , err);
        });
        const node = instantiate(this.labelPrefab);
        node.getComponent(Label).string = bagItem.desc;
        this.deetailContentViewNode.destroyAllChildren();
        this.deetailContentViewNode.addChild(node);
    }

    /**
     * 使用道具
     * @param index 背包数组索引
     */
    async userProps(itemId: number) {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法使用道具');
            ToastManager.showToast('网络连接异常，请稍后重试【使用道具】');
            return;
        }
        loadingManager.showLoading();
        let data = await TsRpc.Instance.Client.callApi("shop/UseItem", { __ssoToken: UserDataManager.Instance.SsoToken, id: itemId })
        loadingManager.hideLoading();
        if (data.isSucc) {
            UserDataManager.Instance.updateBagData(data.res.bag_data);
            UserDataManager.Instance.IsDie = data.res.isdie;
            ToastManager.showToast(data.res.msg);
            // this.delItem(index);
            const arr: BagItem[] = data.res.bag_data;

            const foundItem = arr.find(item => item.id === this.chosedGood.id);
            if (foundItem) {
                Object.assign(this.chosedGood, foundItem);
            } else {
                this.chosedGood.count = 0;
            }

            this.doRender(true);
        } else {
            if (data) {
                ToastManager.showToast(data.err.message || '使用道具失败');
            }
        }

    }

    delItem(index: number) {
        this.containNode.children[index].destroy()
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


        //详情中下面按钮
        UIButtonUtil.initBtn(this.bagActionBtn, () => {
            //判断类型进行操作
            if (this.chosedGood.id == 20) {
                //可以合成
                const SynthesisNode = instantiate(this.SynthesisPrefab);
                const GetOrUsePopComponent = SynthesisNode.getComponent(SynthesisRender);
                //在背包中找到合成器
                const synthesisItem: EnrichedBagItem = UserDataManager.Instance.BagData.find(item => item.id === 3) || null;
                GetOrUsePopComponent.earnBageItemList.push(this.chosedGood, synthesisItem);
                GetOrUsePopComponent.depleteBageItemList.push(this.chosedGood, this.chosedGood);
                const successItem: EnrichedBagItem = {
                    id: 21, count: 1, name: '半碳桨', price: 0, status: 0,
                    use: 0, desc: '每次划桨，任务次数1.5倍'
                };
                GetOrUsePopComponent.successBageItemList.push(successItem);
                const failItem: EnrichedBagItem = {
                    id: 20, count: 1, name: '双桨', price: 0, status: 0, use: 0,
                    desc: '每次划桨，任务次数1.1倍'
                };
                GetOrUsePopComponent.failBageItemList.push(failItem);
                this.node.addChild(SynthesisNode);

            } else if (this.chosedGood && this.chosedGood.id) {
                this.userProps(this.chosedGood.id);
            }
        });

        let icon_urllChosed = 'Texture/2.0/6游戏背包/选择按钮/spriteFrame';
        this.chosedBtn = this.allBtn;
        UIButtonUtil.initBtn(this.allBtn, () => {
            if (this.chosedBtn.name.includes('all')) {
                return;
            }
            this.doRender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.allBtn;
            //更改文字颜色、图片、文字top、大小
            this.allBtn.getComponent(Widget).isAlignVerticalCenter = true;
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
            this.doRender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.bonusBtn;
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
            this.doRender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.materialBtn;
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
            this.doRender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.funcBtn;
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
            this.doRender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.attackBtn;
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
            this.doRender();
            this.setChosedToUnchosed();
            this.chosedBtn = this.defenseBtn;
            resAssetLoad<SpriteFrame>(icon_urllChosed, SpriteFrame).then(res => {
                this.defenseBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        });

    }

    setChosedToUnchosed() {
        let icon_urllUnchosed = 'Texture/2.0/6游戏背包/分类按钮/spriteFrame';
        if (this.chosedBtn.name.includes('all')) {
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.allBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('bonus')) {
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.bonusBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('material')) {
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.materialBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('func')) {
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.funcBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('attack')) {
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.attackBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        } else if (this.chosedBtn.name.includes('defense')) {
            resAssetLoad<SpriteFrame>(icon_urllUnchosed, SpriteFrame).then(res => {
                this.defenseBtn.getComponent(Sprite).spriteFrame = res;
            }).catch((err) => {
                console.log('icon加载失败');
            })
        }
    }


    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }

    update(deltaTime: number) {

    }

    // showDes(name: string, des: string, bagItemNode: Node) {
    //     // console.log('index = ',index);
    //     // console.log('showGoodDesIndex = ',this.showGoodDesIndex);
    //     this.descriptionNode = this.node.getChildByName('description');
    //     const worldPos = bagItemNode.getWorldPosition();
    //     const descParent = this.descriptionNode.parent;
    //     const descParentUITransform = descParent.getComponent(UITransform);
    //     const localPos = descParentUITransform.convertToNodeSpaceAR(worldPos);

    //     this.descriptionNode.setPosition(localPos.x < 0 ? localPos.x + 160 : localPos.x, localPos.y - 90);
    //     this.descriptionNode.getChildByName('desNameLabel').getComponent(Label).string = name;
    //     this.descriptionNode.getChildByName('deslabel').getComponent(Label).string = des;
    //     this.descriptionNode.active = true;
    //     this.maskNode.active = true;
    // }

}

