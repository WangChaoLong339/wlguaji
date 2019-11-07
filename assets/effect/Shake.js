cc.Class({
    extends: cc.Component,

    properties: {
        duration: 1,
        scaleX: 1,
        scaleY: 1,
        pause: 0,
    },

    onLoad: function () {
    },

    init: function (info) {
    },

    play: function () {
        this.node.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(this.duration, this.scaleX, this.scaleY),
            cc.scaleTo(this.duration, 1, 1),
            cc.delayTime(this.pause),
        )))
    },
});
