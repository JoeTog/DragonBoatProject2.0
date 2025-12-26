import { _decorator, Component, Node } from 'cc';
import UserDataManager from '../Data/UserDataManager';
import EventManager from '../Base/EventManager';
import { EVENT_ENUM, popType, PREFAB_PATH_ENUM } from '../Data/Enum';
import { UIButtonUtil } from '../Base/UIButtonUtil';
import { TsRpc } from '../Net/TsRpc';
import { ToastManager } from './UI/ToastManager';
import { TeamInfoManager } from '../Data/TeamInfoManager';
import { loadingManager } from './UI/LoadingManager';
import { ResCheckMaintenance } from '../Net/Shared/protocols/common/PtlCheckMaintenance';
const { ccclass, property } = _decorator;

@ccclass('HomeDownRender')
export class HomeDownRender extends Component {

    private roleNode: Node = null;
    private dzNode: Node = null;
    private dyNode: Node = null;
    private dieNode: Node = null;

    private createTeamNode: Node = null;
    private hallBtn: Node = null;

    protected onLoad(): void {

        this.roleNode = this.node.getChildByName("role");
        this.dzNode = this.roleNode.getChildByName("dz");
        this.dyNode = this.roleNode.getChildByName("dy");
        this.dieNode = this.roleNode.getChildByName("die");
        // this.createTeamNode = this.roleNode.getChildByName('create_team')
        this.hallBtn = this.roleNode.getChildByName('hall')

        EventManager.Instance.on(EVENT_ENUM.UpdateCaptain, this.doRender, this);
        EventManager.Instance.on(EVENT_ENUM.UpdateIsDie, this.doRender, this);

        // EventManager.Instance.on(EVENT_ENUM.ToCreateTeam, this.createTeam, this);

        UIButtonUtil.initBtn(this.hallBtn, async () => {
            const ret = await this.CheckMaintenance();
            if (ret) {
                this.popHall();
            }

        })
        
        this.doRender();

    }

    //检查是否维护中
    async CheckMaintenance(): Promise<boolean> {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，检查');
            ToastManager.showToast('网络连接异常，请稍后重试【检查】');
            return false;
        }
        try {
            const data = await TsRpc.Instance.Client.callApi('common/CheckMaintenance', { __ssoToken: UserDataManager.Instance.SsoToken });
            if (!data.isSucc || !data.res || data.res.isMaintenance) {
                if (!data.isSucc) {
                    ToastManager.showToast('维护中...');
                    return false;
                } else if (data.res.isMaintenance) {
                    ToastManager.showToast('维护中');
                    // ToastManager.showToast(data.res.maintenanceMessage);
                    return false;
                }
                ToastManager.showToast('紧急维护中....');
                return false;
            }
            return true;
        } catch (error) {
            ToastManager.showToast("获取比赛列表失败")
            return false;
        }
    }

    popHall() {

        EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
            prefab_url: PREFAB_PATH_ENUM.HallPrefab,
            source: popType.null
        });

    }


    doRender() {
        const isCanptain = UserDataManager.Instance.IsCaptain;
        const isDie = UserDataManager.Instance.IsDie;
        this.dzNode.active = isCanptain;
        this.dyNode.active = !isCanptain;
        //角色是否淘汰 左下角显示淘汰
        this.dieNode.active = isDie == 1;
    }


    update(deltaTime: number) {

    }


    protected onDestroy(): void {

        EventManager.Instance.off(EVENT_ENUM.UpdateCaptain, this.doRender, this);
        EventManager.Instance.off(EVENT_ENUM.UpdateIsDie, this.doRender, this);
        // EventManager.Instance.off(EVENT_ENUM.ToCreateTeam, this.createTeam, this);
    }






}

