//TsRpc配置

import GameConfig from "../Config/GameConfig";

// 自定义 logger，修改 [ApiReq] 为 "前端请求"，[ApiRes] 为 "返回前端请求"
const customLogger = {
    log: (...args: any[]) => {
        const modifiedArgs = args.map(arg => {
            if (typeof arg === 'string') {
                let result = arg;
                if (result.includes('[ApiReq]')) {
                    result = result.replace('[ApiReq]', '前端请求');
                }
                if (result.includes('[ApiRes]')) {
                    result = result.replace('[ApiRes]', '返回前端请求');
                }
                if (result.includes('[RecvMsg]')) {
                    result = result.replace('[RecvMsg]', '服务器推送');
                }
                return result;
            }
            return arg;
        });
        console.log(...modifiedArgs);
    },
    warn: (...args: any[]) => {
        const modifiedArgs = args.map(arg => {
            if (typeof arg === 'string') {
                let result = arg;
                if (result.includes('[ApiReq]')) {
                    result = result.replace('[ApiReq]', '前端请求');
                }
                if (result.includes('[ApiRes]')) {
                    result = result.replace('[ApiRes]', '返回前端请求');
                }
                if (result.includes('[RecvMsg]')) {
                    result = result.replace('[RecvMsg]', '服务器推送');
                }
                return result;
            }
            return arg;
        });
        console.warn(...modifiedArgs);
    },
    error: (...args: any[]) => {
        const modifiedArgs = args.map(arg => {
            if (typeof arg === 'string') {
                let result = arg;
                if (result.includes('[ApiReq]')) {
                    result = result.replace('[ApiReq]', '前端请求');
                }
                if (result.includes('[ApiRes]')) {
                    result = result.replace('[ApiRes]', '返回前端请求');
                }
                if (result.includes('[RecvMsg]')) {
                    result = result.replace('[RecvMsg]', '服务器推送');
                }
                return result;
            }
            return arg;
        });
        console.error(...modifiedArgs);
    },
    info: console.info,
    debug: console.debug
};

export const WsConfig = {
    // server:"wss://127.0.0.1:3005",
    // server:"wss://74.120.174.141:3005",
    server: GameConfig.ws_url,
    binary: false,
    json: true,
    // binary: true,
    // json:false,
    compress: true,
    heartbeat: {
        // interval:5000,
        interval: 5000,
        timeout: 20000
    },
    logger: customLogger
}




export const IMG_URL_EXTRA_PARAM = '?imageMogr2/thumbnail/100x100/size-limit/100k!'


export const BAG_CONFIG = {

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
    30: ["能量炮", "icon_30", '对方船队全员无法操作5s（消耗品）'],
    31: ["高级能量炮", "icon_31", '对方船队全员无法操作5s（非消耗品）'],
    32: ["眩晕炮", "icon_32", '对方船队个人无法操作5s（消耗品）'],
    33: ["高级眩晕炮", "icon_33", '对方船队个人无法操作5s（非消耗品）'],
    34: ["强杀炮", "icon_34", '对方船队个人直接淘汰（消耗品）'],
    35: ["高级强杀炮", "icon_35", '对方船队个人直接淘汰（非消耗品）'],
    36: ["闪电炮", "icon_36", '对方船队全员武力值减少10%（消耗品）'],
    37: ["高级闪电炮", "icon_37", '对方船队全员武力值减少10%（非消耗品）'],
    38: ["能量饮料", "icon_38", '个人受到眩晕攻击时可接触1次（消耗品）'],
    39: ["船", "icon_39", '装饰道具'],
    40: ["龙舟", "icon_40", '可合成战舰'],
    41: ["战舰", "icon_41", '全员受到眩晕炮攻击时，可免除1次'],
    42: ["高级战舰", "icon_42", '全员受到眩晕炮攻击时，可免除2次'],
    43: ["超级战舰", "icon_43", '全员受到眩晕炮/闪电炮攻击时，可免除2次'],
    44: ["皮肤", "icon_44", '个人受到闪电炮攻击时，可免除1次'],
    45: ["闪亮皮肤", "icon_45", '个人受到闪电炮攻击时，可免除2次'],
    46: ["服装", "icon_46", '船队受到高级闪电炮攻击时，可免除1次'],
    47: ["闪亮服装", "icon_47", '船队受到高级闪电炮攻击时，可免除2次'],
    48: ["复活饮料", "icon_48", '受到强杀炮攻击时，免除被淘汰1次（消耗品）'],
    49: ["v0药水", "icon_49", '每次划桨,划动次数2倍'],
    50: ["v1药水", "icon_50", '每次划桨,划动次数2倍'],
    51: ["v2药水", "icon_51", '每次划桨,划动次数2倍'],
    52: ["v3药水", "icon_52", '每次划桨,划动次数2倍'],
    53: ["v4药水", "icon_53", '每次划桨,划动次数2倍'],
    54: ["v5药水", "icon_54", '每次划桨,划动次数2倍']
}







