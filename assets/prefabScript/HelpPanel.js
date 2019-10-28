cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function () {
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
