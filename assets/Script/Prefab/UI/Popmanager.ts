import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, NoticesType, popType, PREFAB_PATH_ENUM } from '../../Data/Enum';
import { resAssetLoad } from '../../Base/Utils';
import { UIUserRecord } from '../../Prefab/UerInfo/UIUserRecord';
import { loadingManager } from './LoadingManager';
import { SystemAnnouncement } from './Notice/SystemAnnouncement';
const { ccclass, property } = _decorator;

@ccclass('Popmanager')
export class Popmanager extends Component {



    protected onLoad(): void {


        EventManager.Instance.on(EVENT_ENUM.RenderHomePop, this.popRender, this);
    }

    protected onDestroy(): void {

        EventManager.Instance.off(EVENT_ENUM.RenderHomePop, this.popRender, this);

    }


    // popRender(prefab_url:PREFAB_PATH_ENUM){
    popRender(payload: { prefab_url: PREFAB_PATH_ENUM, source: popType, typeSpecific?: any }) {
        console.log(payload);
        const { prefab_url, source ,typeSpecific} = payload;
        if (prefab_url == PREFAB_PATH_ENUM.BagPrefab || prefab_url == PREFAB_PATH_ENUM.ShopPrefab
            || prefab_url == PREFAB_PATH_ENUM.UIUserInfo || prefab_url == PREFAB_PATH_ENUM.MyTask) {
            loadingManager.showLoadingImmediately();
        }else if(prefab_url == PREFAB_PATH_ENUM.SystemAnnouncement || prefab_url == PREFAB_PATH_ENUM.PickUpReward
            || prefab_url == PREFAB_PATH_ENUM.Setting
        ){
            //不显示加载
        }else{
            loadingManager.showLoading();
        }
        if (source == popType.null) {
            resAssetLoad<Prefab>(prefab_url, Prefab).then(prefab => {
                const node = instantiate(prefab);
                this.node.addChild(node);

            }).catch(err => {
                console.error('❌ 预制体加载失败:', prefab_url);
                console.error('错误详情:', err);
            });
        // } else if (source == popType.personalGameRecord || source == popType.powerRecord) {
        } else if(source == popType.Notice){
            resAssetLoad<Prefab>(prefab_url, Prefab).then(prefab => {
                const node = instantiate(prefab);
                const systemAnnouncement = node.getComponent(SystemAnnouncement);
                if (typeSpecific == NoticesType.Gonggao) {
                    systemAnnouncement.noticesType = NoticesType.Gonggao;
                } else if (typeSpecific == NoticesType.Introduction) {
                    systemAnnouncement.noticesType = NoticesType.Introduction;
                }
                this.node.addChild(node);
            }).catch(err => {
                console.error('❌ 预制体加载失败:', prefab_url);
                console.error('错误详情:', err);
            });
        }


    }


    update(deltaTime: number) {

    }
}

