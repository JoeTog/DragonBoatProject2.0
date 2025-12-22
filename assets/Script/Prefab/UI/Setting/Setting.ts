import { _decorator, Component, Node, Slider, Sprite, Toggle, UITransform, Vec3, Label, sys } from 'cc';
import GameConfig from '../../../Config/GameConfig';
import { UIButtonUtil } from '../../../Base/UIButtonUtil';
import { EVENT_ENUM, IPlayerSetInfo, LocalStorageKey, NoticesType, popType, PREFAB_PATH_ENUM } from '../../../Data/Enum';
import UserDataManager from '../../../Data/UserDataManager';
import { JSB } from 'cc/env';
import ConfigManager from '../../../Base/ConfigManager';
import { AudioBGMManager } from '../../../Base/AudioBGMManager';
import { AudioManager } from '../../../Base/AudioManager';
import EventManager from '../../../Base/EventManager';
const { ccclass, property } = _decorator;

@ccclass('Setting')
export class Setting extends Component {

    @property(Slider)
    musicBGMSlider: Slider = null;
    @property({ type: Node })
    private musicBGMProgressNode: Node = null!;  // 非空断言
    @property({ type: Node })
    private musicBGMHandleNode: Node = null!;
    @property({ type: Toggle })
    private musicBGMToggle: Toggle = null;
    @property({ type: Node })
    private musicNodeSwitchOn: Node = null!;
    @property({ type: Node })
    private musicNodeSwitchOff: Node = null!;

    @property(Slider)
    soundEffectSlider: Slider = null;
    @property({ type: Node })
    private soundEffectProgressNode: Node = null!;  // 非空断言
    @property({ type: Node })
    private soundEffectHandleNode: Node = null!;
    @property({ type: Toggle })
    private soundEffectToggle: Toggle = null;
    @property({ type: Node })
    private soundEffectNodeSwitchOn: Node = null!;
    @property({ type: Node })
    private soundEffectNodeSwitchOff: Node = null!;
    @property({ type: Label })
    private versionLabel: Label = null!;
    @property({ type: Node })
    private DescriptionBtn: Node = null!;
    @property({ type: Node })
    private quitBtn: Node = null!;

    private personalInfo: IPlayerSetInfo = null;

    private isInitialized = false;
    private static _instance: Setting | null = null;

    /** 获取 NetManager 单例实例（组件模式下存在即返回） */
    public static get Instance(): Setting {
        if (!this._instance) {
            this._instance = new Setting();
        }
        return this._instance;
    }


    protected start(): void {

        // 初始化进度
        //背景音乐
        // this.updateMusicBGMProgress(this.musicBGMSlider.progress);
        // 监听滑动事件
        this.musicBGMSlider.node.on('slide', this.onMusicBGMSliderChanged, this);
        // 添加切换事件监听
        this.musicBGMToggle.node.on('toggle', this.onMusicBGMToggle, this);

        //音效相关
        // this.updateSoungEffectProgress(this.soundEffectSlider.progress);
        // 监听滑动事件
        this.soundEffectSlider.node.on('slide', this.onSoungEffectSliderChanged, this);
        // 添加切换事件监听
        this.soundEffectToggle.node.on('toggle', this.onSoungEffectToggle, this);

        this.versionLabel.string = '版本号:' + GameConfig.version;
        const ret = GameConfig.ws_url.includes('test');
        if (ret) {
            this.versionLabel.string = '测试版:' + GameConfig.version;
        }

        this.getSaveSetting();

        const closeBtn = this.node.getChildByName('pop').getChildByName('close');
        UIButtonUtil.initBtn(closeBtn, () => {
            this.setSaveSetting();
            this.node.destroy();

        });

        UIButtonUtil.initBtn(this.DescriptionBtn, () => {
            EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                prefab_url: PREFAB_PATH_ENUM.SystemAnnouncement,
                source: popType.Notice, typeSpecific: NoticesType.Introduction
            });
        });

        UIButtonUtil.initBtn(this.quitBtn, () => {
            this.onExitRedClick();
        });

    }

    public init() {

        if (this.isInitialized) return;

        const savedData = sys.localStorage.getItem(LocalStorageKey.PersonalConfig + `_${UserDataManager.Instance.UserInfo.uid}`);
        this.personalInfo = savedData ? JSON.parse(savedData) : this.getDefaultSettings();
        ConfigManager.Instance.personalSetting = this.personalInfo;

        this.isInitialized = true;
    }

    getSaveSetting() {
        const savedData = sys.localStorage.getItem(LocalStorageKey.PersonalConfig + `_${UserDataManager.Instance.UserInfo.uid}`);
        this.personalInfo = savedData ? JSON.parse(savedData) : this.getDefaultSettings();
        ConfigManager.Instance.personalSetting = this.personalInfo;
        this.updateMusicBGMProgress(this.personalInfo.musicBGMVolume);
        this.updateSoungEffectProgress(this.personalInfo.soundEffectsVolume);

    }

    setSaveSetting() {

        this.personalInfo.musicBGMVolume = this.musicBGMSlider.progress;
        this.personalInfo.soundEffectsVolume = this.soundEffectSlider.progress;
        ConfigManager.Instance.personalSetting = this.personalInfo;
        sys.localStorage.setItem(
            LocalStorageKey.PersonalConfig + `_${UserDataManager.Instance.UserInfo.uid}`,
            JSON.stringify(this.personalInfo)
        );
    }

    private getDefaultSettings(): IPlayerSetInfo {
        return {
            userId: UserDataManager.Instance.UserInfo.uid,
            musicBGMVolume: 0.3,
            soundEffectsVolume: 0.3,
            musicBGMIsOn: true,
            soundEffectsIsOn: true
        };
    }

    private onSoungEffectToggle(toggle: Toggle) {
        const isChecked = toggle.isChecked;
        console.log('音效 state:', isChecked ? 'ON' : 'OFF');
        // 在这里添加你的业务逻辑
        if (isChecked) {
            // 开启状态
            this.soundEffectNodeSwitchOn.active = true;
            this.soundEffectNodeSwitchOff.active = false;
            this.personalInfo.soundEffectsIsOn = true;
            this.updateSoungEffectProgress(this.personalInfo.soundEffectsVolume > 0 ? this.personalInfo.soundEffectsVolume : 0.3);
        } else {
            // 关闭状态
            this.soundEffectNodeSwitchOn.active = false;
            this.soundEffectNodeSwitchOff.active = true;
            this.personalInfo.soundEffectsIsOn = false;
            this.updateSoungEffectProgress(0);
        }

    }

    private onSoungEffectSliderChanged(slider: Slider) {
        this.updateSoungEffectProgress(slider.progress);
    }

    private updateSoungEffectProgress(progress: number) {
        if (progress <= 0) {
            // 关闭状态
            this.soundEffectToggle.isChecked = false;
            this.soundEffectNodeSwitchOn.active = false;
            this.soundEffectNodeSwitchOff.active = true;
        } else {
            // 开启状态
            this.soundEffectToggle.isChecked = true;
            this.soundEffectNodeSwitchOn.active = true;
            this.soundEffectNodeSwitchOff.active = false;
        }
        AudioManager.Instance.soundEffectVolume = progress;
        this.soundEffectSlider.progress = progress;
        // console.log('this.soundEffectSlider.progress = ',this.soundEffectSlider.progress);
        // 确保进度在0-1之间
        progress = Math.max(0, Math.min(1, progress));
        // 更新进度条填充
        if (this.soundEffectProgressNode) {
            this.soundEffectProgressNode.getComponent(Sprite).fillRange = progress;
        }
        // 如果没有滑块节点，直接返回
        if (!this.soundEffectHandleNode) return;
        const uiTransform = this.soundEffectProgressNode?.getComponent(UITransform);
        const handleTransform = this.soundEffectHandleNode.getComponent(UITransform);
        // 如果缺少必要组件，直接返回
        if (!uiTransform || !handleTransform) return;
        const progressWidth = uiTransform.width;
        // 计算滑块的移动范围
        const minX = -progressWidth * 0.5;  // 进度条左边界
        const maxX = progressWidth * 0.5;   // 进度条右边界
        // 添加边距，防止滑块超出边界
        const padding = 20;  // 可以根据需要调整
        const handleLeft = minX + padding;
        const handleRight = maxX - padding;
        // 计算滑块的最终位置 padding为加数基础，根据progress得出滑块应该在哪
        const handleX = handleLeft + (handleRight - handleLeft) * progress;
        this.soundEffectHandleNode.setPosition(new Vec3(handleX, 0, 0));
    }

    //背景音乐相关
    private onMusicBGMToggle(toggle: Toggle) {
        const isChecked = toggle.isChecked;
        console.log('背景音乐 state:', isChecked ? 'ON' : 'OFF');
        // 在这里添加你的业务逻辑
        if (isChecked) {
            // 开启状态
            this.musicNodeSwitchOn.active = true;
            this.musicNodeSwitchOff.active = false;
            this.personalInfo.musicBGMIsOn = true;
            this.updateMusicBGMProgress(this.personalInfo.musicBGMVolume > 0 ? this.personalInfo.musicBGMVolume : 0.3);
        } else {
            // 关闭状态
            this.musicNodeSwitchOn.active = false;
            this.musicNodeSwitchOff.active = true;
            this.personalInfo.musicBGMIsOn = false;
            this.updateMusicBGMProgress(0);
        }
    }

    private onMusicBGMSliderChanged(slider: Slider) {
        this.updateMusicBGMProgress(slider.progress);
    }

    private updateMusicBGMProgress(progress: number) {
        if (progress <= 0) {
            // 关闭状态
            this.musicBGMToggle.isChecked = false;
            this.musicNodeSwitchOn.active = false;
            this.musicNodeSwitchOff.active = true;
        } else {
            // 开启状态
            this.musicBGMToggle.isChecked = true;
            this.musicNodeSwitchOn.active = true;
            this.musicNodeSwitchOff.active = false;
        }

        AudioBGMManager.Instance.musicBGMVolume = progress;
        this.musicBGMSlider.progress = progress;
        // 确保进度在0-1之间
        progress = Math.max(0, Math.min(1, progress));
        // 更新进度条填充
        if (this.musicBGMProgressNode) {
            this.musicBGMProgressNode.getComponent(Sprite).fillRange = progress;
        }
        // 如果没有滑块节点，直接返回
        if (!this.musicBGMHandleNode) return;
        const uiTransform = this.musicBGMProgressNode?.getComponent(UITransform);
        const handleTransform = this.musicBGMHandleNode.getComponent(UITransform);
        // 如果缺少必要组件，直接返回
        if (!uiTransform || !handleTransform) return;
        const progressWidth = uiTransform.width;
        // 计算滑块的移动范围
        const minX = -progressWidth * 0.5;  // 进度条左边界
        const maxX = progressWidth * 0.5;   // 进度条右边界
        // 添加边距，防止滑块超出边界
        const padding = 20;  // 可以根据需要调整
        const handleLeft = minX + padding;
        const handleRight = maxX - padding;
        // 计算滑块的最终位置 padding为加数基础，根据progress得出滑块应该在哪
        const handleX = handleLeft + (handleRight - handleLeft) * progress;
        this.musicBGMHandleNode.setPosition(new Vec3(handleX, 0, 0));
    }



    private onExitRedClick() {
        console.log("退出按钮被点击 onExitRedClick");
        // 方法1: 发送消息给原生App
        this.sendMessageToNativeRed('exitApp');

        // 方法2: 调用原生方法 (如果App有注入)
        // this.callNativeMethod();
    }

    private sendMessageToNativeRed(message: string) {
        try {
            var userAgent = navigator.userAgent.toLowerCase();
            console.log('sendMessageToNativeRed userAgent = ' , userAgent);
            if (this.isAndroidApp() || userAgent.includes("android")) {
                // Android WebView
                console.log('androidRed 111');
                // if ((window as any).AndroidInterface) {
                // console.log('androidRed 2222');
                // 使用 any 断言避免 TS 对 window.app 的类型报错，同时增加安全判断
                (window as any).app && (window as any).app.jsRun("exitApp");
                // window.app.jsRun("read");
                // (window as any).AndroidInterface.postMessage(JSON.stringify({
                //     type: 'FROM_WEB',
                //     action: message
                // }));
                // }
            } else if (this.isIOSApp() || userAgent.includes("iphone os")) {
                console.log('iosRed 1111');
                // iOS WKWebView
                // if ((window as any).webkit && (window as any).webkit.messageHandlers) {
                // console.log('iosRed 2222');
                // ToastManager.showToast('ios ios');
                (window as any).webkit.messageHandlers.deviceInfo.postMessage({
                    "body": "exitApp"
                })
                // (window as any).webkit.messageHandlers.nativeHandler.postMessage({
                //     type: 'FROM_WEB',
                //     action: message
                // });
                // }
            }
        } catch (e) {
            console.error('红色按钮 发送消息到原生应用失败:', e);
        }
    }

    private onExitClick() {
        console.log("退出按钮被点击");

        // 方法1: 发送消息给原生App
        this.sendMessageToNative('exitApp');

        // 方法2: 调用原生方法 (如果App有注入)
        // this.callNativeMethod();
    }

    private sendMessageToNative(message: string) {
        try {
            // 通用消息传递方式
            if (window.parent) {
                window.parent.postMessage({ type: 'FROM_WEB', action: message }, '*');
            }

            // 特定于平台的消息传递
            if (this.isAndroidApp()) {
                // Android WebView
                if ((window as any).AndroidInterface) {
                    (window as any).AndroidInterface.postMessage(JSON.stringify({
                        type: 'FROM_WEB',
                        action: message
                    }));
                }
            } else if (this.isIOSApp()) {
                // iOS WKWebView
                if ((window as any).webkit && (window as any).webkit.messageHandlers) {
                    (window as any).webkit.messageHandlers.nativeHandler.postMessage({
                        type: 'FROM_WEB',
                        action: message
                    });
                }
            }
        } catch (e) {
            console.error('发送消息到原生应用失败:', e);
        }
    }

    private callNativeMethod() {
        try {
            // 检查是否是Android
            if (this.isAndroidApp() && (window as any).AndroidInterface) {
                (window as any).AndroidInterface.exitApp();
                return;
            }

            // 检查是否是iOS
            if (this.isIOSApp() && (window as any).webkit?.messageHandlers?.nativeHandler) {
                (window as any).webkit.messageHandlers.nativeHandler.postMessage({
                    action: 'exitApp'
                });
                return;
            }

            console.warn('未找到可用的原生方法');
        } catch (e) {
            console.error('调用原生方法失败:', e);
        }
    }

    private isAndroidApp(): boolean {
        return /Android/i.test(navigator.userAgent);
    }

    private isIOSApp(): boolean {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    update(deltaTime: number) {

    }
}

