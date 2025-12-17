import { _decorator, Color, Component, Node, Sprite } from 'cc';
import { NetManager, NetworkQualityChangePayload } from '../../Net/NetManager';
import { EVENT_ENUM, NetType } from '../../Data/Enum';
import EventManager from '../../Base/EventManager';
const { ccclass, property } = _decorator;

@ccclass('NetworkRender')
export class NetworkRender extends Component {

    @property(Node)
    newtworkViewFirst: Node;

    @property(Node)
    newtworkViewSec: Node;

    @property(Node)
    newtworkViewThree: Node;


    IsuseNewColor: boolean = false;
    public excellentColor: string = '#22C55E';
    public goodColor: string = '#FACC15';
    public fairColor: string = '#F59E0B';
    public poorColor: string = '#D97706';



    protected onLoad(): void {

        // console.log('NetworkRender onload');
        // console.log('NetworkRender onload', this.newtworkViewFirst);
        // console.log('NetworkRender onload', this.newtworkViewSec);
        // console.log('NetworkRender onload', this.newtworkViewThree);

        EventManager.Instance.on(NetManager.NETWORK_QUALITY_EVENT, this.networkViewUpdate, this);


    }

    protected onDestroy(): void {
        EventManager.Instance.off(NetManager.NETWORK_QUALITY_EVENT, this.networkViewUpdate, this);

    }

    // level: NetType;//网络强度等级 4个等级
    //     avgLatency: number;//延迟数值
    //     bars: number;//几格信号
    //     colorHex: string;//信号颜色
    //     shouldWarn: boolean;//是否需要提示网络延迟过大
    //     isDisconnected?: boolean;//是否断连

    networkViewUpdate(payload: NetworkQualityChangePayload) {
        // console.log('networkViewUpdate');
        if (!this.newtworkViewFirst || !this.newtworkViewSec || !this.newtworkViewThree) {
            return;
        }
        // console.log('payload.colorHex = ', payload.colorHex);
        // console.log('payload.this.newtworkViewFirst.getComponent(Sprite) = ', this.newtworkViewFirst.getComponent(Sprite));
        if (payload.bars == 3) {
            this.newtworkViewFirst.active = true;
            this.newtworkViewSec.active = true;
            this.newtworkViewThree.active = true;

            this.newtworkViewFirst.getComponent(Sprite).color = new Color(payload.colorHex);
            this.newtworkViewSec.getComponent(Sprite).color = new Color(payload.colorHex);
            this.newtworkViewThree.getComponent(Sprite).color = new Color(payload.colorHex);
            if (payload.level == NetType.excellent) {
                if (this.IsuseNewColor) {
                    this.newtworkViewFirst.getComponent(Sprite).color = new Color(this.excellentColor);
                    this.newtworkViewSec.getComponent(Sprite).color = new Color(this.excellentColor);
                    this.newtworkViewThree.getComponent(Sprite).color = new Color(this.excellentColor);
                }
            } else if (payload.level == NetType.good) {
                if (this.IsuseNewColor) {
                    this.newtworkViewFirst.getComponent(Sprite).color = new Color(this.goodColor);
                    this.newtworkViewSec.getComponent(Sprite).color = new Color(this.goodColor);
                    this.newtworkViewThree.getComponent(Sprite).color = new Color(this.goodColor);
                }
            }
        } else if (payload.bars == 2) {
            this.newtworkViewFirst.active = true;
            this.newtworkViewSec.active = true;
            this.newtworkViewThree.active = false;
            this.newtworkViewFirst.getComponent(Sprite).color = new Color(payload.colorHex);
            this.newtworkViewSec.getComponent(Sprite).color = new Color(payload.colorHex);
            if (this.IsuseNewColor) {
                    this.newtworkViewFirst.getComponent(Sprite).color = new Color(this.fairColor);
                    this.newtworkViewSec.getComponent(Sprite).color = new Color(this.fairColor);
                    this.newtworkViewThree.getComponent(Sprite).color = new Color(this.fairColor);
                }
        } else if (payload.bars == 1) {
            this.newtworkViewFirst.active = true;
            this.newtworkViewSec.active = false;
            this.newtworkViewThree.active = false;
            this.newtworkViewFirst.getComponent(Sprite).color = new Color(payload.colorHex);
            if (this.IsuseNewColor) {
                    this.newtworkViewFirst.getComponent(Sprite).color = new Color(this.poorColor);
                    this.newtworkViewSec.getComponent(Sprite).color = new Color(this.poorColor);
                    this.newtworkViewThree.getComponent(Sprite).color = new Color(this.poorColor);
                }

        }
    }





    update(deltaTime: number) {

    }
}


