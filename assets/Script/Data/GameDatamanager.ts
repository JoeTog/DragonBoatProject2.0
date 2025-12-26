import EventManager from "../Base/EventManager";
import { JoeFunc } from "../Base/JoeFunc";
import Singleton from "../Base/Singleton";
import { MsgGameEnd } from "../Net/Shared/protocols/room/MsgGameEnd";
import { MsgGameTime } from "../Net/Shared/protocols/room/MsgGameTime";
import { MsgTaskComplete } from "../Net/Shared/protocols/room/MsgTaskComplete";
import { MsgTaskCountdown } from "../Net/Shared/protocols/room/MsgTaskCountdown";
import { MsgTaskEnd } from "../Net/Shared/protocols/room/MsgTaskEnd";
import { MsgTaskStart } from "../Net/Shared/protocols/room/MsgTaskStart";
import { MsgMatchFail } from "../Net/Shared/protocols/team/MsgMatchFail";
import { MsgMatchSuccess } from "../Net/Shared/protocols/team/MsgMatchSuccess"
import { MsgTeamPowerUpdate } from "../Net/Shared/protocols/team/MsgTeamPowerUpdate";
import { TsRpc } from "../Net/TsRpc";
import { ToastManager } from "../Prefab/UI/ToastManager";
import { EVENT_ENUM, GameStatus, TaskType } from "./Enum";
import { TeamInfoManager } from "./TeamInfoManager";
import UserDataManager from "./UserDataManager";


export class GameDataManager extends Singleton {

    private _gameStatus: GameStatus = GameStatus.RESTART;//正常启动逻辑
    private _gameItems: number[] = [];
    private _myTeamIndex: number = 0;
    private _vsTeamInfo: {
        name: string,
        avatar: string,
        count: number,
        maxcount: number
    }[] = []


    private _inPlaying: boolean = false;
    private _taskType: TaskType = null;
    private _gameResult: MsgGameEnd = null;

    //是否在重连
    private isRequestReConnect: boolean = false;
    //是否在游戏界面（VS 动画完成后设置为 true）
    private _inGameUI: boolean = false;
    //是否能开始游戏，当获取不到pkinfo 说明有问题 不能开始
    private _IsCanStartgame: boolean = true;

    static get Instance() {
        return super.GetInstance<GameDataManager>();
    }

    // 设置游戏状态
    public setGameStatus(status: GameStatus) {
        this._gameStatus = status;
    }
    public setInGameUI(value: boolean) {
        this._inGameUI = value;
    }

    public get GameStatus() {
        return this._gameStatus;
    }
    
    public get GameItems() {
        return this._gameItems;
    }

    public get MyTeamIndex() {
        return this._myTeamIndex
    }

    public get EnemyTeamIndex() {
        return this._myTeamIndex == 0 ? 1 : 0
    }

    public get TaskType() {
        return this._taskType
    }

    public get GameResult() {
        return this._gameResult
    }

    public get VsTeamInfo() {
        return this._vsTeamInfo
    }

    public _reset() {
        this._gameItems = []
        this._myTeamIndex = 0;
        this._vsTeamInfo = []
        this._inPlaying = false
        this._taskType = null;
        this._gameResult = null;
    }

    public dealMatchSuccess(data: MsgMatchSuccess) {
        if (!TeamInfoManager.Instance.TeamInfo) {
            return;
        }
        this._gameItems = data.gameItems;
        this._myTeamIndex = data.roomIndex;
        this._vsTeamInfo = data.info;
        console.warn(' dealMatchSuccess ');
        EventManager.Instance.emit(EVENT_ENUM.ShowVs)
    }

    public restoreGame(teamIndex, vsTeamInfo, gameItems, taskType?, currentTask?) {
        this._gameItems = gameItems;
        this._myTeamIndex = teamIndex;
        this._vsTeamInfo = vsTeamInfo;
        if (taskType === 'active') {
            this._taskType = TaskType.active;
            this._inPlaying = true;
        } else if (taskType === 'rest' || taskType === 'completed') {
            this._taskType = TaskType.rest;
            this._inPlaying = true;
        } else if (taskType === 'eliminated') {
            this._taskType = TaskType.failed;
            this._inPlaying = true;

        } else {
            this._inPlaying = false;
        }
        // EventManager.Instance.emit(EVENT_ENUM.ShowPKGame);
        EventManager.Instance.emit(EVENT_ENUM.ShowVs, () => {
            //判断重连后 restoreGame 没有 taskType的情况
        if (taskType === 'eliminated') {
            EventManager.Instance.emit(EVENT_ENUM.RoomDie);
            this._stopGame();
            if (currentTask) {
                this.dealTaskCountDown(currentTask);
            }

        }
        });

        

    }

    public dealMatchFail(d: MsgMatchFail) {
        EventManager.Instance.emit(EVENT_ENUM.HideMatching);
        ToastManager.showToast(d.reason);
    }

    public teamPowerUpdate(d: MsgTeamPowerUpdate) {
        if (TeamInfoManager.Instance.TeamInfo) {
            TeamInfoManager.Instance.TeamInfo.allPowerCur = d.allPowerCur;
            EventManager.Instance.emit(EVENT_ENUM.TeamPowerUpdate);
        }
    }

    public get InPlaying() {
        return this._inPlaying
    }

    private _startGame() {
        this._inPlaying = true;
        EventManager.Instance.emit(EVENT_ENUM.StartGame);
        EventManager.Instance.emit(EVENT_ENUM.RenderGameCountDown, 0);

    }

    private _stopGame() {
        console.log('_stopGame');
        this._inPlaying = false;
        EventManager.Instance.emit(EVENT_ENUM.StopGame);

    }

    //游戏倒计时 status为0，开始后为1
    public dealGameTime(data: MsgGameTime) {
        // 判断当前是否在 pkGame 中，如果不在则不通知 ShowPkResult
        if (!this._inGameUI && !this.isRequestReConnect) {
            switch (this._gameStatus) {
                // 不在游戏中 判断情况
                case GameStatus.RECONNECT:
                    console.log('处理断线重连逻辑');
                    this.isRequestReConnect = true;
                    this.reConnectGame();
                    break;
                case GameStatus.RESTART:
                    console.log('处理游戏重启逻辑');
                    // 不在游戏中 则请求队伍信息并加入
                    this.isRequestReConnect = true;
                    this.reConnectGame();
                    // 这里可以执行重启后的初始化
                    break;
                case GameStatus.NORMAL:
                default:
                    console.log('正常游戏逻辑');
                    break;
            }
            // 重置状态
            this._gameStatus = GameStatus.NORMAL;
            return;
        }

        //倒计时阶段
        if (data.status === 0) {
            EventManager.Instance.emit(EVENT_ENUM.RenderGameCountDown, data.time);
            return;
        }
        if (this._taskType == TaskType.noned) {
            console.log('当前 TaskType.noned ，不显示游戏结果dealGameTime');
            return;
        }

        //游戏中
        if (data.status === 1) {
            if (!this._inPlaying) {
                this._startGame();
            }

            if (data.info) {
                let myTeamInfo = data.info[this.MyTeamIndex];
                let enemyTeamInfo = data.info[this.EnemyTeamIndex];
                EventManager.Instance.emit(EVENT_ENUM.UpdateGameInfoByNetGameTime, myTeamInfo.powerMax, myTeamInfo.powerCur,enemyTeamInfo.powerMax, enemyTeamInfo.powerCur, data.playerPowerCur, data.time)

            }
        }
        if (data.status === 3) {
            console.warn('⚠️ [状态异常] 任务进行中收到 status=3，当前 TaskType:', this._taskType);
            // console.log('后台推送了status为3 游戏结束,这时候游戏状态= ',this._taskType);
            if (this._taskType !== TaskType.active) {
                this._taskType = TaskType.noned;
            }
        }

    }

    public dealRoomDie() {
        //通知更新UI
        EventManager.Instance.emit(EVENT_ENUM.RequestUserInfo);
        if (!GameDataManager.Instance.setInGameUI) {
            console.log('当前不在 pkGame 中，不显示游戏结果dealRoomDie');
            return;
        }
        EventManager.Instance.emit(EVENT_ENUM.RoomDie);
        this._stopGame();
    }

    public dealTaskStart(msg: MsgTaskStart) {

        this._taskType = TaskType.active;
        let str = `任务${msg.taskIndex}:0/${msg.targetSwipes}   剩余时间:${msg.duration}`;
        EventManager.Instance.emit(EVENT_ENUM.RenderTaskLabel, true, str, true);
        EventManager.Instance.emit(EVENT_ENUM.OperatorRenderDirecLabel, true, false);
    }

    public dealTaskComplete(msg?: MsgTaskComplete) {
        // let str = '中场休息中...';
        this._taskType = TaskType.rest;
        // EventManager.Instance.emit(EVENT_ENUM.RenderTaskLabel, true, str);
    }

    public dealTaskCountDown(msg: MsgTaskCountdown) {
        //console.log('打印 :MsgTaskCountdown', msg);
        if (!this._inGameUI && !this.isRequestReConnect) {
            switch (this._gameStatus) {
                // 不在游戏中 判断情况
                case GameStatus.RECONNECT:
                    console.log('处理断线重连逻辑');
                    this.isRequestReConnect = true;
                    this.reConnectGame();
                    break;
                case GameStatus.RESTART:
                    console.log('处理游戏重启逻辑');
                    // 不在游戏中 则请求队伍信息并加入
                    this.isRequestReConnect = true;
                    this.reConnectGame();
                    // 这里可以执行重启后的初始化
                    break;
                case GameStatus.NORMAL:
                default:
                    console.log('正常游戏逻辑');
                    break;
            }
            // 重置状态
            this._gameStatus = GameStatus.NORMAL;
            return;
        }
        
        if (msg.currentSwipes == msg.targetSwipes && msg.currentSwipes > 0 && msg.status === 'active') {
            //console.log('通知显示成完成 并且不能滑动');
            let str = `任务${msg.taskIndex}:${msg.currentSwipes}/${msg.targetSwipes}    剩余时间:${msg.remainingTime - 1 >= 0 ? msg.remainingTime - 1 : 0}`;
            EventManager.Instance.emit(EVENT_ENUM.RenderTaskLabel, true, str);
            EventManager.Instance.emit(EVENT_ENUM.OperatorRenderDirecLabel, false, true);
            this._taskType = TaskType.rest;
            return;
        } else if (msg.status === 'rest') {
            let str = `中场休息中 剩余时间:${msg.remainingTime - 1 >= 0 ? msg.remainingTime - 1 : 0}`;
            this._taskType = TaskType.rest;
            EventManager.Instance.emit(EVENT_ENUM.RenderTaskLabel, true, str);
            return;
        } else if (msg.status === 'active') {
            this._taskType = TaskType.active;
            let str = `任务${msg.taskIndex}:${msg.currentSwipes}/${msg.targetSwipes}    剩余时间:${msg.remainingTime - 1 >= 0 ? msg.remainingTime - 1 : 0}`;
            EventManager.Instance.emit(EVENT_ENUM.RenderTaskLabel, true, str);

        } else if (msg.status === 'eliminated') {
            this._taskType = TaskType.failed;
            let str = `任务${msg.taskIndex}:${msg.currentSwipes}/${msg.targetSwipes}    剩余时间:${msg.remainingTime - 1 >= 0 ? msg.remainingTime - 1 : 0}`;
            EventManager.Instance.emit(EVENT_ENUM.RenderTaskLabel, true, str);
        }

    }

    public dealTaskEnd(msg?: MsgTaskEnd) {

        if (msg.reason == 'completed') {
            this._taskType = TaskType.rest;
            return;
        }
        this._taskType = TaskType.failed;
        EventManager.Instance.emit(EVENT_ENUM.RenderGameCountDown, false);
    }

    public dealGameEnd(msg: MsgGameEnd) {
        this._gameResult = msg;
        // 判断当前是否在 pkGame 中，如果不在则不通知 ShowPkResult
        if (!TeamInfoManager.Instance.TeamInfo) {
            console.log('当前不在 pkGame 中，不显示游戏结果dealGameEnd');
            //通知刷新usercard和底部
            EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo, true);
            EventManager.Instance.emit(EVENT_ENUM.UpdateIsDie);
            return;
        }
        GameDataManager.Instance.setInGameUI(false);
        EventManager.Instance.emit(EVENT_ENUM.ShowPkResult);
    }

    async reConnectGame() {
        console.warn('reConnectGame...');
        const userData = await TsRpc.Instance.Client.callApi("user/GetInfo", {
            __ssoToken: UserDataManager.Instance.SsoToken
        });
        if (!userData.isSucc) {
            ToastManager.showToast('重连获取用户信息失败' + userData.err);
            this.isRequestReConnect = false;
            return;
        }
        const teamInfo = await TsRpc.Instance.Client.callApi("team/GetTeamInfo", { __ssoToken: UserDataManager.Instance.SsoToken });
        TeamInfoManager.Instance.TeamInfo = teamInfo.res.info
        const pk_info = await TsRpc.Instance.Client.callApi("room/GetRoomInfo", { __ssoToken: UserDataManager.Instance.SsoToken });
        if (!pk_info.isSucc) {
            this._IsCanStartgame = false;
            await JoeFunc.delay(5000);
            this.isRequestReConnect = false;
            GameDataManager.Instance.setGameStatus(GameStatus.RECONNECT);
            return;
        }
        GameDataManager.Instance.restoreGame(pk_info.res.roomIndex, pk_info.res.info, userData.res.gameItems, pk_info.res.currentTask?.status, pk_info.res?.currentTask);
        this.isRequestReConnect = false;
    }



}

