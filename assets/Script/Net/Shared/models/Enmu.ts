/**游戏状态*/
export enum RoomStatus {
    /**准备中*/
    Ready = 0,
    /**游戏中*/
    Playing = 1,
    /**结算中*/
    Settle = 2,
    /**结束*/
    End = 3
}

/**队伍状态*/
export enum TeamStatus {
    /**组队中*/
    Ready = 0,
    /**匹配中*/
    Matching = 1,
    /**游戏中*/
    Playing = 2,
}
