import { IPlayerSetInfo } from "../Data/Enum";
import { TaskMessageDto } from "../Net/Shared/protocols/user/PtlGetTaskMessages";
import Singleton from "./Singleton";
interface IItem {
    func: Function;
    ctx: unknown;
}
/***
 * 事件中心管理类（本质就是一张map，key是事件名称，value是对应事件的函数列表）
 */
export default class ConfigManager extends Singleton {
    static get Instance() {
        return super.GetInstance<ConfigManager>();
    }


    private _systemInfo: string[] = []; // 公告信息
    private _introduction: string[] = []; // 游戏说明信息
    private _messageArr: TaskMessageDto[] = []; // 游戏系统信息
    private _personalSetting: IPlayerSetInfo = null;




    public get personalSetting(): IPlayerSetInfo {
        return this._personalSetting;
    }
    public set personalSetting(value: IPlayerSetInfo) {
        this._personalSetting = value;
    }
    
    public get systemInfo(): string[] {
        return this._systemInfo;
    }
    public set systemInfo(value: string[]) {
        this._systemInfo = value;
    }

    public get introduction(): string[] {
        return this._introduction;
    }
    public set introduction(value: string[]) {
        this._introduction = value;
    }
    public get messageArr(): TaskMessageDto[] {
        return this._messageArr;
    }
    public set messageArr(value: TaskMessageDto[]) {
        this._messageArr = value;
    }






}