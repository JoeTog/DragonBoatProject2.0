import { _decorator, Component, instantiate, Label, Node, Prefab, tween, Vec3 } from 'cc';
import ConfigManager from '../../../Base/ConfigManager';
import { UIButtonUtil } from '../../../Base/UIButtonUtil';
import { NoticesType } from '../../../Data/Enum';
const { ccclass, property } = _decorator;

@ccclass('SystemAnnouncement')
export class SystemAnnouncement extends Component {


    @property(Prefab)
    labelPrefab: Prefab = null;

    @property(Node)
    messageScrollV: Node = null;

    @property(Node)
    messageContentV: Node = null;
    @property(Label)
    titleLabel: Label = null;


    //显示什么
    public noticesType: NoticesType = NoticesType.Gonggao;

    // 动画持续时间（秒）
    private readonly ANIM_DURATION = 0.5;
    // 起始Y位置
    private readonly START_POS_Y = 600;

    private targetPosition: Vec3 = null;



    protected onLoad(): void {

        if (this.noticesType == NoticesType.Gonggao) {
            this.titleLabel.string = '公告'
        } else if (this.noticesType == NoticesType.Introduction) {
            this.titleLabel.string = '说明'
        }

        this.messageContentV.destroyAllChildren();

        let data = ConfigManager.Instance.announcement;
        if (this.noticesType == NoticesType.Gonggao) {
        } else if (this.noticesType == NoticesType.Introduction) {
            data = ConfigManager.Instance.introduction;
        }

        for (let i = 0; i < data.length; i++) {
            const contentCell = instantiate(this.labelPrefab);
            contentCell.getComponent(Label).string = data[i];
            this.messageContentV.addChild(contentCell);
        }

        const closeNode = this.node.getChildByName('close');
        UIButtonUtil.initBtn(closeNode, () => {
            this.node.destroy();
        });

        // 使用tween创建动画
        this.targetPosition = this.messageScrollV.position.clone();

        const startPos = new Vec3(this.targetPosition.x, this.START_POS_Y, this.targetPosition.z);
        this.messageScrollV.setPosition(startPos);
        this.messageScrollV.active = true;

        // 创建动画
        tween(this.messageScrollV)
            .to(this.ANIM_DURATION,
                { position: this.targetPosition },
                {
                    // 使用线性缓动，保持匀速运动
                    easing: 'linear',
                    onStart: () => {
                        // console.log('开始滚动消息');
                    },
                    onComplete: () => {
                        // console.log('消息滚动完成');
                    }
                }
            )
            .start();




    }





    update(deltaTime: number) {

    }
}

