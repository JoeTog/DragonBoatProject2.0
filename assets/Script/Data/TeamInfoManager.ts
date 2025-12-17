import EventManager from '../Base/EventManager';
import Singleton from '../Base/Singleton';
import { ITeam, ITeamBase } from '../Net/Shared/models/Interfaces';
import { MsgTeamJoin } from '../Net/Shared/protocols/team/MsgTeamJoin';
import { MsgTeamLeave } from '../Net/Shared/protocols/team/MsgTeamLeave';
import { MsgTeamStatusChange } from '../Net/Shared/protocols/team/MsgTeamStatusChange';
import { TsRpc } from '../Net/TsRpc';
import { ToastManager } from '../Prefab/UI/ToastManager';
import { EVENT_ENUM } from './Enum';
import UserDataManager from './UserDataManager';



export class TeamInfoManager extends Singleton {

    static get Instance() {
        return super.GetInstance<TeamInfoManager>();
    }

    private _teamInfo: ITeam = null;

    public get TeamInfo() {
        return this._teamInfo;
    }

    public set TeamInfo(v: ITeam) {
        this._teamInfo = v;
    }

    //我的队伍界面 添加人员
    public async addMember(d: MsgTeamJoin) {
        if (!TeamInfoManager.Instance.TeamInfo) {
            console.log('当前不在 队伍界面 中 可能是重启游戏了，不显示游戏结果dealRoomDie');
            return;
        }
        let changeIndex = -1;
        for (let index = 0; index < this._teamInfo.players.length; index++) {
            const element = this._teamInfo.players[index];
            if (element.uid == d.player.uid) {
                //成员复活
                changeIndex = index;
                break;
            }
        }
        if (changeIndex >= 0) {
            //成员复活
            this._teamInfo.players[changeIndex] = d.player;
            EventManager.Instance.emit(EVENT_ENUM.AddTeamMember, changeIndex, d.player);
            return;
        }
        const player = d.player;
        this._teamInfo.players.push(player);
        this._teamInfo.playersCount += 1;
        EventManager.Instance.emit(EVENT_ENUM.AddTeamMember, -1, player);
        let ret = await this.getTeamInfo();
        if (ret) {
            EventManager.Instance.emit(EVENT_ENUM.RefreshTeammember);
        }

    }

    public async delMember(d: MsgTeamLeave) {
        if (!this._teamInfo) {
            return;
        }
        let uid = d.uid;
        console.log('this._teamInfo.players = ', this._teamInfo);
        const players = this._teamInfo.players;
        const index = this._teamInfo.players.findIndex(el => el.uid == uid);
        if (index === -1) {
            console.warn(`TeamInfoManager: 未找到 uid=${uid} 的成员，无法删除`);
            return;
        }
        players.splice(index, 1);
        this._teamInfo.playersCount -= 1;
        EventManager.Instance.emit(EVENT_ENUM.DelTeammember, uid);
        if (uid != UserDataManager.Instance.UserInfo.uid) {
            let ret = await this.getTeamInfo();
            if (ret) {
                EventManager.Instance.emit(EVENT_ENUM.RefreshTeammember);
            }
        }

    }

    //更新队伍信息
    public async getTeamInfo() {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法获取队伍GetTeamInfo');
            ToastManager.showToast('网络连接异常，请稍后重试【getTeamInfo】');
            return;
        }
        // loadingManager.showLoading();
        //请求队伍信息，赋值到userdata 通知跳转、通知隐藏hall
        let teamInfo = await TsRpc.Instance.Client.callApi("team/GetTeamInfo", { __ssoToken: UserDataManager.Instance.SsoToken })
        if (!teamInfo.isSucc) {
            // ToastManager.showToast('加入队伍后，获取队伍信息异常');
            ToastManager.showToast('获取队伍信息异常');
            return;
        }
        if (!teamInfo.res.hasTeam) {
            ToastManager.showToast('队伍不存在');
            return;
        }
        //队伍信息
        const needRefresh = this.shouldRefreshPlayers(this._teamInfo, teamInfo.res.info);
        this._teamInfo = teamInfo.res.info;
        return needRefresh;

    }

    //核实队伍中成员 顺序、是否不一样
    private shouldRefreshPlayers(prevInfo: ITeam | null, nextInfo: ITeam): boolean {
        if (!prevInfo) return true;

        const prevPlayers = prevInfo.players ?? [];
        const nextPlayers = nextInfo.players ?? [];
        if (prevPlayers.length !== nextPlayers.length) return true;

        const prevUidSet = new Set(prevPlayers.map(p => p.uid));
        for (const player of nextPlayers) {
            if (!prevUidSet.has(player.uid)) {
                return true;
            }
        }

        for (let i = 0; i < prevPlayers.length; i++) {
            if (prevPlayers[i].uid !== nextPlayers[i].uid) {
                return true;
            }
        }

        return false;
    }

    public closeteam(isClose = false) {

        EventManager.Instance.emit(EVENT_ENUM.HideTeam, isClose, false);
        this.resetData();
    }

    public oneTeamDisabled(teamid: number) {

        EventManager.Instance.emit(EVENT_ENUM.DelTeam, teamid);

    }

    public oneTeamAdd(team: ITeamBase) {

        EventManager.Instance.emit(EVENT_ENUM.AddTeam, team);

    }

    public teamStatusChange(msg: MsgTeamStatusChange) {

        EventManager.Instance.emit(EVENT_ENUM.TeamStatusChange, msg);
    }


    public resetData() {
        this._teamInfo = null;
    }


    public get IsCaptainInTeam(): boolean {

        return UserDataManager.Instance.UserInfo.uid == this._teamInfo.id;
    }















}

