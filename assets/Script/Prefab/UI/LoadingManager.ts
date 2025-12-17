import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('loadingManager')
export class loadingManager extends Component {
    
    @property ({type:Prefab})
    public LoadingPrefab :Prefab = null;

    private static instance:loadingManager = null;
    private _loadingNode :Node = null;
    private _showTimer: number | null = null;
    private readonly _defaultDelay = 500;
    private _pendingDelay = this._defaultDelay;

    protected onLoad(): void {
        loadingManager.instance = this;
    }
    
public static showLoading(){
    if (loadingManager.instance) {
        loadingManager.instance.show();
    }
    
}

public static showLoadingImmediately(){
    if (loadingManager.instance) {
        loadingManager.instance._pendingDelay = 0;
        loadingManager.instance.show();
    }
}

public static hideLoading(){
    if (loadingManager.instance) {
        loadingManager.instance.hide();
    }
}

private show(){
    if (!this.LoadingPrefab) {
        console.error('Toast 预制体未设置');
        return;
    }

    if (this._loadingNode || this._showTimer !== null) {
        return;
    }

    const delay = this._pendingDelay;
    this._pendingDelay = this._defaultDelay;

    this._showTimer = setTimeout(() => {
        this._showTimer = null;
        if (this._loadingNode) {
            return;
        }
        this._loadingNode = instantiate(this.LoadingPrefab);
        this.node.addChild(this._loadingNode);
    }, delay);
}

private hide(){
    if (this._showTimer !== null) {
        clearTimeout(this._showTimer);
        this._showTimer = null;
    }

    if(this._loadingNode){
        this._loadingNode.destroy();
        this._loadingNode = null;
    }

}

protected onDestroy(): void {
    if (this._showTimer !== null) {
        clearTimeout(this._showTimer);
        this._showTimer = null;
    }
    if (this._loadingNode) {
        this._loadingNode.destroy();
        this._loadingNode = null;
    }
}



}


