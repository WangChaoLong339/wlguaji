cc.Class({
    extends: cc.Component,

    properties: {
        wingRoot: cc.Node,
        feather: cc.Node,
        bottom: cc.Node,
    },

    onLoad: function () {
        this.wingInfo = [
            { lv: 0, name: '' },
            { lv: 1, name: '无光之翼' },
            { lv: 2, name: '霓霞幻影' },
            { lv: 3, name: '修罗夜影' },
            { lv: 4, name: '琉璃天羽' },
            { lv: 5, name: '光明天兆' },
            { lv: 6, name: '断罪血翼' },
            { lv: 7, name: '流光月蝉' },
            { lv: 8, name: '帝王意志' },
            { lv: 9, name: '灼莹祭天' },
            { lv: 10, name: '冥域冰封' },
            /*
                { lv: 11, name: '流光月蝉' },
                { lv: 12, name: '流光月蝉' },
                { lv: 13, name: '流光月蝉' },
                { lv: 14, name: '流光月蝉' },
                { lv: 15, name: '流光月蝉' },
            */
        ]

        //
        this.wingRoot.PathChild('wing').runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(0.8, 0, 30),
            cc.moveBy(0.8, 0, -30),
        )))
    },

    init: function () {
        // 计算羽毛数量
        this.calclateFeatherCount()
        // 显示羽毛数量
        this.showFeatherCount()
        // 显示翅膀
        this.showWing()
    },

    calclateFeatherCount: function () {
        this.featherCount = 0
        for (var i = 0; i < player.backpack.length; i++) {
            if (player.backpack[i].id == '羽毛') {
                this.featherCount = player.backpack[i].calclateFeatherCount
                break
            }
        }
    },

    showFeatherCount: function () {
        this.feather.PathChild('val', cc.Label).string = `X${this.featherCount}`
    },

    showWing: function () {
        // 移除属性加层列
        this.wingRoot.PathChild('property').removeAllChildren()

        this.wingRoot.PathChild('wingName', cc.Label).string = `${this.wingInfo[player.wing.lv].name}`
        SetSpriteFrame(player.wing.lv == 0 ? null : 'wing/' + player.wing.lv, this.wingRoot.PathChild('lv', cc.Sprite))
        SetSpriteFrame(player.wing.lv == 0 ? null : 'wing/jiechibang' + player.wing.lv, this.wingRoot.PathChild('wing', cc.Sprite))
        this.bottom.PathChild('luckyValueBg/luckyValueFg').width = (player.wing.luckyVal / player.wing.maxLuckyVal) * this.bottom.PathChild('bottom/luckyValueBg').width
        this.bottom.PathChild('luckyValueBg/val', cc.Label).string = `${player.wing.luckyVal}/${player.wing.maxLuckyVal}`
        this.bottom.PathChild('consume/val', cc.Label).string = `${player.wing.val}`
    },

    btnForging: function () {
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
