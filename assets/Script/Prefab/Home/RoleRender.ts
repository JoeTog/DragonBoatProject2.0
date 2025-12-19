import { _decorator, Component, dragonBones, instantiate, Node, Prefab, sys } from 'cc';
import UserDataManager from '../../Data/UserDataManager';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { LocalStorageKey, IPlayerSetInfo, EVENT_ENUM, PREFAB_PATH_ENUM, popType } from '../../Data/Enum';
import EventManager from '../../Base/EventManager';
const { ccclass, property } = _decorator;

@ccclass('RoleRender')
export class RoleRender extends Component {

    @property(Prefab)
    SingleGameView: Prefab = null;



    private dzNode: Node = null;
    private dyNode: Node = null;


    private singleGameViewNode: Node = null;




    protected onLoad(): void {
        //获取队长、队员节点
        this.dzNode = this.node.getChildByName("dz");
        this.dyNode = this.node.getChildByName("dy");
        const isCaptain = UserDataManager.Instance.IsCaptain;
        if (isCaptain) {
            this.dzNode.active = true;
            this.dyNode.active = false;
            this.dzNode.getComponent(dragonBones.ArmatureDisplay).playAnimation("newAnimation");
        } else {
            this.dyNode.active = true;
            this.dzNode.active = false;
            this.dyNode.getComponent(dragonBones.ArmatureDisplay).playAnimation("newAnimation");
        }


        const SingleBtn = this.node.getChildByName('SingleBtn');
        UIButtonUtil.initBtn(SingleBtn, () => {
            //单机游戏
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.SingleGame,
                source: popType.null
            });

            // this.singleGameViewNode = instantiate(this.SingleGameView);
            // this.node.addChild(this.singleGameViewNode);
        });


        // const Sprite = this.node.getChildByName('Sprite');
        // UIButtonUtil.initBtn(Sprite, () => {
        //     const personalInfo: IPlayerSetInfo = {
        //         userId: UserDataManager.Instance.UserInfo.uid,
        //         musicVolume: 0.3,
        //         effectsVolume:0.3
        //     };
        //     sys.localStorage.setItem(
        //         LocalStorageKey.PersonalConfig + `_${UserDataManager.Instance.UserInfo.uid}`,
        //         JSON.stringify(personalInfo)
        //     );
        // });

        // const Spritesec = this.node.getChildByName('Spritesec');
        // UIButtonUtil.initBtn(Spritesec, () => {
        //     let PersonalConfig:IPlayerSetInfo = sys.localStorage.getItem(LocalStorageKey.PersonalConfig + `_${UserDataManager.Instance.UserInfo.uid}`);
        //     console.log('PersonalConfig = ',PersonalConfig);
        // });




    }

    update(deltaTime: number) {

    }




}

