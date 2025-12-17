/**
 * 队伍总武力值更新事件（仅队长可见）
 * 注意：字段名是 allPowerCur（保持兼容性），但实际值是 allPower（最大战斗力总和）
 * 因为组队界面时玩家还未进入游戏，powerCur 为 0，所以使用 power 的总和
 */
export interface MsgTeamPowerUpdate {
    /** 队伍总武力值（实际是 allPower，即所有队员的最大战斗力总和） */
    allPowerCur: number;
}

