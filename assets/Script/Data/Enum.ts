import { IShopItem } from "../Net/Shared/models/Interfaces";

export enum EVENT_ENUM{
    
    WssInited = "WssInited",//ws初始化完成

    
    UpdateUserInfo = "UpdateUserInfo",//通知更新用户信息 首页
    RequestUserInfo = "RequestUserInfo",//通知 请求更新用户信息 首页
    // UpdateUserInfoMyTeam = "UpdateUserInfoMyTeam",//通知更新用户信息 我的队伍界面
    RenderHomePop = "RenderHomePop",//主页 通知跳转
    UpdateCaptain = "UpdateCaptain",//更新是否为队长
    UpdateIsDie = "UpdateIsDie",//更新是否死亡
    TeamPowerUpdate = "TeamPowerUpdate",//更新是否死亡
    

    //我的主页
    ShowHome = "ShowHome",
    HideHome = "HideHome",
    ToCreateTeam = "ToCreateTeam", //这里是建队伍逻辑   //在homedown中实现并监听创建 ，队伍列表大厅hall、homedown中 通知建队伍 隐藏hall显示team界面
    HideHall =  "HideHall",//隐藏队伍大厅 销毁
    //这里是展示队伍信息逻辑 没有网络请求 1加入队伍拿到信息后 2创建队伍拿到信息后
//通知homemanager中设置active 从而在teaminfo中拿数据走teamcreate.ts
    ShowTeam = "ShowTeam",
    HideTeam = "HideTeam", //销毁我的队伍界面
    TeamStatusChange = "TeamStatusChange", //销毁我的队伍界面
    systemMessageUpdate = "systemMessageUpdate", //销毁我的队伍界面

    

//我的队伍
    AddTeam = "AddTeam", //hall界面有队伍新创建
    DelTeam = "DelTeam", //hall界面有队伍新销毁

    AddTeamMember = "addTeamMember",//新成员添加
    DelTeammember = "DelTeammember",//成员删除通知
    AddTeamToList = "addTeamToList",//添加队伍到队伍列表
    DelTeamFromList = "DelTeamFromList",//删除队伍到队伍列表
    RefreshTeammember = "RefreshTeammember",//成员删除通知

//游戏
    ShowPKGame = "ShowPKGame",
    HidePkGame = "HidePkGame",
    ShowPkResult = "ShowPkResult",
    ShowMatching = "ShowMatching",
    HideMatching = "HideMatching",
    ShowVs = "ShowVs",
    StartGame = "StartGame",
    StopGame = "StopGame",
    RenderGameCountDown = "RenderGameCountDown",
    UpdateGameInfoByNetGameTime = "UpdateGameInfoByNetGameTime",
    RoomDie = "RoomDie",
    RenderTaskLabel = "RenderTaskLabel", //OperatorRender中显示任务label
    OperatorRenderDirecLabel = "OperatorRenderDirecLabel", //OperatorRender中显示 任务提示 向哪里滑动




}


export enum MUSIC_PATH_ENUM{
    BtnClick = "Music/ui_click",
    bgFight = "Music/bgFight",//start中播放背景音乐
    eft_suihua = "Music/eft_suihua",//
    game_bg = "Music/game_bg",

}


export enum PREFAB_PATH_ENUM {
    //pop
    BagPrefab = "Prefab/bag/bag",
    ShopPrefab = "Prefab/shop/shop",
    DjExchangePrefab = "Prefab/DjExchange",
    HallPrefab = "Prefab/Hall/Hall",
    UIVsPrefab = "Prefab/UI/Vs",
    UIUserInfo = "Prefab/UerInfo/record/UIUserInfo",
    SingleGame = "Prefab/PkGame/Single/SingleGame",
    SystemMessage = "Prefab/UI/systemMessage/SystemMessage",
    SystemAnnouncement = "Prefab/UI/SystemAnnouncement/SystemAnnouncement",
    MyTask = "Prefab/Task/MyTask",
    PickUpReward = "Prefab/Task/pickupReward/PickUpReward"

    //
    

}



export enum NetType {
    //极好 满绿色
    excellent, 
    /** 满黄色 */
    good,
    /** 2黄色 */
    fair,
    /** 1黄 */
    poor
}

export enum TaskType {
    //休息中
    rest,
    /** 任务进行中 */
    active,
    /** 任务成功 */
    completed,
    /** 任务失败 */
    failed,
    /** 无效操作 */
    noned,
}

//popManager跳转类型
export enum popType {
    //无参数
    null,
    /** 个人比赛记录 */
    personalGameRecord,
    /** 武力值记录 */
    powerRecord
}

//公告显示内容
export enum showType {
    /** 公告 */
    Gonggao,
    /** 游戏介绍 */
    Introduction,
    /** 系统消息 */
    Message,
    /** 反馈 */
    feedback
}

//'buy_item' | 'team_fail' | 'elimination' | 'exchange_point';
//武力值记录类型
export enum powerRecordType {
    /** 解冻成功 (解冻成功额外获得) */ 
    Thaw = "unfreeze",
    /** 游戏失败 */
    Fail= "team_fail",
    /** 淘汰 */
    Eliminate= "elimination",
    /** 兑换 */
    ExChange= "exchange_point"
}

// `can_unfreeze` | 可解冻 | ✅ 是 |
// | `unfreezing` | 解冻中 | ❌ 否 |
// | `unfrozen` | 已解冻完成 | ❌ 否 |
// | `expired` | 已过期 | ❌ 否 |
// | `cancelled` | 已取消 | ❌ 否 |
//武力值 复活 类型 
export enum UnfreezeStatus {
    /** 可复活 */
    Can_unfreeze = "can_unfreeze",
    /** 复活中 */
    Unfreezing= "unfreezing",
    /** 复活完成 */
    Unfrozen= "unfrozen",
    /** 已过期 */
    Expired= "expired",
    
    /** cancelled */
    Cancelled= "cancelled",
    /** cancelled */
    can_revive= "can_revive",
    /** cancelled */
    revived= "revived"
}


/** 保存本地数据key */
export enum LocalStorageKey {
    PersonalConfig = '_PersonalConfig'//个人设置

}

/** 玩家设置 */
export interface IPlayerSetInfo {
    userId: number,
    musicVolume: number,
    effectsVolume:number
}

/** getOrUse pop展示类型 */
export enum GetOrUsePopType {
    //兑换
    exchange,
    //购买
    shopBuy,
    //合成
    bagSynthesisSuccess,
    bagSynthesisFail

}

export interface IShopItemExtend extends IShopItem{
    /**道具数量 */
    count: number;
}

//公告显示内容
export enum systemMessageType {
    /** 游戏队伍失败 */
    fail_penalty = "fail_penalty",
    /** 达到游戏次数阈值，难度提升提醒 */
    reach_min_games  = "reach_min_games "
}
