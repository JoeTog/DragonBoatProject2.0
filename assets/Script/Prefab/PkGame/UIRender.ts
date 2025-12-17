import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { TeamInfoManager } from '../../Data/TeamInfoManager';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM } from '../../Data/Enum';
import { BigNumUtils, TimeDateUtils } from '../../Base/Utils';
import UserDataManager from '../../Data/UserDataManager';
const { ccclass, property } = _decorator;
//根据GameTime 接受后台消息 更新我、队伍的进度条、敌人武力值
@ccclass('UIRender')
export class UIRender extends Component {

    private countDownNode: Node = null;
    private teamPowerLabel: Label = null;
    private teamPowerProgress: ProgressBar = null;
    private enemyTeamPowerLabel: Label = null;
    private myPowerProgress: ProgressBar = null;
    private timeLabel: Label = null;
    private dieNode: Node = null;
    private myPowerLabel: Label = null;


    protected onLoad(): void {
        
        this.countDownNode = this.node.getChildByName('countdown');

        this.dieNode = this.node.getChildByName('die');
        const infoNode = this.node.getChildByName('info');
        this.teamPowerLabel = infoNode.getChildByName('team_power').getComponent(Label);
        this.teamPowerProgress = infoNode.getChildByName('progress').getComponent(ProgressBar);
        this.enemyTeamPowerLabel = infoNode.getChildByName('hint').getChildByName('enemy_power').getComponent(Label);
        this.myPowerProgress = infoNode.getChildByName('myPower').getChildByName('progressBar').getComponent(ProgressBar);
        this.timeLabel = infoNode.getChildByName('time').getChildByName('label').getComponent(Label);

        this.myPowerLabel = infoNode.getChildByName('myPower').getChildByName('icon').getChildByName('label').getComponent(Label);

        const teamNameLabel = infoNode.getChildByName('team_name').getComponent(Label);
        teamNameLabel.string = TeamInfoManager.Instance.TeamInfo.name;
        EventManager.Instance.on(EVENT_ENUM.UpdateGameInfoByNetGameTime, this.doRender, this);
        EventManager.Instance.on(EVENT_ENUM.RenderGameCountDown, this.renderGameCountDown, this);
        EventManager.Instance.on(EVENT_ENUM.RoomDie, this.dieRender, this);


    }

    protected onDestroy(): void {
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

    doRender(powerMax:number,powerCur:number,enemyPower:number,myPowerCur:number,time:number) {
        
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
        this.myPowerProgress.progress = isNaN(myProgress)?0:myProgress;
        // console.log('myPowerProgress = ',this.myPowerProgress.progress);
        //更新时间
        let match_time = TimeDateUtils.formatTimeInterval(time,true,false);
        this.timeLabel.string = match_time;
        
        this.myPowerLabel.string = BigNumUtils.getNumberStringWan(Math.round(myPowerCur));;

    }


    



}


