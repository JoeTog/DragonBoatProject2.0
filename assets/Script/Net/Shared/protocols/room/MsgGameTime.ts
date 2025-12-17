import { RoomStatus } from "../../models/Enmu";

/**【08-13】游戏时间消息，进入游戏后每秒发送一次 */
export interface MsgGameTime {
    /**游戏状态*/
    status: RoomStatus;
    /**游戏时间 准备中:10s 游戏中:180s 结算中:5s 结束:0s*/
    time: number;
    /**【09-10】当前玩家战斗力*/
    playerPowerCur?:number;
    /**【08-29】战斗力信息 游戏中和结算中时才有*/
    info?:{
        /**队伍最大战斗力*/
        powerMax:number;
        /**队伍当前战斗力*/
        powerCur:number;
    }[]
}
