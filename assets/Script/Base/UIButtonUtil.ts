import { _decorator, Component, Node, tween, Vec3, EventTouch } from 'cc';
import { MUSIC_PATH_ENUM } from '../Data/Enum';
import { AudioManager } from './AudioManager';

export class UIButtonUtil {
    /** 默认冷却时间 */
    private static _defaultContinuousTime: number = 0.5;
    /** 每个节点的冷却状态 */
    private static _nodeContinuousMap: Map<Node, boolean> = new Map();
    /** 每个节点的冷却时间 */
    private static _nodeContinuousTimeMap: Map<Node, number> = new Map();
    /** 每个节点的定时器 */
    private static _nodeTimerMap: Map<Node, number> = new Map();
    /** 每个节点的按下状态 */
    private static _nodePressedMap: Map<Node, boolean> = new Map();

    /**
     * 设置指定节点的冷却时间，如果不设置则使用默认值
     */
    public static setContinuousTime(node: Node, time: number): void {
        this._nodeContinuousTimeMap.set(node, time);
    }

    /**
     * 初始化按钮监听（带缩放效果）
     */
    public static initBtn(node: Node, callback?: () => void, once: boolean = false): void {
        if (!node) return;

        // 初始化节点状态
        this._nodeContinuousMap.set(node, false);
        this._nodePressedMap.set(node, false);

        if (once) {
            node.once(Node.EventType.TOUCH_START, (event) => {
                this.onTouchStart(event, node);
            }, this);

            node.once(Node.EventType.TOUCH_END, (event) => {
                this.onTouchEnd(event, node, callback);
            }, this);

            node.once(Node.EventType.TOUCH_CANCEL, (event) => {
                this.onTouchCancel(event, node);
            }, this);
            return;
        }

        node.on(Node.EventType.TOUCH_START, (event) => {
            this.onTouchStart(event, node);
        }, this);

        node.on(Node.EventType.TOUCH_END, (event) => {
            this.onTouchEnd(event, node, callback);
        }, this);

        node.on(Node.EventType.TOUCH_CANCEL, (event) => {
            this.onTouchCancel(event, node);
        }, this);
    }

    /**
     * 初始化按钮监听（无缩放效果）
     */
    public static initBtnNo(node: Node, callback?: (node: Node, arg: any) => void, optional: { once?: boolean, arg?: any } = {}): void {
        if (!node) return;

        const { once = false, arg = null } = optional;

        // 初始化节点状态
        this._nodeContinuousMap.set(node, false);

        const touchEndHandler = (event: EventTouch) => {
            if (this._nodeContinuousMap.get(node)) return;
            
            this._nodeContinuousMap.set(node, true);
            const continuousTime = this._nodeContinuousTimeMap.get(node) || this._defaultContinuousTime;
            const timer = setTimeout(() => {
                this._nodeContinuousMap.set(node, false);
                // 清理定时器
                if (this._nodeTimerMap.has(node)) {
                    this._nodeTimerMap.delete(node);
                }
            }, continuousTime * 1000) as unknown as number;
            this._nodeTimerMap.set(node, timer);
            
            callback && callback(node, arg);
        };

        if (once) {
            node.once(Node.EventType.TOUCH_END, touchEndHandler, this);
        } else {
            node.on(Node.EventType.TOUCH_END, touchEndHandler, this);
        }
    }

    private static onTouchStart(event: EventTouch, node: Node): void {
        if (this._nodeContinuousMap.get(node)) return;
        
        this._nodePressedMap.set(node, true);
        this.clickDownTween(node);
    }

    private static onTouchEnd(event: EventTouch, node: Node, callback?: () => void): void {
        const isContinuous = this._nodeContinuousMap.get(node);
        const wasPressed = this._nodePressedMap.get(node);
        
        // 重置按下状态
        this._nodePressedMap.set(node, false);
        
        if (isContinuous) {
            // 如果在冷却中，直接恢复缩放并返回
            tween(node).to(0.1, { scale: new Vec3(1, 1, 1) }).start();
            return;
        }
        
        if (!wasPressed) {
            // 如果按钮没有被按下（比如在冷却期间按下但在冷却结束后抬起），直接返回
            return;
        }
        
        this._nodeContinuousMap.set(node, true);
        this.clickUpTween(node, callback);
    }

    private static onTouchCancel(event: EventTouch, node: Node): void {
        // 重置按下状态
        this._nodePressedMap.set(node, false);
        
        const timer = this._nodeTimerMap.get(node);
        if (timer) {
            clearTimeout(timer);
            this._nodeTimerMap.delete(node);
        }
        this._nodeContinuousMap.set(node, false);
        tween(node).to(0.1, { scale: new Vec3(1, 1, 1) }).start();
    }

    private static clickDownTween(node: Node): void {
        tween(node).to(0.1, { scale: new Vec3(0.9, 0.9, 0.9) }).start();
    }

    private static clickUpTween(node: Node, callback?: () => void): void {
        // 只有在非冷却状态且确实被按下的情况下才播放音效
        AudioManager.Instance.playOneShot(MUSIC_PATH_ENUM.BtnClick)        
        tween(node)
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                const continuousTime = this._nodeContinuousTimeMap.get(node) || this._defaultContinuousTime;
                const timer = setTimeout(() => {
                    this._nodeContinuousMap.set(node, false);
                    this._nodeTimerMap.delete(node);
                }, continuousTime * 1000) as unknown as number;
                this._nodeTimerMap.set(node, timer);
                callback && callback();
            })
            .start();
    }

    /**
     * 清理指定节点的监听和状态
     */
    public static removeNode(node: Node): void {
        if (!node) return;

        // 清理定时器
        const timer = this._nodeTimerMap.get(node);
        if (timer) {
            clearTimeout(timer);
            this._nodeTimerMap.delete(node);
        }

        // 移除事件监听
        node.off(Node.EventType.TOUCH_START);
        node.off(Node.EventType.TOUCH_END);
        node.off(Node.EventType.TOUCH_CANCEL);

        // 移除状态
        this._nodeContinuousMap.delete(node);
        this._nodeContinuousTimeMap.delete(node);
        this._nodePressedMap.delete(node);
    }

    /**
     * 强制重置指定节点的冷却状态
     */
    public static resetNodeState(node: Node): void {
        const timer = this._nodeTimerMap.get(node);
        if (timer) {
            clearTimeout(timer);
            this._nodeTimerMap.delete(node);
        }
        this._nodeContinuousMap.set(node, false);
        this._nodePressedMap.set(node, false);
        tween(node).to(0.1, { scale: new Vec3(1, 1, 1) }).start();
    }

    /**
     * 清理所有节点
     */
    public static cleanup(): void {
        // 清理所有定时器
        for (let [node, timer] of this._nodeTimerMap) {
            clearTimeout(timer);
            // 移除事件监听
            node.off(Node.EventType.TOUCH_START);
            node.off(Node.EventType.TOUCH_END);
            node.off(Node.EventType.TOUCH_CANCEL);
        }
        this._nodeTimerMap.clear();
        this._nodeContinuousMap.clear();
        this._nodeContinuousTimeMap.clear();
        this._nodePressedMap.clear();
    }
}