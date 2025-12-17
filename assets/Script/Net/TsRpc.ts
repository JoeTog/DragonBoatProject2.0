import { WsClient } from 'tsrpc-browser';
import { serviceProto, ServiceType } from './Shared/protocols/serviceProto';
import Singleton from '../Base/Singleton';
import { WsConfig } from '../Config';
import Listenmsgmanager from './Listenmsgmanager';
import EventManager from '../Base/EventManager';
import { EVENT_ENUM } from '../Data/Enum';



export class TsRpc extends Singleton {

    static get Instance() {
        return super.GetInstance<TsRpc>();
    }

    private clientService: WsClient<ServiceType> = null;

    // 断线重连相关
    private _isReconnecting: boolean = false; // 是否正在重连
    private _reconnectAttempts: number = 0; // 重连尝试次数
    private _maxReconnectAttempts: number = 100; // 最大重连次数
    private _reconnectTimer: any = null; // 重连定时器
    private _reconnectDelay: number = 1000; // 初始重连延迟（毫秒）
    private _maxReconnectDelay: number = 10000; // 最大重连延迟（毫秒）
    private _onDisconnectCallback: (() => void) | null = null; // 断开连接回调
    private _onReconnectCallback: (() => void) | null = null; // 重连成功回调

    public async init(): Promise<{
        isSucc: boolean;
        errMsg?: string;
    }> {
        if (this.clientService && this.clientService.isConnected) {
            return { isSucc: true };
        }
        this.clientService = new WsClient(serviceProto, WsConfig)

        this.clientService.flows.preApiReturnFlow.push(v => {
            // 打印所有 API 返回消息
            // console.log('【API返回】', {
            //     api: v.apiName || 'unknown',
            //     isSucc: v.return?.isSucc,
            //     data: v.return
            // });
            if (v.apiName.includes('user/Login')) {
                EventManager.Instance.emit(EVENT_ENUM.WssInited);
            }

            //如果遇到 让用户重新登陆 那就重新获取token
            if (!v.return?.isSucc && v.return?.err) {

                const errorMessage = v.return.err.message || '';
                const errorCode = v.return.err.code || '';

                // 判断是否需要重新登录
                if (errorMessage.includes('You need login before do this') ||
                    errorCode === 'NEED_LOGIN' ||
                    v.return.err.needLogin) {
                    console.warn('【登录失效】需要重新登录:', errorMessage);
                    // 触发重连成功回调，重新登录
                    if (this._onReconnectCallback) {
                        this._onReconnectCallback();
                    }
                }
                
            }

            // 检查登录
            // 检查是否需要登录
            // if (!v.return.isSucc && v.return.err && v.return.err.message) {
            //     // 显示提示并刷新页面
            // }
            
            return v;
        })

        // 监听连接断开事件
        this.setupDisconnectListener();

        const result = await this.clientService.connect();
        if (result.isSucc) {
            this.onConnectSuccess();
        }

        return result;
    }

    /**
     * 设置断开连接监听
     */
    private setupDisconnectListener(): void {
        if (!this.clientService) {
            return;
        }

        // 监听连接断开事件
        this.clientService.flows.postDisconnectFlow.push(v => {
            console.warn('【网络断开】连接已断开', v);
            this.onDisconnect();
            return v;
        });

        // 监听连接错误事件
        this.clientService.flows.postConnectFlow.push((v: any) => {
            if (!v.isSucc) {
                if (v.errMsg) {

                    console.error('【连接失败】', v.errMsg);
                }
                // 连接失败也触发重连
                this.onDisconnect();
            } else {
                console.log('【连接成功】');
                this.onConnectSuccess();
            }
            return v;
        });
    }

    /**
     * 连接断开处理
     */
    private onDisconnect(): void {
        // 如果正在重连，不重复触发
        if (this._isReconnecting) {
            return;
        }

        // 重置重连状态
        this._isReconnecting = true;
        this._reconnectAttempts = 0;

        // 触发断开连接回调
        if (this._onDisconnectCallback) {
            this._onDisconnectCallback();
        }

        // 开始重连
        this.startReconnect();
    }

    /**
     * 连接成功处理
     */
    private onConnectSuccess(): void {
        // 重置重连状态
        this._isReconnecting = false;
        this._reconnectAttempts = 0;
        this._reconnectDelay = 1000;

        // 清除重连定时器
        if (this._reconnectTimer) {
            clearTimeout(this._reconnectTimer);
            this._reconnectTimer = null;
        }

        // 初始化消息监听
        if (this.clientService && this.clientService.isConnected) {
            Listenmsgmanager.Instance.init(this.clientService);
        }

        // 触发重连成功回调
        if (this._onReconnectCallback) {
            this._onReconnectCallback();
        }
        
        console.log('【网络连接】连接成功，已初始化消息监听');
    }

    /**
     * 开始重连
     */
    private startReconnect(): void {
        // 如果已经达到最大重连次数，停止重连
        if (this._reconnectAttempts >= this._maxReconnectAttempts) {
            console.error(`【重连失败】已达到最大重连次数 ${this._maxReconnectAttempts}，停止重连`);
            this._isReconnecting = false;
            return;
        }

        // 计算重连延迟（指数退避）
        const delay = Math.min(
            this._reconnectDelay * Math.pow(2, this._reconnectAttempts),
            this._maxReconnectDelay
        );

        this._reconnectAttempts++;
        console.log(`【连接中】第 ${this._reconnectAttempts} 次尝试连接，${delay}ms 后重试...`);

        // 设置重连定时器
        this._reconnectTimer = setTimeout(async () => {
            await this.attemptReconnect();
        }, delay);
    }

    /**
     * 尝试重连
     */
    private async attemptReconnect(): Promise<void> {
        if (!this.clientService) {
            console.error('【重连失败】clientService 不存在');
            this.startReconnect();
            return;
        }

        try {
            // 如果已经连接，不需要重连
            if (this.clientService.isConnected) {
                console.log('【重连成功】连接已恢复');
                this.onConnectSuccess();
                return;
            }

            // 尝试重新连接
            const result = await this.clientService.connect();

            if (result.isSucc) {
                console.log('【重连成功】连接已恢复');
                this.onConnectSuccess();

            } else {
                console.warn(`【重连失败】${result.errMsg}，继续尝试重连...`);
                // 继续重连
                this.startReconnect();
            }
        } catch (error) {
            console.error('【重连异常】', error);
            // 继续重连
            this.startReconnect();
        }
    }

    /**
     * 手动触发重连
     */
    public async manualReconnect(): Promise<boolean> {
        if (this._isReconnecting) {
            console.warn('【重连中】1111正在重连，请勿重复触发');
            return false;
        }

        // 清除现有连接
        if (this.clientService) {
            try {
                await this.clientService.disconnect();
            } catch (error) {
                console.warn('【断开连接】断开失败', error);
            }
        }

        // 重置状态
        this._isReconnecting = true;
        this._reconnectAttempts = 0;
        this._reconnectDelay = 1000;

        // 立即尝试重连
        await this.attemptReconnect();
        return true;
    }

    /**
     * 停止重连
     */
    public stopReconnect(): void {
        this._isReconnecting = false;
        if (this._reconnectTimer) {
            clearTimeout(this._reconnectTimer);
            this._reconnectTimer = null;
        }
        console.log('【重连停止】已停止自动重连');
    }

    /**
     * 设置断开连接回调
     */
    public setOnDisconnectCallback(callback: () => void): void {
        this._onDisconnectCallback = callback;
    }

    /**
     * 设置重连成功回调
     */
    public setOnReconnectCallback(callback: () => void): void {
        this._onReconnectCallback = callback;
    }

    /**
     * 获取重连状态
     */
    public get isReconnecting(): boolean {
        return this._isReconnecting;
    }

    /**
     * 获取重连尝试次数
     */
    public get reconnectAttempts(): number {
        return this._reconnectAttempts;
    }

    public get Client(): WsClient<ServiceType> {
        return this.clientService;
    }





}


