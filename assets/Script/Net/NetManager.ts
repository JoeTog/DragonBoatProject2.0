import { _decorator, Color, Component } from 'cc';
const { ccclass } = _decorator;

import EventManager from '../Base/EventManager';
import { EVENT_ENUM, NetType } from '../Data/Enum';
import { TsRpc } from './TsRpc';
import { GameDataManager } from '../Data/GameDatamanager';
import GameConfig from '../Config/GameConfig';


export interface NetworkQualityChangePayload {
    level: NetType;//网络强度等级 4个等级
    avgLatency: number;//延迟数值
    bars: number;//几格信号
    colorHex: string;//信号颜色
    shouldWarn: boolean;//是否需要提示网络延迟过大
    isDisconnected?: boolean;//是否断连
}

type EmitOptions = {
    force?: boolean;
    warn?: boolean;
    disconnected?: boolean;
};

/**
 * 网络管理组件
 * 负责：
 * 1. 监听 TsRpc 连接事件，定时探测网络延迟
 * 2. 根据延迟样本计算当前网络质量等级
 * 3. 通过 EventManager 派发统一的网络质量事件，供 UI 显示网络“信号格”
 *
 * 使用方式：
 * - 将该组件挂到全局常驻节点（如 Canvas 根节点）
 * - 监听 {@link NetManager.NETWORK_QUALITY_EVENT}，根据 payload 绘制 UI
 */
@ccclass('NetManager')
export class NetManager extends Component {
    public static readonly NETWORK_QUALITY_EVENT = 'NetworkQualityChange';
    private static _instance: NetManager | null = null;

    /** 获取 NetManager 单例实例（组件模式下存在即返回） */
    public static get Instance(): NetManager | null {
        return this._instance;
    }

    private latencySamples: number[] = [];
    private readonly maxSamples = 8;
    private readonly monitorInterval = 10000; // ms
    private readonly silenceThreshold = 15000; // ms
    private monitorTimer: number | null = null;
    private silenceTimer: number | null = null;
    private lastEmitAt = 0;
    private lastWarnAt = 0;
    private currentLevel: NetType = NetType.excellent;
    private callApiWrapped = false;
    private flowsHooked = false;
    private readonly upgradeDelayMs = 5000;//当网络变差后，延迟5秒变好
    private pendingUpgradeTimer: number | null = null;
    private pendingUpgradePayload: { level: NetType; avgLatency: number; options?: EmitOptions } | null = null;

    //'excellent' | 'good' | 'fair' | 'poor';
    //网络颜色调用netrender中的 isuse、color就行，这里不需要设置。这里是设置原始颜色的，就算改也需改netrender中同步改
    public excellentColor: string = '#22C55E';
    private goodColor: string = '#FACC15';
    private fairColor: string = '#F59E0B';
    private poorColor: string = '#D97706';


    /** 生命周期：挂载时注册事件并记录单例引用 */
    protected onLoad(): void {
        NetManager._instance = this;
        EventManager.Instance.on(EVENT_ENUM.WssInited, this.onWsInited, this);
    }

    /** 生命周期：销毁时取消事件监听与定时器，并清理单例引用 */
    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.WssInited, this.onWsInited, this);
        this.stopMonitor();
        this.clearSilenceTimer();
        if (NetManager._instance === this) {
            NetManager._instance = null;
        }
    }

    /** WebSocket 初始化完成后，设置客户端钩子并启动网络质量探测 */
    private onWsInited(): void {
        this.setupClientHooks();
        if (GameConfig.ws_url.includes('test')) {
        } else {
            this.startMonitor();
        }

    }

    /**
     * 为 TsRpc 客户端挂载钩子：监控 API 调用耗时、连接/断开事件
     * 以便获取延迟样本并在状态变更时及时下发网络质量
     */
    private setupClientHooks(): void {
        const client = TsRpc.Instance.Client;
        if (!client) {
            console.log('socket未初始化');
            return;
        }

        if (!this.callApiWrapped) {
            const originalCallApi = client.callApi.bind(client);
            client.callApi = (async (...args: Parameters<typeof originalCallApi>) => {
                const startAt = this.getHighResTimestamp();
                try {
                    const result = await originalCallApi(...args);
                    this.recordLatency(this.getHighResTimestamp() - startAt);
                    return result;
                } catch (error) {
                    this.recordLatency(this.getHighResTimestamp() - startAt);
                    throw error;
                }
            }) as typeof client.callApi;
            this.callApiWrapped = true;
        }

        if (!this.flowsHooked) {
            client.flows.postDisconnectFlow.push((v) => {
                this.markDisconnected();
                return v;
            });

            client.flows.postConnectFlow.push((v: any) => {
                if (v.isSucc) {
                    this.markConnected();
                }
                return v;
            });

            this.flowsHooked = true;
        }
    }

    /** 启动定时器周期性执行探测请求，以补充延迟数据 */
    private startMonitor(): void {
        this.stopMonitor();
        this.monitorTimer = window.setInterval(() => {
            void this.probeLatency();
        }, this.monitorInterval);
        void this.probeLatency();
    }

    /** 停止探测定时器，避免重复任务 */
    private stopMonitor(): void {
        if (this.monitorTimer !== null) {
            clearInterval(this.monitorTimer);
            this.monitorTimer = null;
        }
    }

    /** 调用轻量接口测量往返延迟，失败时降级网络状态 */
    private async probeLatency(): Promise<void> {
        const client = TsRpc.Instance.Client;
        if (!client || !client.isConnected) {
            this.markDisconnected();
            return;
        }

        try {
            //判断5秒内是否有过网络请求

            const startAt = this.getHighResTimestamp();
            const result = await client.callApi('GetGameConfig', {});
            const latency = this.getHighResTimestamp() - startAt;

            if (result && result.isSucc) {
                this.recordLatency(latency);
            } else {
                this.emitQualityChange(NetType.poor, Number.POSITIVE_INFINITY, { warn: true });
            }
        } catch (error) {
            console.warn('[NetManager] probeLatency failed:', error);
            this.emitQualityChange(NetType.poor, Number.POSITIVE_INFINITY, { warn: true });
        }
    }

    /** 记录单次延迟样本并触发网络质量评估 */
    private recordLatency(latency: number): void {
        if (!isFinite(latency)) {
            return;
        }

        this.latencySamples.push(latency);
        if (this.latencySamples.length > this.maxSamples) {
            this.latencySamples.shift();
        }

        this.restartSilenceTimer();

        const avgLatency = this.getAverageLatency();
        const level = this.evaluateQualityLevel(avgLatency);
        // const warn = level === 'poor' && this.currentLevel !== 'poor';
        const warn = level === NetType.poor && this.currentLevel !== NetType.poor;
        this.emitQualityChange(level, avgLatency, { warn });
    }

    /**
     * 根据传入的网络等级/平均延迟构造事件 payload 并派发
     * warn 参数可触发 UI 弹出“网络波动”类提示，force 可忽略节流限制
     */
    private emitQualityChange(level: NetType, avgLatency: number, options?: EmitOptions, bypassDelay = false): void {
        const isImprovement = level < this.currentLevel;
        const isWorsening = level > this.currentLevel;

        if (!bypassDelay && isImprovement) {
            this.schedulePendingUpgrade(level, avgLatency, options);
            return;
        }

        if (isWorsening) {
            this.clearPendingUpgrade();
        }

        const now = Date.now();
        const shouldWarn = options?.warn && (now - this.lastWarnAt > 10000);

        if (!options?.force) {
            if (level === this.currentLevel && now - this.lastEmitAt < 1000) {
                return;
            }
        }

        this.currentLevel = level;
        this.lastEmitAt = now;
        if (shouldWarn) {
            this.lastWarnAt = now;
        }

        const payload: NetworkQualityChangePayload = {
            level,
            avgLatency,
            ...this.mapLevelToIndicator(level),
            shouldWarn: !!shouldWarn,
            isDisconnected: !!options?.disconnected
        };

        EventManager.Instance.emit(NetManager.NETWORK_QUALITY_EVENT, payload);
    }

    /** 重新启动“静默计时器”，若长时间未采集到延迟则自动降为 fair */
    private restartSilenceTimer(): void {
        this.clearSilenceTimer();
        this.silenceTimer = window.setTimeout(() => {
            this.emitQualityChange(NetType.fair, Number.POSITIVE_INFINITY, { force: true });
        }, this.silenceThreshold);
    }

    /** 清除静默降级计时器，防止重复触发 */
    private clearSilenceTimer(): void {
        if (this.silenceTimer !== null) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = null;
        }
    }

    private schedulePendingUpgrade(level: NetType, avgLatency: number, options?: EmitOptions): void {
        if (this.pendingUpgradeTimer !== null) {
            if (this.pendingUpgradePayload && level < this.pendingUpgradePayload.level) {
                this.pendingUpgradePayload = { level, avgLatency, options };
            }
            return;
        }

        this.pendingUpgradePayload = { level, avgLatency, options };
        this.pendingUpgradeTimer = window.setTimeout(() => {
            const payload = this.pendingUpgradePayload;
            this.pendingUpgradeTimer = null;
            this.pendingUpgradePayload = null;
            if (!payload) {
                return;
            }
            if (payload.level < this.currentLevel) {
                this.emitQualityChange(payload.level, payload.avgLatency, payload.options, true);
            }
        }, this.upgradeDelayMs);
    }

    private clearPendingUpgrade(): void {
        if (this.pendingUpgradeTimer !== null) {
            clearTimeout(this.pendingUpgradeTimer);
            this.pendingUpgradeTimer = null;
        }
        this.pendingUpgradePayload = null;
    }

    /** 标记当前连接不可用，立即派发“网络差且需提示”的事件 */
    private markDisconnected(): void {
        this.resetSamples();
        this.emitQualityChange(NetType.poor, Number.POSITIVE_INFINITY, { force: true, warn: true, disconnected: true });
    }

    /** 标记连接恢复，重置样本并派发“网络优秀”的事件 */
    private markConnected(): void {
        this.resetSamples();
        this.emitQualityChange(NetType.excellent, 0, { force: true });
    }

    /** 清空采样数据并归位状态，用于连接重置场景 */
    private resetSamples(): void {
        this.latencySamples = [];
        this.currentLevel = NetType.excellent;
        this.clearSilenceTimer();
        this.clearPendingUpgrade();
    }

    /** 计算延迟样本的平均值，供质量评估使用 */
    private getAverageLatency(): number {
        if (!this.latencySamples.length) {
            return 0;
        }
        const sum = this.latencySamples.reduce((acc, cur) => acc + cur, 0);
        return sum / this.latencySamples.length;
    }

    /** 基于平均延迟与 TsRpc 连接状态判断当前质量等级 */
    private evaluateQualityLevel(avgLatency: number): NetType {
        // console.log('avgLatency 延迟  = ', avgLatency);
        const client = TsRpc.Instance.Client;
        if (!client || !client.isConnected) {
            return NetType.poor;
        }

        if (avgLatency <= 100) {
            return NetType.excellent;
        }
        if (avgLatency <= 200) {
            console.log('avgLatency 延迟good  = ', avgLatency);
            return NetType.good;
        }
        if (avgLatency <= 400) {
            console.log('avgLatency 延迟fair  = ', avgLatency);
            return NetType.fair;
        }
        console.log('avgLatency 延迟poor  = ', avgLatency);
        // if (avgLatency <= 200) {
        //     return NetType.excellent;
        // }
        // if (avgLatency <= 400) {
        //     return NetType.good;
        // }
        // if (avgLatency <= 800) {
        //     return NetType.fair;
        // }
        return NetType.poor;
    }

    /** 将质量等级映射为 UI 需要展示的信号格数量与颜色 */
    private mapLevelToIndicator(level: NetType): Pick<NetworkQualityChangePayload, 'bars' | 'colorHex'> {
        switch (level) {
            case NetType.excellent:
                return { bars: 3, colorHex: this.excellentColor.length > 0 ? this.excellentColor : '#22C55E' };
            case NetType.good:
                return { bars: 3, colorHex: this.goodColor.length > 0 ? this.goodColor : '#FACC15' };
            case NetType.fair:
                return { bars: 2, colorHex: this.fairColor.length > 0 ? this.fairColor : '#F59E0B' };
            case NetType.poor:
            default:
                return { bars: 1, colorHex: this.poorColor.length > 0 ? this.poorColor : '#D97706' };
        }
    }

    /** 获取高精度时间戳，优先使用 performance.now 以提高准确度 */
    private getHighResTimestamp(): number {
        if (typeof performance !== 'undefined' && performance.now) {
            return performance.now();
        }
        return Date.now();
    }
}
