import { _decorator, Component, Node, tween, v3, Vec3, UITransform } from 'cc';
import { pushNoticeRender } from './pushNoticeRender';
const { ccclass, property } = _decorator;

@ccclass('textScroller')
export class textScroller extends Component {

    @property(Node)
    container: Node = null!;

    @property
    duration: number = 0.5;

    scrollDistance = 51 + 30;

    startPosition: Vec3 = v3(0, 0, 0);
    infoLength: number = 0; // 内容数量
    num: number = 1; // 当前显示的节点索引


    async start() {
        await this.container.getComponent(pushNoticeRender).render();
        this.scheduleOnce(() => {
            this.updateScrollDistance();
            this.startPosition = this.container.getPosition();
            this.infoLength = this.container.children.length;
            this.schedule(() => {
                this.anim();
                this.num++;
            }, 3);
        }, 1);
    }

    resetPosition() {
        this.container.setPosition(this.startPosition);
    }

    private updateScrollDistance() {
        if (!this.container || this.container.children.length === 0) {
            return;
        }

        if (this.container.children.length >= 2) {
            const first = this.container.children[0];
            const second = this.container.children[1];
            const distance = Math.abs(second.position.y - first.position.y);
            if (distance > 0) {
                this.scrollDistance = distance;
                return;
            }
        }

        const firstChild = this.container.children[0];
        const transform = firstChild.getComponent(UITransform);
        if (transform) {
            this.scrollDistance = transform.height;
        }
    }

    anim() {
        const pos = this.container.getPosition();
        tween(this.container)
            .to(
                this.duration,
                { position: v3(pos.x, pos.y + this.scrollDistance, 0) },
                { easing: "linear" }
            )
            .call(() => {
                if (this.num % this.infoLength == 0) {
                    this.resetPosition();
                    this.num = 1;
                }
            })
            // .call(() => {
            //   // 动画完成后，将第一个子节点移动到最后
            //   this.resetPosition();
            //   this.startInfiniteScroll(); // 循环滚动
            // })
            .start();
    }

}

