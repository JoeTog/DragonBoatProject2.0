import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, popType, PREFAB_PATH_ENUM } from '../../Data/Enum';
import { resAssetLoad } from '../../Base/Utils';
import { UIUserRecord } from '../../Prefab/UerInfo/UIUserRecord';
import { loadingManager } from './LoadingManager';
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
    popRender(payload: { prefab_url: PREFAB_PATH_ENUM, source: popType }) {
        console.log(payload);
        const { prefab_url, source } = payload;
        if (prefab_url == PREFAB_PATH_ENUM.BagPrefab || prefab_url == PREFAB_PATH_ENUM.ShopPrefab
            || prefab_url == PREFAB_PATH_ENUM.UIUserInfo || prefab_url == PREFAB_PATH_ENUM.MyTask) {
            loadingManager.showLoadingImmediately();
        }else if(prefab_url == PREFAB_PATH_ENUM.SystemAnnouncement || prefab_url == PREFAB_PATH_ENUM.PickUpReward){
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
        } else if (source == popType.personalGameRecord || source == popType.powerRecord) {
            
            resAssetLoad<Prefab>(prefab_url, Prefab).then(prefab => {
                const node = instantiate(prefab);
                const UIUserInfoTs = node.getComponent(UIUserRecord);
                if (source == popType.personalGameRecord) {
                    UIUserInfoTs.recordType = popType.personalGameRecord;
                } else if (source == popType.powerRecord) {
                    UIUserInfoTs.recordType = popType.powerRecord;
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

