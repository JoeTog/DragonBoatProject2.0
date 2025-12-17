import { _decorator, Component, Label, Node } from 'cc';
import { UIButtonUtil } from '../../../Base/UIButtonUtil';
const { ccclass, property } = _decorator;

@ccclass('SingleUIRender')
export class SingleUIRender extends Component {
    //倒计时结束 通知回调
    countDownBlock?: () => void;
    //游戏结束
    overBlock?: () => void;
    //重新开始
    repeatBlock?: () => void;


    private countDownNode: Node = null;
    private dieNode: Node = null;

    private repeatNode: Node = null;
    private overNode: Node = null;
    
    private resultlabel: Label = null;
    



    protected onLoad(): void {

        this.countDownNode = this.node.getChildByName('countdown');
        this.dieNode = this.node.getChildByName('die');

        this.repeatNode = this.dieNode.getChildByName('spriteRepeat');
        this.overNode = this.dieNode.getChildByName('overSprite');
        
        this.resultlabel = this.dieNode.getChildByName('label').getComponent(Label);
        

        UIButtonUtil.initBtn(this.repeatNode, () => {
            this.dieNode.active = false;
            this.repeatBlock();
            this.playCountdown();
        });

        UIButtonUtil.initBtn(this.overNode, () => {
            this.overBlock();
        });


        this.playCountdown();


    }

    /**
     * 依次以 1 秒间隔调用 renderGameCountDown，传入 3、2、1
     */
    public playCountdown(): void {
        const sequence = [3, 2, 1,0];
        // const sequence = [1, 0];
        let index = 0;

        const tick = () => {
            if (index >= sequence.length) {
                this.unschedule(tick);
                return;
            }
            this.renderGameCountDown(sequence[index]);
            index += 1;
        };

        // 立即执行第一次，并安排后续调用
        tick();
        this.schedule(tick, 1);
    }

    dieRender(isSuccess:boolean) {
        // this.dieNode = null;
        this.dieNode.active = true;
        if (isSuccess) {
            this.resultlabel.string = '挑战成功！';
            
        }else{
            
            this.resultlabel.string = '您已被淘汰！';
        }
    }

    //收到倒计时通知
    renderGameCountDown(time: number) {
        if (time == 0) {
            //当倒计时为0 则隐藏
            this.countDownNode.active = false;
            console.log('倒计时隐藏 = 0');
            this.countDownBlock?.();
        } else {
            //倒计时赋值
            this.countDownNode.active = true;
            this.countDownNode.getChildByName('label').getComponent(Label).string = `${time}`;
            console.log('倒计时赋值 = ', time);
        }

    }


    update(deltaTime: number) {

    }
}

