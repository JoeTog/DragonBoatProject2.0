import Singleton from "../Base/Singleton";
import { GameDataManager } from "../Data/GameDatamanager";
import { TeamInfoManager } from "../Data/TeamInfoManager";
import { ServiceType } from "./Shared/protocols/serviceProto";
import { WsClient } from 'tsrpc-browser';







type MessageHandle = (data:any) => void;
export default class Listenmsgmanager extends Singleton {
    
    static get Instance() {
        return super.GetInstance<Listenmsgmanager>()
    }
    
    private _isInitialized = false;

    private lowFreqMessage :Map<keyof ServiceType['msg'],MessageHandle> = new Map([
        //我的队伍相关
        ['team/TeamJoin',(d) =>{//可能是队伍中加人，也可能是某人复活 先判断复活
            TeamInfoManager.Instance.addMember(d)}]
        ,['team/TeamLeave',(d) =>{
            TeamInfoManager.Instance.delMember(d)}]
        ,['team/TeamClose',(d) =>{
            TeamInfoManager.Instance.closeteam(true)}]
        // //队伍状态改变 1：我开启了匹配，2：队长开启了匹配，3 hall界面收到
        //并不是上面这样，队长开启、我开启逗返回的1，hall收到别人匹配是TeamListRemove
        ,["team/TeamStatusChange", (d) => { TeamInfoManager.Instance.teamStatusChange(d) }]
        ,['team/MatchSuccess',(d) =>{GameDataManager.Instance.dealMatchSuccess(d)}] //获取房间index，敌人就是另一个
        ,['team/MatchFail', (d) => { GameDataManager.Instance.dealMatchFail(d) }]
        ,['team/TeamPowerUpdate', (d) => { GameDataManager.Instance.teamPowerUpdate(d) }]
        //队伍大厅
        ,['team/TeamListAdd',(d) =>{
            TeamInfoManager.Instance.oneTeamAdd(d.team)}]
        ,['team/TeamListRemove',(d) =>{
            TeamInfoManager.Instance.oneTeamDisabled(d.id)}]
        //游戏中
        ,['room/GameTime', (d) => { GameDataManager.Instance.dealGameTime(d) }]
        ,['room/Die', () => { GameDataManager.Instance.dealRoomDie() }]
        ,['room/TaskStart', (d) => { GameDataManager.Instance.dealTaskStart(d) }]
        ,['room/TaskComplete', () => { GameDataManager.Instance.dealTaskComplete() }]
        ,['room/TaskCountdown', (d) => { GameDataManager.Instance.dealTaskCountDown(d) }]
        ,['room/TaskEnd', (d) => { GameDataManager.Instance.dealTaskEnd(d) }]
        ,["room/GameEnd", (d) => { GameDataManager.Instance.dealGameEnd(d) }]





        
    ])



    public init(WsClient:WsClient<ServiceType>):void{
        if(this._isInitialized){
            console.warn('NetworkEventCenter 已初始化，跳过重复初始化');
            return;
        }
        console.log('NetworkEventCenter 开始初始化');
        
        this.registerAllMessage(WsClient);
        this.startThrottleLoop();
        this._isInitialized = true;
        
    }

    registerAllMessage(wsClient:WsClient<ServiceType>){
        this.registerLowFreMessgaes(wsClient);
    }

    registerLowFreMessgaes(wsClient:WsClient<ServiceType>){
        for (let [msgname,func] of this.lowFreqMessage) {
            wsClient.listenMsg(msgname,(msg:any)=>{
                // 打印所有服务器推送消息
                // console.log('【服务器推送消息】', {
                //     msgName: msgname,
                //     data: msg
                // });
                func(msg);
            })
        }
    }
    
startThrottleLoop(){

}




}

