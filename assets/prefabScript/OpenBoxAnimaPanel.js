cc.Class({
    extends: cc.Component,

    properties: {
        openBoxAnim: cc.Node,
    },

    onLoad: function () {
    },

    init: function (info) {
        this.cb = info.cb
        this.show(info.propId)
    },

    show: function (propId) {
        // 道具位置初始化
        this.openBoxAnim.PathChild('Mask/Grade').setPosition(-29.6, -100)
        // 箱子状态初始化
        SetSpriteFrame('backpack/box_close', this.openBoxAnim.getComponent(cc.Sprite))
        // 箱子位置初始化
        this.openBoxAnim.setPosition(0, cc.winSize.height / 2)
        // 箱子透明度初始化
        this.openBoxAnim.opacity = 255
        // 箱子可见性初始化
        this.openBoxAnim.active = true
        // 根节点可见性
        this.node.active = true
        // 动画
        this.openBoxAnim.runAction(cc.sequence(
            // 箱子掉下来
            cc.moveTo(0.5, 0, 0).easing(cc.easeBounceOut()),
            // 停顿0.5s
            cc.delayTime(0.5),
            // 摇一摇
            cc.repeat(cc.sequence(
                cc.rotateBy(0.03, 5),
                cc.rotateBy(0.03, -10),
                cc.rotateBy(0.03, 5),
            ), 10),
            cc.callFunc(() => {
                // 箱子打开
                SetSpriteFrame('backpack/box_open', this.openBoxAnim.getComponent(cc.Sprite))
                SetSpriteFrame(`grade/${PropList[propId].grade}`, this.openBoxAnim.PathChild('Mask/Grade', cc.Sprite))
                SetSpriteFrame(`prop/${propId}`, this.openBoxAnim.PathChild('Mask/Grade/Prop', cc.Sprite))
                this.openBoxAnim.PathChild('Mask/Grade/val').color = GradeToColor(PropList[propId].grade)
                this.openBoxAnim.PathChild('Mask/Grade/val', cc.Label).string = PropList[propId].name
                this.openBoxAnim.PathChild('Mask/Grade').runAction(cc.sequence(
                    // 停顿0.2s
                    cc.delayTime(0.2),
                    // 道具飘出来
                    cc.moveTo(1, 12, 55.3).easing(cc.easeBackOut()),
                    // 停顿0.2s
                    cc.delayTime(1),
                    cc.callFunc(() => {
                        this.openBoxAnim.runAction(cc.sequence(
                            // 箱子渐隐
                            cc.fadeOut(1),
                            cc.callFunc(() => {
                                this.openBoxAnim.active = false
                                this.node.active = false
                                if (this.cb) {
                                    this.cb()
                                }
                            }),
                        ))
                    }),
                ))
            }),
        ))
    },
});
