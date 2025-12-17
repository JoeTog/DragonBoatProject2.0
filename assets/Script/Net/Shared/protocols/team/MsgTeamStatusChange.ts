import { TeamStatus } from "../../models/Enmu";

/**队伍状态改变消息*/
export interface MsgTeamStatusChange {
    /**队伍ID*/
    teamId: number;
    /**队伍状态*/
    status: TeamStatus;
}
