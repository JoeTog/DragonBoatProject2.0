import { _decorator, Color, Component, instantiate, Label, Node, Prefab, Root, Sprite, SpriteFrame, Vec3 } from 'cc';
import { TsRpc } from '../../Net/TsRpc';
import { TeamInfoManager } from '../../Data/TeamInfoManager';
import { IPlayer } from '../../Net/Shared/models/Interfaces';
import { BigNumUtils, loadAvatar, truncateString } from '../../Base/Utils';
import { IMG_URL_EXTRA_PARAM } from '../../Config';
import UserDataManager from '../../Data/UserDataManager';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, GameStatus } from '../../Data/Enum';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { ToastManager } from '../UI/ToastManager';
import { ReqPing } from '../../Net/Shared/protocols/common/ReqPing';
import { GameDataManager } from '../../Data/GameDatamanager';
const { ccclass, property } = _decorator;

@ccclass('TeammembersRender')
export class TeammembersRender extends Component {


    @property(Prefab)
    memberItem: Prefab = null;
    @property(Prefab)
    PersonalMoney: Prefab = null;

    @property(Node)
    contentView: Node = null;

    @property(Label)
    teamNameLabel: Label = null;
    @property(Node)
    powerTotalNode: Node = null;
    @property(Label)
    memberCountLabel: Label = null;
    @property(Node)
    quitBtn: Node = null;

    //武力值icon 冻结时需要显示为灰色
    // private powerIcon: Node = null;

    //次数红心
    // private redFirstNode: Node = null;
    // private redSecNode: Node = null;
    // private redThreeNode: Node = null;
    // private redFouthNode: Node = null;
    // private redFifthNode: Node = null;


    protected onLoad(): void {

        if (!this.contentView) {
            this.contentView = this.node.getChildByName('contentView');
            if (!this.contentView) {
                console.error('TeammembersRender: 未找到 contentView 节点，请检查预制体结构或在编辑器中赋值');
            }
        }

        EventManager.Instance.on(EVENT_ENUM.DelTeammember, this.delMember, this);
        EventManager.Instance.on(EVENT_ENUM.AddTeamMember, this.addMember, this);
        EventManager.Instance.on(EVENT_ENUM.RefreshTeammember, this.refreshMember, this);
        EventManager.Instance.on(EVENT_ENUM.UpdateIsDie, this.updateMyDie, this);
        EventManager.Instance.on(EVENT_ENUM.TeamPowerUpdate, this.showDetailRender, this);

        this.doSender();
        this.refreshMember();
        this.showDetailRender();
        if (TeamInfoManager.Instance.TeamInfo.captainUid == UserDataManager.Instance.UserInfo.uid) {
        } else {
            this.powerTotalNode.active = false;
        }

        GameDataManager.Instance.setGameStatus(GameStatus.NORMAL);


    }

    doSender() {
        const personalMoney = instantiate(this.PersonalMoney);
        this.node.addChild(personalMoney);
    }

    //赋值队伍总武力值
    showDetailRender() {
        const totalPowerLabel = this.powerTotalNode.getChildByName('powerValue');
        totalPowerLabel.getComponent(Label).string = `${BigNumUtils.getNumberStringWan(TeamInfoManager.Instance.TeamInfo.allPowerCur)}`;

        if (this.teamNameLabel) {
            const rawName = TeamInfoManager.Instance.TeamInfo.name ?? '';
            const displayName = rawName.length > 5 ? `${rawName.slice(0, 5)}...` : rawName;
            this.teamNameLabel.getComponent(Label).string = displayName;
        }
        if (this.memberCountLabel) {
            this.memberCountLabel.getComponent(Label).string = `${TeamInfoManager.Instance.TeamInfo.playersCount}/${TeamInfoManager.Instance.TeamInfo.maxCount}`;
        }

        if (this.quitBtn) {
            if (TeamInfoManager.Instance.IsCaptainInTeam) {
                const value = this.quitBtn.getChildByName('value');
                value.getComponent(Label).string = '解散队伍';
            } else {
                const value = this.quitBtn.getChildByName('value');
                value.getComponent(Label).string = '退出队伍';
            }
            UIButtonUtil.initBtn(this.quitBtn, () => {
                this.exitTeam();
            });
        }
    }

    //收到队伍状态改变
    teamStatusChange() {

    }

    updateMyDie() {
        if (!this.contentView) {
            console.warn('TeammembersRender: contentView 未初始化');
            return;
        }
        const userInfo = UserDataManager.Instance.UserInfo;
        // let needUpdateName = "member" + userInfo.uid;
        let needUpdateName = `member${userInfo.uid}`;
        for (let i = 0; i < this.contentView.children.length; i++) {
            const element = this.contentView.children[i];
            if (element.name == needUpdateName) {
                element.getChildByName("eliminate").active = userInfo.isdie === 1;
                break
            }
        }
    }

    addMember(index: number, member?: IPlayer) {
        //刷新列表
        // this.doRender();
        // return;
        console.log('index = ', index)
        if (index < 0 && member) {
            //刷新列表
            // this.doRender();
            this.renderOne(member);

        } else {
            //复活或者刷新武力值
            const memberItem = this.contentView.children[index];
            // const dieNode = memberItem.getChildByName('die');
            // if (dieNode) {
            //     if (member.isdie) {
            //         dieNode.active = true;
            //     } else {
            //         dieNode.active = false;
            //     }
            // }
            const root = memberItem.getChildByName('Root')
            const powerLabelNode = root.getChildByName('powerLabel')?.getChildByName('label');
            if (powerLabelNode) {
                const powerLabelComp = powerLabelNode.getComponent(Label);
                if (powerLabelComp) {
                    powerLabelComp.string = `${BigNumUtils.getNumberStringWan(member.power)}`;
                }
            }

        }
    }

    delMember(uid: number) {
        if (!this.contentView) {
            console.warn('TeammembersRender: contentView 未初始化');
            return;
        }
        if (uid == UserDataManager.Instance.UserInfo.uid) {
            //第一个参数 是否队长关闭队伍
            TeamInfoManager.Instance.closeteam(false);
            return;
        }

        //刷新列表
        // this.doRender();
        // return;

        let needDelName = 'member' + `${uid}`;
        for (let i = 0; i < this.contentView.children.length; i++) {
            const element = this.contentView.children[i];
            if (element.name == needDelName) {
                element.destroy();
                break;
            }

        }

    }

    //刷新成员
    refreshMember() {
        this.contentView.destroyAllChildren();
        const memberData = TeamInfoManager.Instance.TeamInfo.players;
        // console.log('memberData = ',memberData);
        let i = 0;
        const render = () => {
            if (i < memberData.length) {
                this.renderOne(memberData[i]);
                i++;
            } else {
                this.unschedule(render);
            }

        }
        this.schedule(render, 0.01);
    }

    renderOne(member: IPlayer) {
        const memberItemLocal = instantiate(this.memberItem);
        memberItemLocal.name = 'member' + `${member.user.uid}`;

        const disableNode = memberItemLocal.getChildByName('eliminate');
        const Root = memberItemLocal.getChildByName('Root');
        const avatarImgNode = Root.getChildByName('avatar')?.getChildByName('mask')?.getChildByName('img');
        const avatarNode = avatarImgNode ? avatarImgNode.getComponent(Sprite) : null;
        const memberNamelabel = Root.getChildByName('nameLabel')?.getComponent(Label);
        const powerLabel = Root.getChildByName('powerLabel')?.getComponent(Label);
        const winLabel = Root.getChildByName('rateLabel')?.getComponent(Label);

        //游戏次数
        const red = Root.getChildByName('remain').getChildByName('red');
        let redFirstNode:Node = null;
        let redSecNode:Node = null;
        let redThreeNode:Node = null;
        let redFouthNode:Node = null;
        let redFifthNode:Node = null;
        redFirstNode = red.getChildByName('Sprite');
        redSecNode = red.getChildByName('SpriteSec');
        redThreeNode = red.getChildByName('SpriteThree');
        redFouthNode = red.getChildByName('SpriteFouth');
        redFifthNode = red.getChildByName('SpriteFifth');
        // const retainLabel = memberItemLocal.getChildByName('remain')?.getChildByName('label')?.getComponent(Label);

        const dzNode = Root?.getChildByName('capitainBg');
        const dyNode = Root?.getChildByName('memberBg');
        const meBgNode = Root?.getChildByName('meBg');
        const disableBtnNode = memberItemLocal.getChildByName('close');

        if (disableNode) {
            if (member.isdie) {
                disableNode.active = true;
            } else {
                disableNode.active = false;
            }
        }
        loadAvatar(member.user.avatar + IMG_URL_EXTRA_PARAM).then((res: SpriteFrame) => {
            // 检查节点和 SpriteFrame 是否有效
            if (avatarNode && avatarNode.isValid && res && memberItemLocal && memberItemLocal.isValid) {
                avatarNode.spriteFrame = res;
            } else {
                console.warn('TeammembersRender: 无法设置头像，节点或 SpriteFrame 无效', {
                    avatarNode: !!avatarNode,
                    avatarNodeValid: avatarNode?.isValid,
                    res: !!res,
                    memberItemValid: memberItemLocal?.isValid
                });
            }
        }).catch((err) => {
            console.error('TeammembersRender: 加载头像失败', err);
        })

        // teamNamelabel.string = member.user.nickname;
        // member.user.nickname += '亲亲亲';
        if (memberNamelabel) {
            memberNamelabel.string = truncateString(member.user.nickname);
        }

        if (powerLabel) {
            powerLabel.string = `${BigNumUtils.getNumberStringWan(member.power)}`;
        }

        let winNum = (member.win_games / member.total_games) * 100;
        if (member.win_games == 0 || member.total_games == 0) {
            winNum = 0;
        } else if (winNum >= 100) {
            winNum = 100;
        }
        if (winLabel) {
            winLabel.string = `${winNum.toFixed(2)}` + '%';
        }
        // if (retainLabel) {
        //     retainLabel.string = `${member.times_max - member.times}`;
        // }
        //游戏次数相关
        const remainTimes = member.times_max - member.times;
        if (remainTimes == 0) {
        } else if (remainTimes == 1) {
            redFirstNode.active = true;
        } else if (remainTimes == 2) {
            redFirstNode.active = true;
            redSecNode.active = true;
        } else if (remainTimes == 3) {
            redFirstNode.active = true;
            redSecNode.active = true;
            redThreeNode.active = true;
        } else if (remainTimes == 4) {
            redFirstNode.active = true;
            redSecNode.active = true;
            redThreeNode.active = true;
            redFouthNode.active = true;
        } else if (remainTimes == 5) {
            redFirstNode.active = true;
            redSecNode.active = true;
            redThreeNode.active = true;
            redFouthNode.active = true;
            redFifthNode.active = true;
        }
        if (dzNode && dyNode) {
            if (member.uid == TeamInfoManager.Instance.TeamInfo.id) {
                dzNode.active = true;
            } else {
                dyNode.active = true;
            }
        }
        if (disableBtnNode) {
            if (TeamInfoManager.Instance.TeamInfo.id == UserDataManager.Instance.UserInfo.uid && member.uid != UserDataManager.Instance.UserInfo.uid) {
                disableBtnNode.active = true;
            } else {
                disableBtnNode.active = false;
            }
        }
        if (meBgNode) {
            if ( member.uid == UserDataManager.Instance.UserInfo.uid) {
                meBgNode.active = true;
            }
        }

        if (disableBtnNode) {
            UIButtonUtil.initBtn(disableBtnNode, () => {
                //  踢人
                this.disablemember(member.uid, member.user.nickname);
            });
        }

        if (!this.contentView) {
            console.error('TeammembersRender: contentView 未初始化，无法添加成员节点');
            return;
        }
        this.contentView.addChild(memberItemLocal);


    }

    //踢人
    async disablemember(memberid: number, name: string) {
        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法踢人');
            ToastManager.showToast('网络连接异常，请稍后重试【踢人】');
            return;
        }
        const data = await TsRpc.Instance.Client.callApi('team/Kick', { uid: memberid, __ssoToken: UserDataManager.Instance.SsoToken })
        if (!data.isSucc) {
            // ToastManager.showToast('踢人失败 '+data?.err?.message);
            ToastManager.showToast('踢人失败 ' + data.err.message);
            //刷新列表
            this.refreshMember();
            return;
        } else {
            // ToastManager.showToast('成功踢出[' + name + ']');
            ToastManager.showToast(`成功踢出 [${name}]`);
        }


    }

    async exitTeam() {

        if (!TsRpc.Instance.Client || !TsRpc.Instance.Client.isConnected) {
            console.warn('WebSocket 未连接，无法停止匹配');
            ToastManager.showToast('网络连接异常，请稍后重试【退出队伍】');
            return;
        }
        const data = await TsRpc.Instance.Client.callApi('team/LeaveTeam', { __ssoToken: UserDataManager.Instance.SsoToken });
        if (!data.isSucc) {
            ToastManager.showToast('退出队伍失败 ' + data.err.message);
            //TeamInfoManager.Instance.closeteam(false);
            return;
        }
    }


    protected onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.DelTeammember, this.delMember, this);
        EventManager.Instance.off(EVENT_ENUM.AddTeamMember, this.addMember, this);
        EventManager.Instance.off(EVENT_ENUM.UpdateIsDie, this.updateMyDie);
        EventManager.Instance.off(EVENT_ENUM.TeamPowerUpdate, this.showDetailRender);
        EventManager.Instance.off(EVENT_ENUM.RefreshTeammember, this.refreshMember);
        this.unscheduleAllCallbacks();
    }



    update(deltaTime: number) {

    }



}

