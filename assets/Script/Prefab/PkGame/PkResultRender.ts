import { _decorator, Component, instantiate, Label, Node, Prefab, Widget } from 'cc';
import { TeamInfoManager } from '../../Data/TeamInfoManager';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, MUSIC_PATH_ENUM } from '../../Data/Enum';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { GameDataManager } from '../../Data/GameDatamanager';
import UserDataManager from '../../Data/UserDataManager';
import { AudioManager } from '../../Base/AudioManager';
import { ResUnfreezePowerRecord } from '../../Net/Shared/protocols/user/PtlUnfreezePowerRecord';
import { TsrpcError } from 'tsrpc-browser';
import { TsRpc } from '../../Net/TsRpc';
import { ToastManager } from '../UI/ToastManager';
import { PopViewManager } from '../UI/Notice/PopViewManager';
const { ccclass, property } = _decorator;


@ccclass('PkGameRender')
export class PkGameRender extends Component {

    @property(Prefab)
    popViewPrefab: Prefab = null;

    private _teamNameLabel: Label = null;
    private _myPowerLabel: Label = null;
    private _enemyPowerLabel: Label = null;
    private _msgLabel: Label = null;
    private popBtnNode: Node = null;//返回
    private confirmBtnNode: Node = null;
    private iconNode: Node = null;

    private IsInRequesting: boolean = false;


    protected onLoad(): void {
        const popNode = this.node.getChildByName('pop');
        this._teamNameLabel = popNode.getChildByName('team_name').getChildByName('value').getComponent(Label);
        this._myPowerLabel = popNode.getChildByName('my_power').getChildByName('value').getComponent(Label);
        this._enemyPowerLabel = popNode.getChildByName('enemy_power').getChildByName('value').getComponent(Label);
        this._msgLabel = popNode.getChildByName('msg').getChildByName('value').getComponent(Label);

        this.popBtnNode = popNode.getChildByName('popBtn');
        this.confirmBtnNode = popNode.getChildByName('useRescurrBtn');
        this.iconNode = popNode.getChildByName('icon');
        this._teamNameLabel.string = TeamInfoManager.Instance.TeamInfo.name ? TeamInfoManager.Instance.TeamInfo.name : '获取队伍名失败';

        //通知刷新usercard和底部
        EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo, true);

        this.doRender();

        UIButtonUtil.initBtn(this.popBtnNode, () => {
            GameDataManager.Instance._reset();

            EventManager.Instance.emit(EVENT_ENUM.HidePkGame);
            //播放背景音乐
            AudioManager.Instance.play(MUSIC_PATH_ENUM.bgFight).catch(err => {
                console.warn('播放背景音乐失败:', err);
            });

        });



        //通知home首页 重新渲染 第二个参数是判断是否需要登陆
        EventManager.Instance.emit(EVENT_ENUM.ShowHome, true);

        // 增加刷新usercard信息 在ShowHome中 请求到用户信息了 发送通知
        // EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo);

        // 重新渲染队伍信息和首页 主要是为了更新队伍信息
        EventManager.Instance.emit(EVENT_ENUM.ToCreateTeam, false);

        //_reset
    }





    doRender() {

        const gameResultdata = GameDataManager.Instance.GameResult;
        const myTeamIndex = GameDataManager.Instance.MyTeamIndex;
        const enemyTeamIndex = GameDataManager.Instance.EnemyTeamIndex;
        this._myPowerLabel.string = `${gameResultdata.powerInfo[myTeamIndex]}`;
        this._enemyPowerLabel.string = `${gameResultdata.powerInfo[enemyTeamIndex]}`;
        this._msgLabel.string = gameResultdata.msg;

        // console.log('MyTeamIndex = ', GameDataManager.Instance.MyTeamIndex);
        // console.log('EnemyTeamIndex = ', GameDataManager.Instance.EnemyTeamIndex);
        if (gameResultdata.winIndex == GameDataManager.Instance.MyTeamIndex) {
            this.iconNode.getChildByName('success').active = true;
            this.iconNode.getChildByName('fail').active = false;
        } else if (gameResultdata.winIndex == GameDataManager.Instance.EnemyTeamIndex) {

            this.iconNode.getChildByName('success').active = false;
            this.iconNode.getChildByName('fail').active = true;
        } else {

            this.iconNode.getChildByName('success').active = false;
            this.iconNode.getChildByName('fail').active = false;
        }

        if (gameResultdata.playerStatus.isdie == 1) {
            //淘汰了 现实2个按钮
            UIButtonUtil.initBtn(this.confirmBtnNode, () => {
                const popV = instantiate(this.popViewPrefab);
                this.node.addChild(popV);
                const manager = popV.getComponent(PopViewManager);
                manager.messageText = '复活当前任务，即将取消上条复活记录，是否确认?"';
                if (manager?.confirmLabel) {
                    manager.confirmLabel.string = '确定';
                } else {
                    console.warn('PopViewManager 或 confirmLabel 未设置');
                }
                manager.confirmBlock = async () => {
                    if (this.IsInRequesting) {
                        return;
                    }
                    this.IsInRequesting = true;

                    const resUnfreezePowerRecord = await this.requestFreePower(gameResultdata.eliminationRecordId);
                    if (!resUnfreezePowerRecord) {

                        return;
                    }
                    ToastManager.showToast('复活成功');
                    this.scheduleOnce(() => {
                        popV.destroy();
                        GameDataManager.Instance._reset();
                        EventManager.Instance.emit(EVENT_ENUM.HidePkGame);
                        //播放背景音乐
                        AudioManager.Instance.play(MUSIC_PATH_ENUM.bgFight).catch(err => {
                            console.warn('播放背景音乐失败:', err);
                        });
                    }, 2);
                };
                // manager.cancelBlock = () => {
                // };

            });

        } else {
            //没淘汰 现实一个返回
            this.confirmBtnNode.active = false;
            this.popBtnNode.getComponent(Widget).horizontalCenter = 0;
        }

    }

    async requestFreePower(recordid: number): Promise<ResUnfreezePowerRecord> {
        const data = await TsRpc.Instance.Client.callApi('user/UnfreezePowerRecord', { recordId: recordid, __ssoToken: UserDataManager.Instance.SsoToken })
        this.IsInRequesting = false;
        if (!data.isSucc) {
            console.log('data = ', data);
            ToastManager.showToast(data.err.message ? '复活失败111 ' + data.err.message : '复活失败111');
            return;
        }
        //复活成功 扣掉复活币
        UserDataManager.Instance.delBag(5);

        UserDataManager.Instance.UserInfo.freezePower = data.res.newFreezePower;
        EventManager.Instance.emit(EVENT_ENUM.UpdateUserInfo);
        return data.res;

    }

    update(deltaTime: number) {

    }




}


