import { IPlayer } from "../../models/Interfaces";

/**
 * 玩家加入队伍事件
 */
export interface MsgTeamJoin {
    player: IPlayer;
}
