import { IRoom } from "../../models/Interfaces";
import { BaseRequest, BaseResponse, BaseConf } from "../base";

/**【08-19】获取房间信息 */
export interface ReqGetRoomInfo extends BaseRequest {

}

export interface ResGetRoomInfo extends BaseResponse {
    /**房间信息 */
    room?:IRoom;

    roomIndex:number;
    info:{
        name:string,
        avatar:string,
        count:number
    }[]

    //  时间同步字段：解决锁屏、网络波动导致的时间不同步问题
    /**服务器当前时间戳（毫秒）*/
    serverTimestamp?: number;
    /**游戏开始的服务器时间戳（毫秒）*/
    gameStartTimestamp?: number;
    /**当前阶段开始的服务器时间戳（毫秒）*/
    currentPhaseStartTimestamp?: number;

    //  任务状态信息：防止客户端在游戏结束后尝试获取任务信息
    /**当前任务状态 */
    currentTask?: {
        taskIndex: number;
        status: string;
        duration: number;
        targetSwipes: number;
        currentSwipes: number;
        remainingTime: number;
    } | null;
}

export const conf: BaseConf = {
    needLogin: false,
}
