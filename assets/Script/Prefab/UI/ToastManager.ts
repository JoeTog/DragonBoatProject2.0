// ToastManager.ts
import { _decorator, Component, Node, Label, tween, v3, instantiate, Prefab, Size, UITransform, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToastManager')
export class ToastManager extends Component {
    @property({ type: Prefab })
    public toastPrefab: Prefab = null!;

    private static instance: ToastManager = null!;
    private static readonly MESSAGE_INTERVAL = 3_000; // ms
    private static lastShowTimeMap: Map<string, number> = new Map();

    onLoad() {
        ToastManager.instance = this;
    }

    // 静态方法方便调用
    public static showToast(message: string, duration: number = 2) {
        const normalized = message?.trim() ?? '';
        if (!normalized) {
            return;
        }

        const now = Date.now();
        const last = ToastManager.lastShowTimeMap.get(normalized);
        if (last && now - last < ToastManager.MESSAGE_INTERVAL) {
            return;
        }
        ToastManager.lastShowTimeMap.set(normalized, now);

        if (ToastManager.instance) {
            ToastManager.instance.show(normalized, duration);
        }
    }

    private show(message: string, duration: number) {
        if (!this.toastPrefab) {
            console.error('Toast预制体未设置！');
            return;
        }

        // 实例化Toast节点
        const toastNode = instantiate(this.toastPrefab);
        const windowsNode = find('Canvas/windows');
        const parentNode = windowsNode ?? this.node;
        parentNode.addChild(toastNode);
        toastNode.setSiblingIndex(parentNode.children.length - 1);

        // 获取并设置Label文本
        const label = toastNode.getChildByName('label')?.getComponent(Label);
        if (label) {
            label.string = message;
            // 立即更新渲染数据以确保获取正确尺寸
            label.updateRenderData(true);
        }

        // 动态调整背景大小适应文本
        this.adjustBackgroundSize(toastNode);

        // 设置初始位置和缩放
        toastNode.setPosition(v3(0, 230, 0)); // 屏幕上方显示
        toastNode.setScale(v3(0, 0, 0));

        // 动画效果
        tween(toastNode)
            .to(0.3, { scale: v3(1, 1, 1) }, { easing: 'smooth' })
            .delay(duration)
            .to(0.3, { scale: v3(0, 0, 0) }, { easing: 'smooth' })
            .call(() => {
                toastNode.destroy();
            })
            .start();
    }

    // 调整背景尺寸适应文本内容
    private adjustBackgroundSize(toastNode: Node) {
        const background = toastNode.getChildByName('bg');
        const label = toastNode.getChildByName('label')?.getComponent(Label);

        if (background && label) {
            const uiTransform = background.getComponent(UITransform);
            const labelUITransform = label.node.getComponent(UITransform);

            if (uiTransform && labelUITransform) {
                // 获取Label的实际渲染尺寸
                const labelWidth = labelUITransform.width;
                const labelHeight = labelUITransform.height;

                // 设置背景尺寸，增加边距
                uiTransform.setContentSize(new Size(labelWidth + 40, labelHeight + 20));

                // 确保对齐
                background.setPosition(v3(0, 0, 0));
                label.node.setPosition(v3(0, 0, 0));
            }
        }
    }
}