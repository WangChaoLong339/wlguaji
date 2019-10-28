cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        this.root = this.node.PathChild("Root")
        this.bg = this.node.PathChild("Bg")
    },

    init: function (info) {
        let node = cc.instantiate(this.bg)
        node.PathChild('Info', cc.Label).string = info
        this.root.addChild(node)
        node.runAction(new cc.Sequence(
            cc.delayTime(1),
            cc.fadeOut(0.5),
            cc.callFunc(() => { this.root.removeChild(node) }),
        ))
    },
});
