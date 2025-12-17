import { game } from "cc";
import Singleton from "../Base/Singleton";
import { BagItem, EnrichedBagItem, IPlayer, IShopItem } from "../Net/Shared/models/Interfaces";
import EventManager from "../Base/EventManager";
import { EVENT_ENUM } from "./Enum";
import { ResUseItem } from '../Net/Shared/protocols/shop/PtlUseItem';
import { ToastManager } from "../Prefab/UI/ToastManager";


export default class UserDataManager extends Singleton {

    static get Instance() {
        return super.GetInstance<UserDataManager>();
    }


    private _ssoToken: string = null; // 用户凭证
    private _userInfo: IPlayer = null; // 用户信息
    private _IShopItem: IShopItem[] = []; // 商店

    public get SsoToken() {
        return this._ssoToken;
    }

    public set SsoToken(token: string) {
        this._ssoToken = token;
    }

    public get UserInfo() {
        return this._userInfo;
    }

    public set UserInfo(userinfo: IPlayer) {
        this._userInfo = userinfo;
    }

    public get IsCaptain() {
        return this._userInfo.captain;
    }

    public set IsCaptain(ret: boolean) {
        this._userInfo.captain = ret;
    }

    public get ShopData(): IShopItem[] {
        return this._IShopItem;
    }
    public set ShopData(list:IShopItem[]) {
        this.ShopData = list;
    }

    

    /**
     * 获取当前用户是否死亡,true表示死亡
     */
    public get IsDie() {
        // 1是死亡，  0是正常
        if (this._userInfo.isdie) {
            return 1;
        } else {
            return 0;
        }
    }

    public set IsDie(value: number) {
        this._userInfo.isdie = value;
        EventManager.Instance.emit(EVENT_ENUM.UpdateIsDie);
    }

    public get BagData(): EnrichedBagItem[] {
        return this._userInfo.bag_data
    }


    public get GameCoin(): number {
        return this._userInfo.user.game_coin || 0;
    }

    //点卷
    public get Point(): number {
        return this._userInfo.point || 0;
    }

    //获取复活药水的id
    public get vipResurrection(): number {
        let itemId = 0;
            let itemName = '';
            if (this.UserInfo.user.level == 0) {
                itemId = 49;
                itemName = '';
            } else if (this.UserInfo.user.level == 1) {
                itemId = 50;
            } else if (this.UserInfo.user.level == 2) {
                itemId = 51;
            } else if (this.UserInfo.user.level == 3) {
                itemId = 52;
            } else if (this.UserInfo.user.level == 4) {
                itemId = 53;
            } else if (this.UserInfo.user.level == 5) {
                itemId = 54;
            } else {
                itemId = -1;
            }
            return itemId;
    }

    //获取复活药水的图
    public get vipResurrectionPic(): string {
            let iconUrl = '';
            if (this.UserInfo.user.level == 0) {
                iconUrl = 'Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip0/spriteFrame';
            } else if (this.UserInfo.user.level == 1) {
                iconUrl = 'Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip1/spriteFrame';
            } else if (this.UserInfo.user.level == 2) {
                iconUrl = 'Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip2/spriteFrame';
            } else if (this.UserInfo.user.level == 3) {
                iconUrl = 'Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip3/spriteFrame';
            } else if (this.UserInfo.user.level == 4) {
                iconUrl = 'Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip4/spriteFrame';
            } else if (this.UserInfo.user.level == 5) {
                iconUrl = 'Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip5/spriteFrame';
            } else {
                iconUrl = 'Texture/2.0/3.匹配大厅/队伍组件/vip小标/Vip0/spriteFrame';
            }
            return iconUrl;
    }

    public updateUserInfo(game_icon: number, point: number, power: number, freePower: number) {
        //  console.log('updateUserInfo 被调用',game_icon,point,power);
        this._userInfo.user.game_coin = game_icon;
        this._userInfo.point = point;
        this._userInfo.power = power;
        this._userInfo.freezePower = freePower;

        EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo);

    }

    // public updateUserInfoMyteam(game_icon:number,point:number,power:number){
    //     // console.log('updateUserInfo 被调用',game_icon,point,power);
    //     this._userInfo.user.game_coin = game_icon;
    //     this._userInfo.point = point;
    //     this._userInfo.power = power;

    //     EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfoMyTeam);

    // }


    public updateBagData(ddd: EnrichedBagItem[]) {
        this._userInfo.bag_data = ddd;
    }

    // 删除道具，如果已存在则累加数量
    public delBag(itemid: number): void {
        if (!itemid) {
            console.warn('delBag: invalid item');
            return;
        }
        if (!this._userInfo) {
            console.warn('delBag: user info not initialized');
            return;
        }
        if (!this._userInfo.bag_data) {
            this._userInfo.bag_data = [];
        }
        console.log('this._userInfo.bag_data = ', this._userInfo.bag_data);
        console.log('delBag itemid= ', itemid);
        const existing = this._userInfo.bag_data.find(bagItem => bagItem.id === itemid);
        if (existing) {
            existing.count -= 1;
        } else {
            ToastManager.showToast('没有这个道具111');
        }
    }

    // 添加新道具，如果已存在则累加数量
    public addBag(bagItemm: EnrichedBagItem): void {
        if (!bagItemm) {
            console.warn('addBag: invalid item');
            return;
        }
        if (!this._userInfo) {
            console.warn('addBag: user info not initialized');
            return;
        }
        if (!this._userInfo.bag_data) {
            this._userInfo.bag_data = [];
        }
        const existing = this._userInfo.bag_data.find(bagItem => bagItem.id === bagItemm.id);
        if (existing) {
            existing.count += 1;
            return;
        }
        const initialCount = bagItemm.count ?? 1;
        // this._userInfo.bag_data.push({ id: item.id, count: initialCount });
        this._userInfo.bag_data.push(bagItemm);
    }

    //检查 最大次数max、目前剩余次数
    public get CanPlayToday(): boolean {
        // console.log('times_max = ',this._userInfo.times_max );
        // console.log('times = ',this._userInfo.times );
        if (this._userInfo.times_max - this._userInfo.times <= 0) {
            return false;
        }
        return true;
    }

    //获取 是否能创建队伍 是否有 旗鼓手
    public get CanCreateTeam(): boolean {
        for (const element of this._userInfo.bag_data) {
            if (element.id == 4) {
                return true;
            }
        }
        console.log('this._userInfo.bag_data = ', this._userInfo.bag_data);
        return false;
    }











}












