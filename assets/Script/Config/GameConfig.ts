export default class GameConfig {



    public static ws_urlTest = 'wss://testgame.jiangsuxingtu.com:3008';
    public static ws_urlLoad = 'wss://game.jiangsuxingtu.com:3005';

    /** websocket长连接地址 */
    // const ws_url = 'wss://47.103.128.46:8085';
    // const ws_url = 'wss://74.120.174.141:3005';
    // public static ws_url = 'wss://127.0.0.1:3005';

    // public static ws_url = 'ws://106.14.224.14:3008';

    //测试
    public static ws_url = this.ws_urlTest;

    //生产
    // public static ws_url = this.ws_urlLoad;




    /** 请求网络图片额外的参数 */
    public static img_url_extra_prarm = '?imageMogr2/thumbnail/100x100/size-limit/100k!'
    /** 道具 */
    private static propsName = {
        3: ["合成器", "icon_3", '可以将2个低阶物品合成高级物品'],
        4: ["旗鼓手", "icon_4", '可以创建队伍'],
        5: ["复活币", "icon_5", '淘汰后可以复活'],
        6: ["船", "icon_6", '升级船体外观'],
        7: ["百宝箱", "icon_7", '随机开出道具'],
        8: ["福袋", "icon_8", '打开后随机获得宝石'],
        10: ["助力器", "icon_10", '托管，划1次等于划2次'],
        11: ["黄金助力器", "icon_11", '托管，自动划桨'],
        12: ["钻石助力器", "icon_12", '托管，自动划桨，游戏结束奖励10-100宝石'],
        20: ["双桨", "icon_20", '每次划桨，任务次数1.1倍'],
        21: ["半碳桨", "icon_21", '每次划桨，任务次数1.5倍'],
        22: ["全碳桨", "icon_22", '每次划桨，任务次数2倍'],
        30: ["能量炮", "icon_22", '对方船队全员无法操作5s（消耗品）'],
        31: ["高级能量炮", "icon_22", '对方船队全员无法操作5s（非消耗品）'],
        32: ["眩晕炮", "icon_22", '对方船队个人无法操作5s（消耗品）'],
        33: ["高级眩晕炮", "icon_22", '对方船队个人无法操作5s（非消耗品）'],
        34: ["强杀炮", "icon_22", '对方船队个人直接淘汰（消耗品）'],
        35: ["高级强杀炮", "icon_22", '对方船队个人直接淘汰（非消耗品）'],
        36: ["闪电炮", "icon_22", '对方船队全员武力值减少10%（消耗品）'],
        37: ["高级闪电炮", "icon_22", '对方船队全员武力值减少10%（非消耗品）'],
        38: ["能量饮料", "icon_22", '个人受到眩晕攻击时可接触1次（消耗品）'],
        39: ["船", "icon_22", '装饰道具'],
        40: ["龙舟", "icon_22", '可合成战舰'],
        41: ["战舰", "icon_22", '全员受到眩晕炮攻击时，可免除1次'],
        42: ["高级战舰", "icon_22", '全员受到眩晕炮攻击时，可免除2次'],
        43: ["超级战舰", "icon_22", '全员受到眩晕炮/闪电炮攻击时，可免除2次'],
        44: ["皮肤", "icon_22", '个人受到闪电炮攻击时，可免除1次'],
        45: ["闪亮皮肤", "icon_22", '个人受到闪电炮攻击时，可免除2次'],
        46: ["服装", "icon_22", '船队受到高级闪电炮攻击时，可免除1次'],
        47: ["闪亮服装", "icon_22", '船队受到高级闪电炮攻击时，可免除2次'],
        48: ["复活饮料", "icon_22", '受到强杀炮攻击时，免除被淘汰1次（消耗品）'],
        49: ["v0药水", "icon_22", '每次划桨,划动次数2倍'],
        50: ["v1药水", "icon_22", '每次划桨,划动次数2倍'],
        51: ["v2药水", "icon_22", '每次划桨,划动次数2倍'],
        52: ["v3药水", "icon_22", '每次划桨,划动次数2倍'],
        53: ["v4药水", "icon_22", '每次划桨,划动次数2倍'],
        54: ["v5药水", "icon_22", '每次划桨,划动次数2倍']
    }
    /**
     * 根据商品id获取对于icon等
     * @param id 
     * @returns 
     */
    public static getPropsInfo(id: number): string[] {
        return this.propsName[id] || null;
    }

    /**
     * 获取复活币的id
     * @returns 
     */
    public static get getResurrectionCoin(): number {
        return 5;
    }
    /**
     * 获取旗鼓手的id
     * @returns 
     */
    public static get getFlagDrummer(): number {
        return 4;
    }



    public static gameId = '';
    //游戏版本 17 日 16:53 ，1.1.8
    public static readonly version = '1.0.0';


    public static _debugUserId = '';
    public static get debugUserId() {
        return this._debugUserId;
    }
}