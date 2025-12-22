import { _decorator, Component, instantiate, Label, Node, Prefab, Widget } from 'cc';
import ConfigManager from 'db://assets/Script/Base/ConfigManager';
import { truncateString, truncateStringCutIndex } from '../../../../Base/Utils';
import { TsRpc } from 'db://assets/Script/Net/TsRpc';
import { ToastManager } from '../../ToastManager';
import { ResGetGameConfig } from 'db://assets/Script/Net/Shared/protocols/PtlGetGameConfig';
import UserDataManager from 'db://assets/Script/Data/UserDataManager';
const { ccclass, property } = _decorator;

@ccclass('pushNoticeRender')
export class pushNoticeRender extends Component {

    // 显示文字预制体
    @property(Prefab)
    infoNode: Prefab = null;

    async render() {
        let data = ConfigManager.Instance.introduction;
        console.log('data = ',data);
        if (!Array.isArray(data) || data.length === 0) {
            await this.requestGameConfig();
            data = ConfigManager.Instance.introduction;
        }
        for (let i = 0; i < data.length; i++) {
            const node = instantiate(this.infoNode);
            node.getComponent(Label).string = truncateStringCutIndex(data[i], 18);
            this.node.addChild(node);
            const widget = node.getComponent(Widget);
            if (widget) {
                widget.isAlignHorizontalCenter = false;
                // 如果还想改成左对齐，可以继续设置
                widget.isAlignLeft = true;
                widget.isAlignRight = true;
                widget.left = 0;
                widget.right = 0;
                widget.updateAlignment();
            }
        }
        const node = instantiate(this.infoNode);
        node.getComponent(Label).string = truncateStringCutIndex(data[0], 18);
        this.node.addChild(node);
        const widget = node.getComponent(Widget);
        if (widget) {
            widget.isAlignHorizontalCenter = false;
            // 如果还想改成左对齐，可以继续设置
            widget.isAlignLeft = true;
            widget.isAlignRight = true;
            widget.left = 0;
            widget.right = 0;
            widget.updateAlignment();
        }
    }

    async requestGameConfig() {
            const gonggaoData = await TsRpc.Instance.Client.callApi('GetGameConfig', { __ssoToken: UserDataManager.Instance.SsoToken })
            if (!gonggaoData.isSucc || !gonggaoData.res || !gonggaoData.res.game_desc) {
                ToastManager.showToast(gonggaoData.err?.message || '获取公告失败:未知错误');
                return null;
            }
            const gonggaoArr = gonggaoData.res.game_notice
                        .split(/\r?\n+/)        // 按换行拆分
                        .map(s => s.trim())
                        .filter(Boolean);
                    const shuomingArr = gonggaoData.res.game_desc
                        .split(/\r?\n+/)        // 按换行拆分
                        .map(s => s.trim())
                        .filter(Boolean);
                    ConfigManager.Instance.announcement = gonggaoArr;
                    ConfigManager.Instance.introduction = shuomingArr;
        }

    update(deltaTime: number) {

    }
}

