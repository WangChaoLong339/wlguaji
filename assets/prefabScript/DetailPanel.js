cc.Class({
    extends: cc.Component,

    properties: {
        equips: [cc.Node],
        item: cc.Node,
        content: cc.Node,
    },

    onLoad: function () {
        this.detailRoot = this.node.PathChild('DetailRoot')
        this.battle = this.node.PathChild('Battle', cc.Label)
    },

    init: function () {
        this.show()
    },

    show: function () {
        // 佩戴装备
        for (var i in player.equip) {
            let equip = player.equip[i]
            if (!IsEmpty(equip)) {
                SetSpriteFrame(`grade/${equip.grade}`, this.equips[parseInt(i)].PathChild('guang', cc.Sprite))
                SetSpriteFrame(`prop/${equip.id}`, this.equips[parseInt(i)].PathChild('icon', cc.Sprite))
            } else {
                this.equips[parseInt(i)].PathChild('guang', cc.Sprite).spriteFrame = null
                this.equips[parseInt(i)].PathChild('icon', cc.Sprite).spriteFrame = null
            }
        }

        let values = [
            `总攻击: ${player.property.att}`,
            `总防御: ${player.property.def}`,
            `总血量: ${player.property.hp}`,
        ]
        if (this.content.children.length == 0) {
            this.createItem(values.length)
        }
        for (var i = 0; i < this.content.children.length; i++) {
            this.content.children[i].getComponent(cc.Label).string = values[i]
        }
        this.battle.string = `战斗力:${player.battle}`
    },

    createItem: function (count) {
        for (var i = 0; i < count; i++) {
            let item = new cc.instantiate(this.item)
            this.content.addChild(item)
        }
    },

    btnPropBg: function (event) {
        let idx = this.equips.indexOf(event.currentTarget)
        this.i = idx
        let prop = player.equip[idx]
        if (IsEmpty(prop)) {
            return
        }
        UiMgr.show('MsgBoxShowDetailPanel', {
            prop: prop,
            btnInfo: '脱下',
            cb: function () {
                wlgj.propCtrl.takeOffEquip(this.i)
                this.show()
            }.bind(this),

        })
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
