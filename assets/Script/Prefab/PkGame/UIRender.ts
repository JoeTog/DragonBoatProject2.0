import { _decorator, Component, find, instantiate, Label, Node, Prefab, ProgressBar } from 'cc';
import { TeamInfoManager } from '../../Data/TeamInfoManager';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, GameStatus, MUSIC_PATH_ENUM } from '../../Data/Enum';
import { BigNumUtils, TimeDateUtils } from '../../Base/Utils';
import UserDataManager from '../../Data/UserDataManager';
import { GameDataManager } from '../../Data/GameDatamanager';
import { TsRpc } from '../../Net/TsRpc';
import { AudioManager } from '../../Base/AudioManager';
import { PopViewManager } from '../UI/Notice/PopViewManager';
import { AudioBGMManager } from '../../Base/AudioBGMManager';
const { ccclass, property } = _decorator;
//根据GameTime 接受后台消息 更新我、队伍的进度条、敌人武力值
@ccclass('UIRender')
export class UIRender extends Component {

    @property(Prefab)
    popViewPrefab: Prefab = null;

    private countDownNode: Node = null;
    private teamPowerLabel: Label = null;
    private teamPowerProgress: ProgressBar = null;
    private myPowerProgress: ProgressBar = null;
    private timeLabel: Label = null;
    private dieNode: Node = null;
    private myPowerLabel: Label = null;

    private enemyTeamPowerLabel: Label = null;
    private enemyTeamPowerProgress: ProgressBar = null;



    private _getGameTime: boolean = false;
    private _isRequestingConfig: boolean = false;


    protected onLoad(): void {
        
        this.countDownNode = this.node.getChildByName('countdown');
        this.dieNode = this.node.getChildByName('die');

        const infoNode = this.node.getChildByName('head').getChildByName('Info');
        console.log('子节点列表:', this.node.children)
        this.timeLabel = infoNode.getChildByName('time').getComponent(Label);
        const infoMy = infoNode.getChildByName('myTeam');
        this.teamPowerLabel = infoMy.getChildByName('myTeamPower').getComponent(Label);
        this.teamPowerProgress = infoMy.getChildByName('ProgressBar').getComponent(ProgressBar);
        const teamNameLabel = infoMy.getChildByName('teamName').getComponent(Label);
        this.myPowerLabel = infoMy.getChildByName('myPower').getComponent(Label);
        // this.myPowerProgress = infoMy.getChildByName('ProgressBar').getComponent(ProgressBar);
        //新增 我的武力值


        const infoEnemy = infoNode.getChildByName('emenyTeam');
        this.enemyTeamPowerLabel = infoEnemy.getChildByName('myTeamPower').getComponent(Label);
        //新增
        const enemyTeamNameLabel = infoEnemy.getChildByName('teamName').getComponent(Label);
        this.enemyTeamPowerProgress = infoEnemy.getChildByName('ProgressBar').getComponent(ProgressBar);
        
        const VsTeamInfoArr = GameDataManager.Instance.VsTeamInfo;
        teamNameLabel.string = TeamInfoManager.Instance.TeamInfo.name;
        if (VsTeamInfoArr.length == 2) {
            enemyTeamNameLabel.string = VsTeamInfoArr[GameDataManager.Instance.EnemyTeamIndex].name;
        }
        EventManager.Instance.on(EVENT_ENUM.UpdateGameInfoByNetGameTime, this.doRender, this);
        EventManager.Instance.on(EVENT_ENUM.RenderGameCountDown, this.renderGameCountDown, this);
        EventManager.Instance.on(EVENT_ENUM.RoomDie, this.dieRender, this);

        this.schedule(async () => {
            console.warn('schedule 定时器 GameStatus = ', GameDataManager.Instance.GameStatus);
            if (this._getGameTime) {
                this._getGameTime = false;
            } else if (GameDataManager.Instance.GameStatus == GameStatus.NORMAL) {
                //当这里再请求一次接口，如果没网则设置为
                if (!this._isRequestingConfig) {
                    console.warn('游戏界面5秒没收到gameTime NORMAL 需要弹出返回 开始验证');
                    this._isRequestingConfig = true;
                    const ret = await TsRpc.Instance.Client.callApi('GetGameConfig', {});
                    if (ret && ret.isSucc && !this._getGameTime) {
                        console.warn('show popview');
                        if (!find('Canvas/PkGame')?.getChildByName('PkResult') && !find('Canvas/PkGame')?.getChildByName('PkResultSuccess') || !find('Canvas/PkGame')?.getChildByName('UI')?.getChildByName('PopView')) {
                            const popV = instantiate(this.popViewPrefab);
                            const manager = popV.getComponent(PopViewManager);
                            manager.messageText = '游戏已结束，是否返回?';
                            manager._confirmText = '取消';
                            manager.confirmBlock = async () => {
                                popV.destroy();
                            };
                            manager.cancelBlock = async () => {
                                popV.destroy();
                                GameDataManager.Instance._reset();
                                EventManager.Instance.emit(EVENT_ENUM.HidePkGame);
                                //播放背景音乐
                                AudioBGMManager.Instance.play(MUSIC_PATH_ENUM.bgFight).catch(err => {
                                    console.warn('播放背景音乐失败:', err);
                                });
                            };
                            this.node.addChild(popV);
                        }
                    }
                } else {
                    console.warn('游戏界面5秒没收到gameTime NORMAL 正在验证接口是否通');
                    this._isRequestingConfig = false;
                }

            } else {
                console.warn('游戏界面5秒没收到gameTime GameStatus = ', GameDataManager.Instance.GameStatus);

            }
        }, 5);

    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
        EventManager.Instance.off(EVENT_ENUM.UpdateGameInfoByNetGameTime, this.doRender);
        EventManager.Instance.off(EVENT_ENUM.RenderGameCountDown, this.renderGameCountDown);
        EventManager.Instance.off(EVENT_ENUM.RoomDie, this.dieRender);
    }



    dieRender() {
        // this.dieNode = null;
        this.dieNode.active = true;
    }

    //收到倒计时通知
    renderGameCountDown(time: number) {
        if (time == 0) { 
            //当倒计时为0 则隐藏
            this.countDownNode.active = false;
            console.log('倒计时隐藏 = 0');
        } else {
            //倒计时赋值
            this.countDownNode.active = true;
            this.countDownNode.getChildByName('label').getComponent(Label).string = `${time}`;
            console.log('倒计时赋值 = ',time);
        }
        
    }

    doRender(powerMax:number,powerCur:number,enemyPowerMax:number,enemyPower:number,myPowerCur:number,time:number) {
        
        let str_cur = BigNumUtils.getNumberStringWan(powerCur);
        let str_max = BigNumUtils.getNumberStringWan(powerMax);
        //设置文字
        this.teamPowerLabel.string = `${str_cur} / ${str_max}`;
        //更新进度条
        let progress = powerCur / powerMax;
        this.teamPowerProgress.progress = isNaN(progress)?0:progress;
        // console.log('teamPowerProgress = ',this.teamPowerProgress.progress);
        //更新对方战力
        this.enemyTeamPowerLabel.string = BigNumUtils.getNumberStringWan(enemyPower);
        //更新自己的进度条
        let myProgress = myPowerCur / UserDataManager.Instance.UserInfo.power;
        // this.myPowerProgress.progress = isNaN(myProgress)?0:myProgress;
        // console.log('myPowerProgress = ',this.myPowerProgress.progress);
        //更新时间
        let match_time = TimeDateUtils.formatTimeInterval(time,true,false);
        this.timeLabel.string = match_time;

        //新增
        let progressEnemy = enemyPower / enemyPowerMax;
        this.enemyTeamPowerProgress.progress = isNaN(progressEnemy)?0:progressEnemy;
        
        this.myPowerLabel.string = BigNumUtils.getNumberStringWan(Math.round(myPowerCur));

    }


    



}


