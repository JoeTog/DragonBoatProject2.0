import { Asset, assetManager, ImageAsset, resources, SpriteFrame, Texture2D } from "cc";

export function truncateString(str: string): string {
    // 判断字符串长度是否超过8位
    if (str.length > 8) {
        return str.slice(0, 8) + '...';  // 截取前8个字符并加上"..."
    }
    return str;  // 如果没有超过8位，直接返回原字符串
}

export function truncateStringCutIndex(str: string, index: number): string {
    // 判断字符串长度是否超过8位
    if (index <= 0) {
        index = 8;
    }
    if (str.length > index-1) {
        return str.slice(0, index-1) + '...';  // 截取前8个字符并加上"..."
    }
    return str;  // 如果没有超过8位，直接返回原字符串
}


export class TimeDateUtils {


    public static formatTimestamp(ts: number) {
        const date = new Date(ts);
        const yyyy = date.getFullYear();
        const mm = this.pad2(date.getMonth() + 1);
        const dd = this.pad2(date.getDate());
        const hh = this.pad2(date.getHours());
        const mi = this.pad2(date.getMinutes());
        return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
    }

    public static formatTimestampForPowerRecord(ts: number) {
        const date = new Date(ts);
        const yyyy = date.getFullYear();
        const mm = this.pad2(date.getMonth() + 1);
        const dd = this.pad2(date.getDate());
        const hh = this.pad2(date.getHours());
        const mi = this.pad2(date.getMinutes());
        return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
    }

    public static pad2(n: number) {
        return (n < 10 ? '0' : '') + n;
    }

    public static foramtDate(dateObj: Date, format: string) {
        var date: any = {
            "M+": dateObj.getMonth() + 1,
            "d+": dateObj.getDate(),
            "h+": dateObj.getHours(),
            "m+": dateObj.getMinutes(),
            "s+": dateObj.getSeconds(),
            "q+": Math.floor((dateObj.getMonth() + 3) / 3),
            "S+": dateObj.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }

    public static  formatTimeInterval(seconds: number, alwaysShowMinutes: boolean = false, alwaysShowHours: boolean = false) {
    alwaysShowMinutes = alwaysShowHours || alwaysShowMinutes;
    let ret = "";
    let hour = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    let minute = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (alwaysShowHours || hour > 0) {
        if (hour < 10) {
            ret += "0";
        }
        ret += hour + ":";
    }
    if (alwaysShowMinutes || minute > 0 || hour > 0) {
        if (minute < 10) {
            ret += "0";
        }
        ret += minute + ":";
    }
    if (seconds < 10) {
        ret += "0";
    }
    ret += seconds;
    return ret;
}

}





/**
* 随机一个范围 min ~ max 的小数
* @param min 范围的最小值，或者一个2元素的数组
* @param max 范围的最大值，或者为空
* @example
* GNum.randomInt(1, 10);
* GNum.randomInt([1, 10]);
* @returns 
*/

export function randomFloor(min: number, max: number): number {
    if (Array.isArray(min) && typeof max == 'undefined') {
        max = min[1];
        min = min[0];
    }
    let a = (Math.random() * (max - min) + min).toFixed(2);
    // let a = (Math.random() * (max - <number>min + 1) + <number>min).toFixed(2);
    // @ts-ignore
    return a * 1;
}

export function loadAvatar(avatar: string) {
    return new Promise((resolve, reject) => {
        assetManager.loadRemote<ImageAsset>(
            avatar,
            { ext: ".jpg" },
            (err, imageAsset) => {
                if (err) {
                    console.log(avatar + "加载失败");
                    reject(err);
                    return;
                }
                if (imageAsset && imageAsset._objFlags !== 5) {
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = imageAsset;
                    spriteFrame.texture = texture;
                    resolve(spriteFrame);
                } else {
                    reject("报错");
                }
            }
        );
    });
}

export function getUrlParam(): {} {
    // window.location.href 获取地址
    let url = window.location.href;
    let p = url.split('?')[1];
    if (!p) {
        return {};
    }
    let keyValue = p.split('&');
    let obj = {};
    for (let i = 0; i < keyValue.length; i++) {
        let item = keyValue[i].split('=');
        let key = item[0];
        let value = item[1];
        obj[key] = value;
    }
    return obj;
}


/**
     * 加载resourse 资源
     *
     * @async
     * @param {string} path
     * @param {typeof Asset} type
     * @returns {Promise<Asset>}
     */
export async function resAssetLoad<T>(path: string, type: typeof Asset): Promise<T> {
    return new Promise((resolve, reject) => {
        resources.load(path, type, (err, asset) => {
            if (err) reject()
            resolve(asset as T)
        })
    })
}

/**
 * 验证字符串是否为合法的正整数
 * @param str 输入字符串
 * @param options 配置选项
 * @returns 验证结果
 */
export function isValidPositiveInteger(str: string, options: {
    allowZero?: boolean;      // 是否允许0，默认false
    min?: number;            // 最小值，默认1
    max?: number;           // 最大值，默认不限制
} = {}): boolean {
    const { allowZero = false, min = 1, max } = options;

    // 空值检查
    if (str === '' || str === null || str === undefined) {
        return false;
    }

    const trimmedStr = str.trim();
    if (trimmedStr === '') {
        return false;
    }

    // 正则表达式验证数字格式
    if (!/^-?\d+$/.test(trimmedStr)) {
        return false; // 包含非数字字符
    }

    // 转换为数字
    const num = parseInt(trimmedStr, 10);
    if (isNaN(num)) {
        return false;
    }

    // 检查是否为整数
    if (!Number.isInteger(num)) {
        return false;
    }

    // 根据allowZero设置最小值
    const actualMin = allowZero ? 0 : 1;

    // 范围检查
    if (num < actualMin) {
        return false;
    }

    if (max !== undefined && num > max) {
        return false;
    }

    // 不允许以0开头（除非就是0或单个0）
    if (trimmedStr.length > 1 && trimmedStr[0] === '0') {
        return false;
    }

    return true;
}


export const enum RountType {
    Round,
    Floor,
    Ceil,
}


declare type BigNumber = number | string;
export class BigNumUtils {
    public static BNPlus(...args: any[]) {
        var value = [0, 0];
        for (var _i = 0; _i < args.length; _i++) {
            var arg = args[_i];
            var base, zeroes;
            var num = +arg;
            if (num === 0 || (num && num !== Infinity)) {
                zeroes = arg < 10 ? 0 : Math.floor(Math.log10(+arg) + 1e-6);
                base = arg < 10 ? arg : arg / Math.pow(10, zeroes);
            }
            else {
                if (arg) {
                    arg = arg.split("e");
                    base = +arg[0] || 0;
                    zeroes = +arg[1] || 0;
                }
                else {
                    base = 0;
                    zeroes = 0;
                }
            }
            if (zeroes > value[1]) {
                value[0] /= Math.pow(10, zeroes - value[1]);
                value[0] += base;
                value[1] = zeroes;
            }
            else {
                value[0] += base / Math.pow(10, value[1] - zeroes);
            }
        }
        let sign = value[0] >= 0 ? 1 : -1;
        let rbase = Math.abs(value[0]);
        while (rbase < 1 && value[1] > 0) {
            rbase *= 10;
            value[1] -= 1;
        }
        while (rbase > 10) {
            rbase /= 10;
            value[1] += 1;
        }
        rbase *= sign;
        return `${rbase}e${value[1]}`;
    }
    public static BNMinus(...args: any[]): BigNumber {
        var value = [0, 0];
        for (var _i = 0; _i < args.length; _i++) {
            var arg = args[_i];
            var idx = _i;
            var base, zeroes;
            var num = +arg;
            if (num === 0 || (num && num !== Infinity)) {
                zeroes = arg < 10 ? 0 : Math.floor(Math.log10(+arg) + 1e-6);
                base = arg < 10 ? arg : arg / Math.pow(10, zeroes);
            }
            else {
                arg = arg.split("e");
                base = +arg[0];
                zeroes = +arg[1];
            }

            if (!idx) {
                value[0] = base;
                value[1] = zeroes;
            }
            else {
                if (value[1] < zeroes) {
                    value[0] = value[0] / Math.pow(10, zeroes - value[1]) - base;
                    value[1] = zeroes;
                }
                else {
                    value[0] -= base / Math.pow(10, value[1] - zeroes);
                }
            }
        }
        // if(value[0] <= 1e-10){
        //   return 0;
        // }
        let sign = value[0] >= 0 ? 1 : -1;
        let rbase = Math.abs(value[0]);
        while (rbase < 1 && value[1] > 0) {
            rbase *= 10;
            value[1] -= 1;
        }
        while (rbase > 10) {
            rbase /= 10;
            value[1] += 1;
        }
        rbase *= sign;
        return `${rbase}e${value[1]}`;
    }
    public static BNTimes(...args: any[]) {
        var value = [0, 0];
        args.forEach(function (arg, idx) {
            var base, zeroes;
            var num = +arg;
            if (num === 0 || (num && num !== Infinity)) {
                zeroes = arg < 10 ? 0 : Math.floor(Math.log10(+arg) + 1e-6);
                base = arg < 10 ? arg : arg / Math.pow(10, zeroes);
            }
            else {
                if (arg) {
                    arg = arg.split("e");
                    base = +arg[0] || 0;
                    zeroes = +arg[1] || 0;
                }
                else {
                    base = 1;
                    zeroes = 0;
                }
            }
            if (!idx) {
                value[0] = base;
                value[1] = zeroes;
            }
            else {
                value[0] *= base;
                value[1] += zeroes;
                if (value[0] > 1e300) {
                    value[0] /= 1e300;
                    value[1] += 300;
                }
            }
        });

        let sign = value[0] >= 0 ? 1 : -1;
        let base = Math.abs(value[0]);
        while (base < 1 && value[1] > 0) {
            base *= 10;
            value[1] -= 1;
        }
        while (base > 10) {
            base /= 10;
            value[1] += 1;
        }
        return `${base * sign}e${value[1]}`;
    }
    public static BNDevide(value0, value1) {
        if (+value1 === 0) {
            return 0;
        }
        var value = [0, 0];
        let sign: number = 1;
        [value0, value1].forEach(function (arg, idx) {
            var base, zeroes;
            let realNum = +arg;
            var num = Math.abs(realNum);
            if (num === 0 || (num && num !== Infinity)) {
                zeroes = num < 10 ? 0 : Math.floor(Math.log10(num) + 1e-6);
                base = num < 10 ? num : num / Math.pow(10, zeroes);
            }
            else {
                arg = arg.split("e");
                realNum = +arg[0];
                base = Math.abs(realNum);
                zeroes = +arg[1];
            }

            sign *= realNum >= 0 ? 1 : -1;
            if (idx === 0) {
                value[0] = base;
                value[1] = zeroes;
            }
            else {
                value[0] /= base;
                value[1] -= zeroes;
            }
        });
        let base = Math.abs(value[0]);
        while (base < 1 && value[1] > 0) {
            base *= 10;
            value[1] -= 1;
        }
        while (base > 10) {
            base /= 10;
            value[1] += 1;
        }
        base *= sign;
        if (value[1] < 100) {
            return base * Math.pow(10, value[1]);
        }
        return this.BNTimes(base, this.BNPow(10, value[1]));
    }
    public static BNCompare(value0, value1) {
        var bases = [0, 0];
        var zeroes = [0, 0];
        [value0, value1].forEach(function (arg, idx) {
            var num = +arg;
            if (num === 0 || (num && num !== Infinity)) {
                zeroes[idx] = arg < 10 ? 0 : Math.floor(Math.log10(+arg) + 1e-6);
                bases[idx] = arg < 10 ? arg : arg / Math.pow(10, zeroes[idx]);
            }
            else {
                arg = arg.split("e");
                bases[idx] = +arg[0];
                zeroes[idx] = +arg[1];
            }
        });
        return bases[0] * bases[1] < 0 ? (bases[0] > 0 ? 1 : -1) : zeroes[1] > zeroes[0] ? -1 : zeroes[1] < zeroes[0] ? 1 : bases[1] > bases[0] ? -1 : bases[1] < bases[0] ? 1 : 0;
    }
    public static BNPow(di, zhi) {
        if (!di) {
            return "0";
        }
        if (!zhi) {
            return "1";
        }
        var max = Math.floor(Math.log(1e300) / Math.log(di));
        max = Math.max(max, 1);
        var val: BigNumber = 1;
        if (max >= zhi) {
            val = Math.pow(di, zhi);
        } else {
            var times = Math.floor(zhi / max);
            let arr = [];
            var mid = Math.pow(di, max);
            for (var i = 0; i < times; i++) {
                arr.push(mid);
            }
            arr.push(Math.pow(di, zhi - max * times));
            val = this.BNTimes.apply(this, arr);
        }
        return val;
    }
    public static BNMax(value0, value1) {
        return this.BNCompare(value0, value1) > 0 ? value0 : value1;
    }
    public static BNMin(value0, value1) {
        return this.BNCompare(value0, value1) > 0 ? value1 : value0;
    }
    public static BNLog(value) {
        let num = +value;
        if (num === 0 || (num && num !== Infinity)) {
            const sign = num >= 0 ? 1 : -1;
            num = Math.abs(num);
            return sign * Math.log10(num);
        } else {
            return +value.split("e")[1];
        }
    }
    public static BNSqrt(value) {
        const num = +value;
        if (num === 0 || (num && num !== Infinity)) {
            return Math.sqrt(num);
        }
        var arr = value.split("e");
        let a = +arr[0];
        let b = +arr[1];
        return `${Math.sqrt(a)}e${b / 2}`;
    }

    public static BNSqrtEx(value, zhi: number) {
        const num = +value;
        if (num === 0 || (num && num !== Infinity)) {
            return Math.pow(num, 1 / zhi);
        }
        var arr = value.split("e");
        let a = +arr[0];
        let b = +arr[1];
        return `${Math.pow(a, 1 / zhi)}e${b / zhi}`;
    }

    public static BNFloor(value) {
        const num = +value;
        if (num === 0 || (num && num !== Infinity)) {
            return Math.floor(num);
        }
        return value;
    }

    public static BNCeil(value) {
        const num = +value;
        if (num === 0 || (num && num !== Infinity)) {
            return Math.ceil(num);
        }
        return value;
    }

    public static BNRound(value) {
        const num = +value;
        if (num === 0 || (num && num !== Infinity)) {
            return Math.round(num);
        }
        return value;
    }

    public static BN2Number(value) {
        const num = +value;
        if (num === 0 || (num && num !== Infinity)) {
            return num;
        } else {
            var arr = value.split("e");
            return +arr[0] * Math.pow(10, arr[1]);
        }
    }

    public static getOwnString(n: any) {
        return this.getNumberString(n, undefined, undefined, RountType.Floor);
    }

    public static getCostString(n: any) {
        return this.getNumberString(n, undefined, undefined, RountType.Ceil);
    }

    /**
     * 对数字的转换即千、百万、十亿等
     * @param n          输入的数字，可以是任何类型（比如字符串、数字等）
     * @param fixed      小数点后保留的位数，默认值是 0
     * @param bigFixed   对于大的数字，控制小数点后保留的位数
     * @param roundType  四舍五入的方式
     * @returns 
     */
    public static getNumberString(n: any, fixed: number = 0, bigFixed?: number, roundType = RountType.Round): string {
        let _base: number;
        let tailIdx;
        const num = +n;
        if (num === 0 || (num && num !== Infinity)) {
            if (n < 1000) {
                return this.roundNum(n, roundType, fixed);
            }
            let base: string = `${Math.round(n)}`;
            let digit: number = 0;
            if (~base.indexOf("e")) {
                //fix bug Math.log10(9.999999999999996e+38)=39
                let dishu: number = +base.split("e")[0];
                let zhishu: number = +base.split("e")[1];
                zhishu += Math.floor(Math.log10(dishu));
                digit = zhishu;
            } else {
                digit = Math.floor(Math.log10(n));
            }

            if (~base.indexOf("e")) {
                _base = +base.split("e")[0] * Math.pow(10, digit % 3);
            }
            else {
                _base = +base.slice(0, digit % 3 + 4) / 1000;
            }
            tailIdx = digit / 3 >> 0;
        }
        else {
            n = n.split("e");
            if (+n[1] < 3) {
                let v = n[0] * Math.pow(10, n[1]);
                return this.roundNum(v, roundType, fixed);
            }
            _base = n[0] * Math.pow(10, n[1] % 3);
            while (_base > 1000) {
                _base /= 1000;
                n[1] = +n[1] + 3;
            }
            tailIdx = n[1] / 3 >> 0;
        }
        var tail;
        if (tailIdx < 4) {
            tail = ["", "K", "M", "B"][tailIdx];
        }
        else {
            var first = (tailIdx - 4) / 26 >> 0;

            var grade = first / 26 >> 0;

            var second = (tailIdx - 4) % 26;
            var a = "abcdefghijklmnopqrstuvwxyz";
            var b = a.toUpperCase();

            tail = (grade < 2 ? a : b)[first % 26] + (grade % 2 ? b : a)[second];
        }

        if (bigFixed === undefined) {
            bigFixed = _base < 10 ? 2 : _base < 100 ? 1 : 0
        }
        const baseStr = this.roundNum(_base, roundType, bigFixed);
        return baseStr + tail;
    }

    private static roundNum(n: number, type: RountType, fixed: number) {
        let func;
        if (type === RountType.Round) {
            func = Math.round;
        } else if (type === RountType.Ceil) {
            func = Math.ceil;
        } else {
            func = Math.floor;
        }
        let val: number;
        if (fixed === 0) {
            val = func(n);
        } else {
            const b = Math.pow(10, fixed);
            val = func(b * n) / b;
        }
        return val.toFixed(fixed);
    }

    public static getFixNumber(num: number, fixed: number = 1) {
        const b = Math.pow(10, fixed)
        return Math.floor(num * b) / b;
    }

    public static getPercentString(num: BigNumber, fixed: number = 1) {
        if (typeof num === 'string') {
            return this.getNumberString(this.BNTimes(num, 100), fixed) + '%';
        } else {
            return this.getNumberString(num * 100, fixed) + '%';
        }
    }

    /**
     * 将数字转换为"万"的格式
     * @param n          输入的数字，可以是任何类型（比如字符串、数字等）
     * @param fixed      小数点后保留的位数，默认值是 1（小于1万时固定为2位）
     * @param roundType  四舍五入的方式，默认是 Round
     * @returns 返回格式化的字符串，例如：0.50万、1.0万、1.5万、10万、100万
     * @example
     * getNumberStringWan(5000) => "0.50万"
     * getNumberStringWan(10000) => "1.0万"
     * getNumberStringWan(15000) => "1.5万"
     * getNumberStringWan(100000) => "10.0万"
     * getNumberStringWan(9999) => "0.99万"
     */
    public static getNumberStringWan(n: any, fixed: number = 1, roundType = RountType.Round): string {
        const num = +n;

        // 处理无效数字
        if (isNaN(num) || num === 0) {
            return '0万';
        }
        if ( num < 10000) {
            return `${num}`;
        }

        // 处理科学计数法格式
        let actualNum: number;
        if (typeof n === 'string' && n.includes('e')) {
            actualNum = this.BN2Number(n);
        } else {
            actualNum = num;
        }

        // 转换为万
        const wanValue = actualNum / 10000;

        // 根据数值大小决定保留的小数位数
        let actualFixed: number;
        if (wanValue < 1) {
            // 小于1万，固定保留2位小数
            actualFixed = 2;
        } else if (wanValue >= 100) {
            // 大于等于100万，不显示小数
            actualFixed = Math.min(fixed, 1);
        } else if (wanValue >= 10) {
            // 10-100万之间，保留1位小数
            actualFixed = Math.min(fixed, 1);
        } else {
            // 1-10万之间，使用传入的 fixed
            actualFixed = fixed;
        }

        let formattedValue = this.roundNum(wanValue, roundType, actualFixed);
        if (formattedValue.includes('.')) {
            formattedValue = parseFloat(formattedValue).toString();
        }

        return formattedValue + '万';
    }





}



