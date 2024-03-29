cc.Class({
    extends: cc.Component,

    properties: {
        curseLv: cc.Sprite,
        curseIcon: cc.Sprite,
        curseName: cc.Label,
        xingRoot: cc.Node,
        currency: cc.Label,
        consume: cc.Label,

        xxRoot: cc.Node,
    },

    onLoad: function () {
        this.curseInfo = [
            { lv: 1, name: '圣妖诅咒۰余烬', consume: 500000, },
            { lv: 2, name: '圣妖诅咒۰焚身', consume: 1000000, },
            { lv: 3, name: '圣妖诅咒۰蚀炎', consume: 1500000, },
            { lv: 4, name: '圣妖诅咒۰狂暴', consume: 2000000, },
            { lv: 5, name: '圣妖诅咒۰史诗', consume: 3000000, },
            { lv: 6, name: '圣妖诅咒۰神圣', consume: 4000000, },
            { lv: 7, name: '圣妖诅咒۰洪荒', consume: 0, },
        ]

        // 诅咒之心动画
        this.curseIcon.node.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(0.8, 0, 30),
            cc.moveBy(0.8, 0, -30),
        )))
    },

    init: function () {
        this.show()
    },

    show: function () {
        // 当前诅咒等级
        SetSpriteFrame(`wing/${player.curse.lv}`, this.curseLv)
        // // 当前诅咒icon TODO 需要找相关的资源图片
        // SetSpriteFrame(`curse/${player.curse.lv}`, this.curseIcon)
        // 当前诅咒等级名称
        this.curseName.string = this.curseInfo[player.curse.lv - 1].name
        // 单次消耗
        this.consume.string = this.curseInfo[player.curse.lv - 1].consume
        // 金币
        this.currency.string = player.coin
        // 显示当前的星星数量
        for (var i = 0; i < this.xxRoot.children.length; i++) {
            let node = this.xxRoot.children[i]
            if (i < player.curse.xingCount) {
                node.getComponent('SpriteMulti').setSpriteMulti(1)
            } else {
                node.getComponent('SpriteMulti').setSpriteMulti(0)
            }
        }
    },

    btnForging: function () {
        let consume = this.curseInfo[player.curse.lv - 1].consume
        if (player.coin < consume) {
            UiMgr.show('MsgBoxAutoHidePanel', '[金币]不足')
            return
        }
        player.coin -= consume
        player.curse.xingCount++
        if (player.curse.xingCount > 10) {
            player.curse.xingCount = 0
            player.curse.lv++
        }
        this.show()
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
