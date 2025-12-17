/**
 * 【08-19】匹配成功消息
 */
export interface MsgMatchSuccess {
    /**
     * 房间ID
     */
    roomId:number;
    /**
     * 位置
     */
    roomIndex:number;
    /**【08-26】对抗信息 名字 头像 人数 */
    info:{
        name:string,
        avatar:string,
        count:number
    }[]
    /**
     * 【09-02】生效的道具
     * 生效的道具
     */
    gameItems:number[];
}
