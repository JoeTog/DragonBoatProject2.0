import { _decorator, Component, Label, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('pickupRewardCellManager')
export class pickupRewardCellManager extends Component {

    @property(Node)
    bg: Node = null;
    @property(Label)
    nameLabel: Label = null;
    @property(Node)
    iconNode: Node = null;
    @property(Node)
    desContentV: Node = null;
    @property(Prefab)
    labelPrefab: Prefab = null;



    
    protected onLoad(): void {
        


    }

    update(deltaTime: number) {
        
    }
}

