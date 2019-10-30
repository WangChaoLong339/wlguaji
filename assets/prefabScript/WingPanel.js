cc.Class({
    extends: cc.Component,

    properties: {
        wingRoot: cc.Node,
        feather: cc.Node,
        bottom: cc.Node,
    },

    onLoad: function () {
        this.wingInfo = [
            { lv: 1, name: '无光之翼', maxLuckyVal: 500, totalConsume: 50, consume: 10, maxCount: 5, },
            { lv: 2, name: '霓霞幻影', maxLuckyVal: 500, totalConsume: 75, consume: 15, maxCount: 5, },
            { lv: 3, name: '修罗夜影', maxLuckyVal: 1300, totalConsume: 260, consume: 20, maxCount: 13, },
            { lv: 4, name: '琉璃天羽', maxLuckyVal: 1500, totalConsume: 375, consume: 25, maxCount: 15, },
            { lv: 5, name: '光明天兆', maxLuckyVal: 3700, totalConsume: 1110, consume: 30, maxCount: 37, },
            { lv: 6, name: '断罪血翼', maxLuckyVal: 4400, totalConsume: 1760, consume: 40, maxCount: 44, },
            { lv: 7, name: '流光月蝉', maxLuckyVal: 5700, totalConsume: 2850, consume: 50, maxCount: 57, },
            { lv: 8, name: '帝王意志', maxLuckyVal: 7700, totalConsume: 4620, consume: 60, maxCount: 77, },
            { lv: 9, name: '灼莹祭天', maxLuckyVal: 12500, totalConsume: 10000, consume: 80, maxCount: 125, },
            { lv: 10, name: '冥域冰封', maxLuckyVal: 13000, totalConsume: 11700, consume: 90, maxCount: 130, },
            /*
                { lv: 11, name: '流光月蝉'，, maxLuckyVal: 18960, consume: 3,  },
                { lv: 12, name: '流光月蝉'，, maxLuckyVal: 26320, consume: 3,  },
                { lv: 13, name: '流光月蝉'，, maxLuckyVal: 35520, consume: 3,  },
                { lv: 14, name: '流光月蝉'，, maxLuckyVal: 44640, consume: 3,  },
                { lv: 15, name: '流光月蝉'，, maxLuckyVal: 50, consume: 3,  },
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
        // 刷新显示
        this.show()
    },

    calclateFeatherCount: function () {
        this.featherIdx = -1
        this.featherCount = 0
        for (var i = 0; i < player.backpack.length; i++) {
            if (player.backpack[i].id == 2101) {
                this.featherIdx = i
                this.featherCount = player.backpack[i].count
                break
            }
        }
    },

    show: function () {
        // 羽毛数量
        this.feather.PathChild('val', cc.Label).string = `X${this.featherCount}`
        // 移除属性加层列
        this.wingRoot.PathChild('property').removeAllChildren()
        // 
        this.wingRoot.PathChild('wingName', cc.Label).string = `${this.wingInfo[player.wing.lv - 1].name}`
        SetSpriteFrame(`wing/${player.wing.lv}`, this.wingRoot.PathChild('lv', cc.Sprite))
        SetSpriteFrame(`wing/jiechibang${player.wing.lv}`, this.wingRoot.PathChild('wing', cc.Sprite))
        this.bottom.PathChild('luckyValueBg/luckyValueFg').width = (player.wing.luckyVal / this.wingInfo[player.wing.lv - 1].maxLuckyVal) * this.bottom.PathChild('bottom/luckyValueBg').width
        this.bottom.PathChild('luckyValueBg/val', cc.Label).string = `${player.wing.luckyVal}/${this.wingInfo[player.wing.lv - 1].maxLuckyVal}`
        this.bottom.PathChild('consume/val', cc.Label).string = `${this.wingInfo[player.wing.lv - 1].consume}`
    },

    tryForging: function () {
        // 扣除羽毛
        this.featherCount -= this.wingInfo[player.wing.lv - 1].consume
        wlgj.propCtrl.useProp(this.featherIdx, this.wingInfo[player.wing.lv - 1].consume)

        // 最多还需要点击count次进阶
        let count = this.wingInfo[player.wing.lv - 1].maxCount - (player.wing.luckyVal / 100)
        let sucPerc = 1000
        while (count--) {
            sucPerc = parseInt(sucPerc / 2)
            if (sucPerc == 1) {
                break
            }
        }
        let r = GetLimiteRandom(0, 1000)
        cc.log('成功概率:' + (sucPerc / 10) + '%')
        cc.log('随机数:' + r)
        cc.log('')
        if (sucPerc >= r) {
            player.wing.lv += 1
            player.wing.luckyVal = 0
            UiMgr.show('MsgBoxAutoHidePanel', '恭喜!!!进阶成功')
        } else {
            player.wing.luckyVal += 100
        }
    },

    btnForging: function () {
        if (this.featherCount < this.wingInfo[player.wing.lv - 1].consume) {
            UiMgr.show('MsgBoxAutoHidePanel', '羽毛不足')
            return
        }

        // 尝试进阶
        this.tryForging()

        // 刷新显示
        this.show()

        // 储存到本地 TODO 后期需要上传服务器
        SetLocalStorage("WLGJ_PLAYER", player)
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
