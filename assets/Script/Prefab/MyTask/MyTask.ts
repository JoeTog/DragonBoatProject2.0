import { _decorator, Component, instantiate, Label, Node, Prefab, ProgressBar } from 'cc';
import { UIButtonUtil } from '../../Base/UIButtonUtil';
import { loadingManager } from '../UI/LoadingManager';
import { IShopItem } from '../../Net/Shared/models/Interfaces';
import { rewardViewRender } from './rewardViewRender';
import EventManager from '../../Base/EventManager';
import { EVENT_ENUM, popType, PREFAB_PATH_ENUM } from '../../Data/Enum';
const { ccclass, property } = _decorator;

@ccclass('MyTask')
export class MyTask extends Component {


    @property(Prefab)
    dailyTaskItem: Prefab = null;
    @property(Prefab)
    weekTaskItem: Prefab = null;

    @property(Node)
    contentViewNode: Node = null;

    @property(Label)
    totalCountlabel: Label = null;
    @property(ProgressBar)
    progressBar: ProgressBar = null;


    //每日任务未选中
    @property(Node)
    dailyUnChosed: Node = null;
    //每日任务选中
    @property(Node)
    dailyChosed: Node = null;
    //每周任务未选中
    @property(Node)
    weekUnChosed: Node = null;
    //每周任务选中
    @property(Node)
    weekChosed: Node = null;
    //每月任务未选中
    @property(Node)
    monthUnChosed: Node = null;
    //每月任务选中
    @property(Node)
    monthChosed: Node = null;




    //第一个宝箱
    @property(Node)
    firstLightBox: Node = null;
    //第二个宝箱
    @property(Node)
    secLightBox: Node = null;
    //第三个宝箱
    @property(Node)
    threeLightBox: Node = null;
    //第四个宝箱
    @property(Node)
    fouthLightBox: Node = null;
    //第五个宝箱
    @property(Node)
    fifthLightBox: Node = null;
    //一键领取
    @property(Node)
    pickUpbtn: Node = null;






    protected onLoad(): void {


        this.doRender();



    }

    doRender() {
        this.dailyUnChosed.name = 'dailyUnChosed';
        UIButtonUtil.initBtn(this.dailyUnChosed, () => {
            this.doChosedTaskBtn(this.dailyUnChosed);
            this.doRenderDailytask();
        });
        this.weekUnChosed.name = 'weekUnChosed';
        UIButtonUtil.initBtn(this.weekUnChosed, () => {
            this.doChosedTaskBtn(this.weekUnChosed);
            this.doRenderWeektask();
        });
        this.monthUnChosed.name = 'monthUnChosed';
        UIButtonUtil.initBtn(this.monthUnChosed, () => {
            this.doChosedTaskBtn(this.monthUnChosed);
            this.doRenderMonthtask();
        });
        this.doChosedTaskBtn(this.dailyUnChosed);
        loadingManager.hideLoading();

        const closeNode = this.node.getChildByName('Root').getChildByName('close');
        UIButtonUtil.initBtn(closeNode, () => {
            this.node.destroy();
        });


        this.doTotalProgress();
    }

    //总完成进度
    doTotalProgress() {
        let count = Math.random();
        console.log('count = ', count);
        this.progressBar.progress = count;
        this.totalCountlabel.string = `${Math.round(count * 100)}`;


    }


    doRenderDailytask() {
        this.contentViewNode.destroyAllChildren();
        //网络请求
        const dailytaskList = [1, 2, 3, 4, 4, 5, 6];
        for (let index = 0; index < dailytaskList.length; index++) {
            const element = dailytaskList[index];
            const dailyTaskItem = instantiate(this.dailyTaskItem);
            const progress: ProgressBar = dailyTaskItem.getChildByName('Root').getChildByName('ProgressBar').getComponent(ProgressBar);
            const logoIcon = dailyTaskItem.getChildByName('Root').getChildByName('Logo').getChildByName('LogoIcon');
            const logoIconFinish = dailyTaskItem.getChildByName('Root').getChildByName('Logo').getChildByName('LogoIconFinish');
            const titleLabel = dailyTaskItem.getChildByName('Root').getChildByName('messageDetail').getChildByName('title').getComponent(Label);
            const progressLabel = dailyTaskItem.getChildByName('Root').getChildByName('messageDetail').getChildByName('progressNode').getChildByName('value').getComponent(Label);
            const descriptionLabel = dailyTaskItem.getChildByName('Root').getChildByName('messageDetail').getChildByName('description').getComponent(Label);
            const rewardicon = dailyTaskItem.getChildByName('Root').getChildByName('reward').getChildByName('icon');
            const goBtn = dailyTaskItem.getChildByName('Root').getChildByName('actionBtn').getChildByName('GoBtn');
            const pickUpBtn = dailyTaskItem.getChildByName('Root').getChildByName('actionBtn').getChildByName('pickUpBtn');
            const isSuccess = Math.random() < 0.5;
            if (isSuccess) {
                goBtn.active = true;
            } else {
                pickUpBtn.active = true;
            }

            progress.progress = Math.random();


            this.contentViewNode.addChild(dailyTaskItem);
        }
    }

    doRenderWeektask() {
        this.contentViewNode.destroyAllChildren();
        //网络请求
        const weeektaskList = [1, 2, 3, 4, 4, 5, 6];
        for (let index = 0; index < weeektaskList.length; index++) {
            const element = weeektaskList[index];
            const weekTaskItem = instantiate(this.weekTaskItem);
            const progress: ProgressBar = weekTaskItem.getChildByName('Root').getChildByName('ProgressBar').getComponent(ProgressBar);
            const logoIcon = weekTaskItem.getChildByName('Root').getChildByName('Logo').getChildByName('LogoIcon');
            const logoIconFinish = weekTaskItem.getChildByName('Root').getChildByName('Logo').getChildByName('LogoIconFinish');
            const titleLabel = weekTaskItem.getChildByName('Root').getChildByName('messageDetail').getChildByName('title').getComponent(Label);
            const progressLabel = weekTaskItem.getChildByName('Root').getChildByName('messageDetail').getChildByName('progressNode').getChildByName('value').getComponent(Label);
            const descriptionLabel = weekTaskItem.getChildByName('Root').getChildByName('messageDetail').getChildByName('description').getComponent(Label);
            // const rewardiconContentV = dailyTaskItem.getChildByName('Root').getChildByName('rewardScrollV').getChildByName('view').getChildByName('content');
            const goBtn = weekTaskItem.getChildByName('Root').getChildByName('actionBtn').getChildByName('GoBtn');
            const pickUpBtn = weekTaskItem.getChildByName('Root').getChildByName('actionBtn').getChildByName('pickUpBtn');
            const isSuccess = Math.random() < 0.5;
            if (isSuccess) {
                goBtn.active = true;
            } else {
                pickUpBtn.active = true;
            }
            progress.progress = Math.random();

            const rewardV = weekTaskItem.getComponent(rewardViewRender);
            // const failItem: IShopItem = {
            //     id: 20, name: '双桨', price: 0, status: 0, use: 0,
            //     desc: '每次划桨，任务次数1.1倍'
            // }
            rewardV.rewardDataList = [{
                id: 21, name: '', price: 0, status: 0, use: 0,
                desc: ''
            }, {
                id: 31, name: '', price: 0, status: 0, use: 0,
                desc: ''
            }, {
                id: 46, name: '', price: 0, status: 0, use: 0,
                desc: ''
            }, {
                id: 44, name: '', price: 0, status: 0, use: 0,
                desc: ''
            }];

            UIButtonUtil.initBtn(pickUpBtn, () => {
                EventManager.Instance.emit(EVENT_ENUM.RenderHomePop, {
                    prefab_url: PREFAB_PATH_ENUM.PickUpReward,
                    source: popType.null
                });
            });
            this.contentViewNode.addChild(weekTaskItem);
        }
    }

    doRenderMonthtask() {

    }

    doChosedTaskBtn(chosedbtn: Node) {
        if (chosedbtn.name.includes('dailyUnChosed')) {
            this.doRenderDailytask();
            this.dailyChosed.active = true;
            this.dailyUnChosed.active = false;
            this.weekUnChosed.active = true;
            this.weekChosed.active = false;
            this.monthUnChosed.active = true;
            this.monthChosed.active = false;
        } else if (chosedbtn.name.includes('weekUnChosed')) {
            this.dailyChosed.active = false;
            this.dailyUnChosed.active = true;
            this.weekUnChosed.active = false;
            this.weekChosed.active = true;
            this.monthUnChosed.active = true;
            this.monthChosed.active = false;
        } else if (chosedbtn.name.includes('monthUnChosed')) {
            this.dailyChosed.active = false;
            this.dailyUnChosed.active = true;
            this.weekUnChosed.active = true;
            this.weekChosed.active = false;
            this.monthUnChosed.active = false;
            this.monthChosed.active = true;
        }

    }

    update(deltaTime: number) {

    }

}

