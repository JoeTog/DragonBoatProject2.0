import { _decorator, Component, EditBox, instantiate, Label, Node, Prefab, tween, v3 } from 'cc';
import UserDataManager from '../../Data/UserDataManager';
import { BigNumUtils, isValidPositiveInteger } from '../../Base/Utils';
import { TsRpc } from '../../Net/TsRpc';
import { ToastManager } from '../UI/ToastManager';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { GetOrUsePop } from '../bagAndeShop/GetOrUsePop';
import { GetOrUsePopType } from '../../Data/Enum';
import { EnrichedBagItem } from '../../Net/Shared/models/Interfaces';
import { loadingManager } from '../UI/LoadingManager';
const { ccclass, property } = _decorator;

@ccclass('DjExchageRender')
export class DjExchageRender extends Component {


    @property(Prefab)
    getOrUsePop: Prefab = null;

    @property(EditBox)
    inputValue: EditBox = null;

    @property(Label)
    pointLabel: Label = null;
    @property(Label)
    powerLabel: Label = null;




    private popNode: Node = null;
    protected closeBtn: Node = null;

    private jifenlabel: Label = null;
    private djlabel: Label = null;
    private tipLabel: Label = null;

    private btnNode: Node = null;



    protected onLoad(): void {
        this.popNode = this.node.getChildByName('pop');
        this.popNode.setScale(v3(0, 0, 0));

        this.jifenlabel = this.popNode.getChildByName('jifen').getChildByName('value').getChildByName('label').getComponent(Label);
        this.djlabel = this.popNode.getChildByName('dj').getChildByName('value').getChildByName('label').getComponent(Label);
        this.tipLabel = this.popNode.getChildByName('tip').getComponent(Label);

        this.btnNode = this.popNode.getChildByName('sureBtn');

        tween(this.popNode)
            .to(0.2, { scale: v3(1, 1, 1) }, { easing: 'backInOut' })
            .start();

        this.closeBtn = this.popNode.getChildByName('close');
        UIButtonUtil.initBtn(this.closeBtn, () => {
            this.node.destroy();
        })

        UIButtonUtil.initBtn(this.btnNode, () => {
            this.doExchage();
        })

        this.doRender();

        this.inputValue.node.on(EditBox.EventType.EDITING_DID_BEGAN, this.onEditBegin, this);
        this.inputValue.node.on(EditBox.EventType.EDITING_DID_ENDED, this.onEditEnd, this);
        this.inputValue.node.on(EditBox.EventType.TEXT_CHANGED, this.onTextChanged, this);

        loadingManager.hideLoading();


    }

    // 添加这些方法到类中
    private onEditBegin(editbox: EditBox) {
        // console.log('开始输入', editbox.string);
    }

    private onEditEnd(editbox: EditBox) {
        // console.log('结束输入', editbox.string);
        this.validateInput(editbox.string);
    }

    private onTextChanged(editbox: EditBox) {
        const text = editbox.string;
        // console.log('输入内容变化:', text);
        // 这里可以添加实时验证或处理逻辑
        // 例如：实时更新UI或限制输入格式
        if (parseInt(text, 10) > 9999999) {
            ToastManager.showToast('输入数值过大,请重新输入');
            this.inputValue.string = '';
            return;
        }else if(parseInt(text, 10) < 100){
            this.pointLabel.string = `-${BigNumUtils.getNumberStringWan(0)}积分`;
            this.powerLabel.string = `+${BigNumUtils.getNumberStringWan(0)}武力值`;
        }
        this.updatePreview(text);
    }

    // 验证输入内容
    private validateInput(input: string): boolean {
        const num = parseInt(input, 10);
        if (isNaN(num) || num < 100) {
            ToastManager.showToast('请输入不小于100的整数');
            this.inputValue.string = '';
            return false;
        }
        return true;
    }

    // 更新预览信息（例如：显示兑换后的点数）
    private updatePreview(input: string): void {
        const num = parseInt(input, 10);
        if (!isNaN(num) && num >= 100) {
            // 这里可以添加更新UI的逻辑，例如显示预计获得的点券数量
            const value = num * 10; // 假设1积分=10点券
            this.pointLabel.string = `-${BigNumUtils.getNumberStringWan(num)}积分`;
            this.powerLabel.string = `+${BigNumUtils.getNumberStringWan(value)}武力值`;
        }
    }

    doExchage() {
        const numStr = this.inputValue.string.trim();
        if (!isValidPositiveInteger(numStr)) {
            ToastManager.showToast('请输入合理数字');
            this.inputValue.string = '';
            return;
        }
        const num = parseInt(numStr, 10);
        if (num < 100) {
            ToastManager.showToast('最低兑换100');
            this.inputValue.string = '';
            return;
        }
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法兑换点卷');
            ToastManager.showToast('网络连接异常，请稍后重试【doExchage】');
            return;
        }
        const count = num;
        TsRpc.Instance.Client.callApi('shop/ExchangePoint', { __ssoToken: UserDataManager.Instance.SsoToken, count }).then(res => {
            if (res.isSucc) {
                console.log('兑换成功返回 = ', res);
                let game_coin = res.res.game_coin;
                let point = res.res.point;
                let power = res.res.power;
                let freePower = res.res.freezePower;
                this.jifenlabel.string = `${game_coin}` + '';
                this.djlabel.string = `${point}` + '';
                if (power >= 10000) {
                    UserDataManager.Instance.IsDie = 0;
                } else {
                    UserDataManager.Instance.IsDie = 1;
                }
                UserDataManager.Instance.updateUserInfo(game_coin, point, power, freePower);
                this.tipLabel.string = '积分 ：点卷 =  1 ：10  可兑换 ' + `${Math.round(game_coin * 100) / 10}` + '';
                this.inputValue.string = '';

                const djItem: EnrichedBagItem = {
                    id: 1,
                    count: 0,
                    name: `${BigNumUtils.getNumberStringWan(count * 10)}点卷`,
                    price: 0,
                    status: 0,
                    use: 0,
                    desc: ''
                };
                const powerItem: EnrichedBagItem = {
                    id: 2,
                    count: 0,
                    name: `${BigNumUtils.getNumberStringWan(count * 10)}武力值`,
                    price: 0,
                    status: 0,
                    use: 0,
                    desc: ''
                };

                //getOrUsePop 弹窗购买成功
                const getOrUsePop = instantiate(this.getOrUsePop);
                const GetOrUsePopComponent = getOrUsePop.getComponent(GetOrUsePop);
                GetOrUsePopComponent.showType = GetOrUsePopType.exchange;
                GetOrUsePopComponent.bagItemList.push(djItem, powerItem);
                this.node.addChild(getOrUsePop);


            } else {
                ToastManager.showToast('兑换失败');
            }
        })




    }

    doRender() {
        this.inputValue.string = '';
        const game_coin = UserDataManager.Instance.GameCoin;
        this.jifenlabel.string = `${game_coin}` + '';
        const point = UserDataManager.Instance.Point;
        this.djlabel.string = `${Math.round(point * 100) / 100}` + '';
        this.tipLabel.string = '积分 ：点卷 =  1 ：10  可兑换 ' + `${Math.round(game_coin * 100) / 10}` + '';




    }


    protected onDestroy(): void {
        // 移除事件监听
        if (this.inputValue && this.inputValue.node) {
            this.inputValue.node.off(EditBox.EventType.EDITING_DID_BEGAN, this.onEditBegin, this);
            this.inputValue.node.off(EditBox.EventType.EDITING_DID_ENDED, this.onEditEnd, this);
            this.inputValue.node.off(EditBox.EventType.TEXT_CHANGED, this.onTextChanged, this);
        }
    }

    update(deltaTime: number) {

    }



}

