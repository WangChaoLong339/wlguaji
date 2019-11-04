cc.Class({
    extends: cc.Component,

    properties: {
        idxs: [cc.SpriteFrame],
    },

    onLoad: function () {
    },

    init: function () {
    },

    setSpriteMulti: function (idx) {
        if (idx >= this.idxs.length) {
            cc.error(`idx${idx} is illegal`)
        }
        this.node.getComponent(cc.Sprite).spriteFrame = this.idxs[idx]
    },
});
