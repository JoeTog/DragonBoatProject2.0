import { RoomStatus } from "./Enmu";

/**
 * 背包道具项（分组格式）
 */
export interface BagItem {
    /**道具ID */
    id: number;
    /**道具数量 */
    count: number;
}

/**
 * 完整背包道具项（包含商店信息）
 * 用于 API 返回给前端
 */
export interface EnrichedBagItem extends BagItem {
    /**道具名称 */
    name: string;
    /**价格 */
    price: number;
    /**描述 */
    desc: string;
    /**是否可以使用 0否 1是 */
    use: number;
    /**状态，最大数量，0不限制 */
    status: number;
}

export interface IUser {
    /**用户id 数据库id */
    uid: number;
    /**账号 */
    account: string;
    /**昵称 */
    nickname: string;
    /**头像 */
    avatar: string;
    /**等级 */
    level: number;
    /**积分 */
    game_coin?: number;
    /**推广会员数（会员值） */
    useful_member?: number;
    /**宝石 */
    draw_gem: number;
    /**用户类型 */
    user_type?: string;

}



export interface IPlayer {
    /** 【08-21】用户信息 */
    user: IUser;
    /**玩家id = 用户id 数据库id */
    uid: number;
    /**战斗力 */
    power: number;
    /**当前战斗力 */
    powerCur?: number;
    /**点券 */
    point?: number;
    /**总场次 */
    total_games: number;
    /**胜场次 */
    win_games: number;
    /**额外比例 */
    extra_ratio?: number;
    /**背包数据（按道具ID分组，包含数量） */
    bag_data?: EnrichedBagItem[];
    /**是否可以为队长 背包里是否包含id为4的道具 */
    captain?: boolean;
    /**今日游戏次数 */
    times?: number;
    /**今日游戏次数上限 */
    times_max?: number;
    /**【V0用户】终身游戏次数上限（固定100次） */
    totalTimesLimit?: number;
    /**【V0用户】已使用的终身游戏次数 */
    totalTimesUsed?: number;

    /**【08-18】难度 */
    difficulty: {
        /**变化频率 */
        frequency: number;
        /**增加量 */
        add: number;
        /**减少量 */
        reduce: number;
    }

    /**【08-18】是否淘汰 */
    isdie: number;
    /**【持久化】队伍ID，0表示不在队伍中 */
    teamId?: number;
    /**【10-11】是否为虚拟玩家（机器人） */
    virtual?: boolean;
    /**冻结的武力值数量 */
    freezePower?: number;
    /**玩家编码（首字母a-z，后5位数字，唯一）*/
    player_code?: string;
}

export interface ITeamBase {
    /**队伍id */
    id: number;
    /**队伍名称 */
    name: string;
    /**队伍人数 */
    playersCount?: number;
    /**队伍人数上限 */
    maxCount?: number;

    /**【08-21】队伍头像 */
    avatar: string;

    /**队伍状态 */
    status: number;

    /**【11-13】是否需要密码 */
    hasPassword?: boolean;
}

export interface ITeam extends ITeamBase {
    /**队伍密码（可选） */
    password?: string;
    /**在线人数 */
    onlineCount?: number;
    /**总人数 */
    totalCount?: number;
    /**队长UID */
    captainUid?: number;

    /**队伍成员 */
    players?: IPlayer[];
    /**队伍总战斗力 */
    allPowerCur?: number;
    roomId?: number //房间id
    roomIndex?: number //房间中的位置
}


export interface IRoom {
    /**房间id */
    id: number;
    /**队伍 */
    teams: ITeam[];
    /**房间状态 */
    status: RoomStatus;
    /**房间时间 */
    time: number;
}

export interface IShopItem {
    /**道具ID */
    id: number;
    /**道具名称 */
    name: string;
    /**价格 */
    price: number;
    /**数量 */
    // num: number;
    /**描述 */
    desc: string;
    /**【08-28】是否可以使用 0否 1是 */
    use: number;

    /**状态，最大数量，0不限制 */
    status: number;
}


/**
 * 任务详情接口
 */
export interface ITaskDetail {
    /** 匹配类型：'real'=真实玩家匹配，'bot'=人机匹配 */
    matchType?: 'real' | 'bot';
    taskIndex?: number;              // 任务序号
    duration?: number;               // 任务时长（秒）
    targetSwipes?: number;           // 目标滑动次数
    currentSwipes?: number;           // 实际滑动次数
    failReason?: string;             // 失败原因
    teamPower?: number[];            // 队伍战力 [队伍0, 队伍1]
    finalPower?: number;             // 玩家最终战力
}

export interface IGameRecord {
    match_id: number;
    captain_id: number;
    team_flag: number;
    team_res: number;
    create_time: Date;
    task_detail?: ITaskDetail | null;  // 任务详情（JSON格式）
    is_eliminated?: boolean; // 是否淘汰
    revival_status?: 'can_unfreeze' | 'unfreezing' | 'unfrozen' | 'expired' | 'cancelled' | 'can_revive' | 'revived'; // 复活状态
}

// 任务系统相关接口

/**
 * 难度档位接口
 */
export interface DifficultyTier {
    id: number;
    name: string;
    minGames: number;
    maxGames: number | null;
    duration: number;
    targetSwipes: number;  // 20秒任务的滑动次数
    targetSwipes30s: number;  // 30秒任务的滑动次数
    sortOrder: number;
}

/**
 * 任务配置接口
 */
export interface TaskConfig {
    duration: number;
    targetSwipes: number;
    isCustom: boolean;
}

/**
 * 任务状态接口
 * 🔥 关键修改：startTime 和 restEndTime 使用游戏时间（this.time），单位是秒，不是毫秒时间戳
 */
export interface TaskState {
    startTime: number;  // 游戏时间（this.time），单位：秒
    duration: number;   // 任务时长，单位：秒
    targetSwipes: number;
    currentSwipes: number;
    lastSwipeTime: number;  // 最后一次滑动时间（Date.now()），单位：毫秒，用于滑动频率统计
    status: 'active' | 'rest' | 'completed' | 'failed' | 'eliminated';  // eliminated: 已淘汰
    restEndTime?: number;  // 休息结束的游戏时间（this.time），单位：秒
    taskIndex?: number;
}
