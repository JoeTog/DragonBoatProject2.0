import { Vec2 } from 'cc';

/** 命令队列 */
export default class Util {
    private static _instance: Util = null;
    public static get inst() {
        if (!this._instance) {
            this._instance = new Util();
        }
        return this._instance;
    }

    /**
     * 获取浏览器
     * @returns 
     */
    public getUrlParam(): {} {
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
    * 获取当前时间戳
    * @returns 
    */
    public getAtTimestamp(): number {
        return new Date().getTime();
    }
    /**
     * 随机一个范围 min ~ max 的整数
     * @param min 范围的最小值，或者一个2元素的数组
     * @param max 范围的最大值，或者为空
     * @example
     * GNum.randomInt(1, 10);
     * GNum.randomInt([1, 10]);
     * @returns 
     */
    public randomInt(min: number, max: number): number {
        if (Array.isArray(min) && typeof max == 'undefined') {
            max = min[1];
            min = min[0];
        }
        return Math.floor(Math.random() * (max - <number>min + 1)) + <number>min;
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
    public randomFloor(min: number, max: number): number {
        if (Array.isArray(min) && typeof max == 'undefined') {
            max = min[1];
            min = min[0];
        }
        let a = (Math.random() * (max - min) + min).toFixed(2);
        // let a = (Math.random() * (max - <number>min + 1) + <number>min).toFixed(2);
        // @ts-ignore
        return a * 1;
    }
    /**随机获取一个数组里面的值
     * @example
     * GNum.randomInArr([0,1,2]);
     */
    public randomInArr<T>(arr: T[]) {
        return arr[this.randomInt(0, arr.length - 1)];
    }
    /**
     * 随机获取一个数组里面的值,下标
     * @param isDelete 是否删除当前随机的值
     * @example
     * GNum.randomInArr([0,1,2]);
     */
    public randomInArrLength<T>(arr: T[], isDelete?: boolean): { len: number, content: T } {
        let _len = this.randomInt(0, arr.length - 1);
        let _arr = arr[_len];
        if (isDelete) {
            arr.splice(_len, 1);
        }
        return { len: _len, content: _arr };
    }
    /**
     * 判断某一个数字是否在一定的范围内
     * @param num   需要判断的数
     * @param range 判断是数的范围数组
     * @example
     * GNum.randomInArr(10,[1,9]); // false
     * @returns 
     */
    public isNumInRange(num: number, range: [number, number]): boolean {
        let [min, max] = range;
        return num >= min && num <= max;
    }
    /**
     * 获取2点之间的距离
     * @param pos1 
     * @param pos2 
     * @returns 
     */
    public getDisWith2Pos(pos1: Vec2, pos2: Vec2) {
        return pos1.subtract(pos2).length();
    }
    /**
     * 获取当前时间搓
     * @returns 
     */
    public getAtTime(): number {
        return new Date().getTime();
    }

    /**
     * 洗牌算法打乱数组
     * @param arr 
     */
    public shuffle<T>(arr: T[]): void {
        // 当前面元素排好后，最后一个元素位置已被确定，故不需要循环到最后一个
        for (var i = 0; i < arr.length - 1; i++) {
            var temp = arr[i];
            var rnd = i + Math.floor(Math.random() * (arr.length - i));
            arr[i] = arr[rnd];
            arr[rnd] = temp;
        }
    }


    /**
     * 字符串截取指定位数，默认8位
     * @param str 
     * @returns 
     */
    public truncateString(str, len = 8): string {
        // 判断字符串长度是否超过8位
        if (str.length > len) {
            return str.slice(0, len) + '...';  // 截取前8个字符并加上"..."
        }
        return str;  // 如果没有超过8位，直接返回原字符串
    }

}































