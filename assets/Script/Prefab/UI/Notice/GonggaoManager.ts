import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import EventManager from '../../../Base/EventManager';
import ConfigManager from '../../../Base/ConfigManager';
import { UIButtonUtil } from '../../../Base/UIButtonUtil';
import { NoticesType } from '../../../Data/Enum';

const { ccclass, property } = _decorator;



@ccclass('GonggaoManager')
export class GonggaoManager extends Component {

    @property(Prefab)
    labelPrefab: Prefab = null;

    //显示什么
    public noticesType: NoticesType = NoticesType.Gonggao;


    private contentNode: Node = null;
    private titleLabel: Label = null;



    protected start(): void {
        const popNode = this.node.getChildByName('pop');
        this.contentNode = popNode.getChildByName('bg').getChildByName('detailScrollV').getChildByName('view').getChildByName('content');
        this.titleLabel = popNode.getChildByName('bg').getChildByName('title').getComponent(Label);
        // EventManager.Instance.on("ShowGonggao", this.showGonggao, this)
        if (this.noticesType == NoticesType.Gonggao) {
            this.titleLabel.string = '游戏公告'
        } else if (this.noticesType == NoticesType.Introduction) {
            this.titleLabel.string = '游戏说明'
        }
        const closeNode = this.node.getChildByName('close');
        UIButtonUtil.initBtn(closeNode, () => {
            this.node.destroy();
        });
        this.showGonggao();
    }

    showGonggao() {
        let data = ConfigManager.Instance.announcement;
        if (this.noticesType == NoticesType.Gonggao) {
        } else if (this.noticesType == NoticesType.Introduction) {
            data = ConfigManager.Instance.introduction;
        }
        for (let i = 0; i < data.length; i++) {
            const node = instantiate(this.labelPrefab);
            node.getComponent(Label).string = data[i];
            this.contentNode.addChild(node);
        }
        // this.GonggaoNode.active = true;
    }


}

