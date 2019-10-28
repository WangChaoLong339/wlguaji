cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        item: cc.Node,
    },

    onLoad: function () {
        // 储存数据
        this.model = {
            select: [
                { icon: 0, name: '勇者平原\n(>=1级)' },
                { icon: 1, name: '黑暗森林\n(>=1级)' },
                { icon: 2, name: '兽人领域\n(>=100级)' },
                { icon: 3, name: '死亡沙漠\n(>=100级)' },
                { icon: 4, name: '无尽废墟\n(>=200级)' },
                { icon: 5, name: '恐惧海湾\n(>=200级)' },
                { icon: 6, name: '远古遗迹\n(>=300级)' },
                { icon: 7, name: '烈焰火山\n(>=300级)' },
                { icon: 8, name: '恶魔之城\n(>=400级)' },
                { icon: 9, name: '恐怖地下城\n(>=400级)' },
                { icon: 10, name: '死亡之地\n(>=500级)' },
                { icon: 11, name: '龙之大陆\n(>=500级)' },
            ],
        }

        // 创建关卡
        this.createItem()
    },

    createItem: function () {
        this.content.removeAllChildren()
        this.model.select.forEach((it) => {
            let item = new cc.instantiate(this.item)
            // 添加到父节点
            this.content.addChild(item)
        });
    },

    init: function () {
        this.content.parent.parent.getComponent(cc.ScrollView).scrollToTop()
        this.show()
    },

    show: function () {
        this.content.children.forEach((it, idx) => {
            // 可进入
            let enter = player.lv >= parseInt(idx / 2) * 100 ? true : false
            // 设置bg
            SetSpriteFrame(`battle/${this.model.select[idx].icon}`, it.PathChild('icon', cc.Sprite))
            // 设置描述
            it.PathChild('name', cc.Label).string = this.model.select[idx].name
            it.PathChild('name').color = enter ? cc.Color.WHITE : cc.Color.GRAY
            // 是否属于可点击状态
            it.PathChild('lock').active = !enter
        });
    },

    btnItem: function (event) {
        if (event.target.PathChild('lock').active) {
            UiMgr.show("MsgBoxAutoHidePanel", `关卡未开启`)
            return
        }
        let idx = this.content.children.indexOf(event.currentTarget)
        // 断言下标的合法性
        cc.assert(idx >= 0 && idx < this.model.select.length)
        // 进入战斗界面
        UiMgr.show("CombatPanel", idx)
    },

    brnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
