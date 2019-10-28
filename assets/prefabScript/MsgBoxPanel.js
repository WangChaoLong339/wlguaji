cc.Class({
    extends: cc.Component,

    properties: {
        root: cc.Node,
    },

    onLoad: function () {
    },

    init: function (info) {
        this.show(info)
    },

    show: function (info) {
        this.root.PathChild('title', cc.Label).string = info.title
        this.root.PathChild('val', cc.Label).string = info.val
        this.root.PathChild('btn/btn1/val', cc.Label).string = info.btn1name || '确认'
        this.root.PathChild('btn/btn2/val', cc.Label).string = '取消'
        this.btn1 = info.btn1
    },

    btnBtn1: function () {
        this.btn1()
        UiMgr.hide(this.node.name)
    },

    btnBtn2: function () {
        UiMgr.hide(this.node.name)
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
