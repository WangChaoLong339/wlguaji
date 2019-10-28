cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        this.cfg = [
            { prefixId: 510, hit: 400, detail: { jianJia: 100, other: 900 } },
            { prefixId: 511, hit: 245, detail: { jianJia: 100, other: 900 } },
            { prefixId: 512, hit: 150, detail: { jianJia: 100, other: 900 } },
            { prefixId: 513, hit: 100, detail: { jianJia: 100, other: 900 } },
            { prefixId: 514, hit: 50, detail: { jianJia: 100, other: 900 } },
            { prefixId: 515, hit: 10, detail: { jianJia: 50, other: 950 } },
            { prefixId: 516, hit: 9, detail: { jianJia: 50, other: 950 } },
            { prefixId: 517, hit: 8, detail: { jianJia: 50, other: 950 } },
            { prefixId: 518, hit: 7, detail: { jianJia: 50, other: 950 } },
            { prefixId: 519, hit: 6, detail: { jianJia: 50, other: 950 } },
            { prefixId: 520, hit: 5, detail: { jianJia: 10, other: 990 } },
            { prefixId: 521, hit: 4, detail: { jianJia: 10, other: 990 } },
            { prefixId: 522, hit: 3, detail: { jianJia: 10, other: 990 } },
            { prefixId: 523, hit: 2, detail: { jianJia: 10, other: 990 } },
            { prefixId: 524, hit: 1, detail: { jianJia: 5, other: 995 } },
        ]
        this.allList = []
        for (var i = 0; i < this.cfg.length; i++) {
            for (var j = 0; j < this.cfg[i].hit; j++) {
                this.allList.push({ prefixId: this.cfg[i].prefixId, idx: i, })
            }
        }
        // 断言
        cc.assert(this.allList.length == 1000)
        // 乱序
        this.allList.sort(function (a, b) { return Math.random() > 0.5 ? -1 : 1 })
    },

    takeOffEquip: function (i) {
        // 放进背包
        this.pushBackpack(player.equip[i])
        // 取下
        player.equip[i] = {}
        // 重新计算
        wlgj.playerCtrl.calculate()
    },

    removeProp: function (i, count) {
        if (!count) {
            cc.error('count is not exist' + count)
            return
        }
        let prop = player.backpack[i]
        if (IsEmpty(prop)) {
            cc.error('prop is not exist' + prop)
            return
        }
        prop.count -= count
        if (prop.count == 0) {
            player.backpack.splice(i, 1, {})
        }

        // 更新玩家主页信息
        wlgj.playerCtrl.show()
    },

    sellProp: function (i, count) {
        if (!count) {
            cc.error(`prop(${player.backpack[i].name}_${i}) count(${count}) is not exist`)
            return
        }
        let prop = player.backpack[i]
        if (IsEmpty(prop)) {
            cc.error(`prop(${prop}) is not exist`)
            return
        }
        prop.count -= count
        if (prop.count == 0) {
            player.backpack.splice(i, 1, {})
        }
        // 增加卖出的黄金
        player.coin += count * prop.sell
        // 更新玩家主页信息
        wlgj.playerCtrl.show()
    },

    useProp: function (i, count, cb) {
        let prop = player.backpack[i]
        // 先从背包移除
        if (prop.count == count) {
            player.backpack.splice(i, 1, {})
        } else {
            player.backpack[i].count -= count
        }

        if (prop.type == Type.Drug) {
            this.drugEffect(prop, count, cb)
        } else if (prop.type == Type.Mat) {
        } else if (prop.type == Type.Equip || prop.type == Type.Spec || prop.type == Type.Wing || prop.type == Type.Cut) {
            // 换下来同部位的装备放进背包里面
            player.backpack[i] = player.equip[prop.place]
            // 穿上选择的装备
            player.equip[prop.place] = prop
            // 重新计算属性
            wlgj.playerCtrl.calculate()
            if (cb) {
                cb()
            }
        }
    },

    pushBackpack: function (prop) {
        let exist = false
        if (prop.type == Type.Drug ||
            prop.type == Type.Mat) {
            for (var i = 0; i < player.backpack.length; i++) {
                if (player.backpack[i].id == prop.id) {
                    exist = true
                    player.backpack[i].count += prop.count
                    break
                }
            }
        }

        // 尝试放进之前空余的格子
        if (!exist) {
            for (var i = 0; i < player.backpack.length; i++) {
                if (IsEmpty(player.backpack[i])) {
                    exist = true
                    player.backpack[i] = prop
                    break
                }
            }
        }
        // 未找到之前空余的格子 直接放在最后
        if (!exist) {
            player.backpack.push(prop)
        }

        // 储存到本地 TODO 后期需要上传服务器
        SetLocalStorage("WLGJ_PLAYER", player)
    },

    drugEffect: function (prop, count, cb) {
        // 增加生命储备
        if (prop.effect.storageHp) {
            this.addStorageHp(prop, count)
        }
        // 增加金币
        if (prop.effect.coin) {
            this.addCoin(prop, count)
        }
        // 增加等级
        if (prop.effect.lv) {
            this.addLv(prop, count)
        }
        // 随机装备
        if (prop.effect.ramdonEquip) {
            // 随机count次
            //for (var i = 0; i < count; i++) {
            let temp = this.allList[GetLimiteRandom(0, 1000)]
            let id = null
            if (GetLimiteRandom(0, 1000) < this.cfg[temp.idx].detail.jianJia) {
                id = `${temp.prefixId}${Math.random() > 0.5 ? 0 : 1}`
            } else {
                id = `${temp.prefixId}${GetLimiteRandom(0, 4) + 2}`
            }
            // 放进背包
            this.pushBackpack(Clone(PropList[id]))
            if (cb) {
                cb(id)
            }
            //}
        }
    },

    addStorageHp: function (prop, count) {
        player.storageHp += prop.effect.storageHp * count
        UiMgr.show("MsgBoxAutoHidePanel", `HP储备+${prop.effect.storageHp * count}`)
    },

    addCoin: function (prop, count) {
        let c = 0
        for (var i = 0; i < count; i++) {
            c += parseInt(Math.ceil(Math.random() * (prop.effect.coin * 1.5 - prop.effect.coin * 0.5)) + prop.effect.coin * 0.5)
        }
        player.coin += c
        UiMgr.show("MsgBoxAutoHidePanel", `获得黄金+${c}`)
        // 更新显示
        wlgj.playerCtrl.show()
    },

    addLv: function (prop, count) {
        let interval = {
            /* 等级丹(初级) */1000: { min: 1, max: 99 },
            /* 等级丹(高级) */1001: { min: 100, max: 199 },
            /* 等级丹(超级) */1002: { min: 200, max: 299 },
            /* 等级丹(妖级) */1003: { min: 300, max: 399 },
            /* 等级丹(魔级) */1004: { min: 400, max: 499 },
            /* 等级丹(仙级) */1005: { min: 500, max: 599 },
            /* 等级丹(神级) */1006: { min: 600, max: 699 },
        }

        // 非法使用
        if (count <= 0 || player.lv < interval[prop.id].min || player.lv > interval[prop.id].max) {
            UiMgr.show('MsgBoxAutoHidePanel', '当前等级丹使用无效')
            // 全部放回背包
            prop.count = count
            this.pushBackpack(prop)
            return
        }
        // 有多余的部分
        if (player.lv + count > interval[prop.id].max + 1) {
            // 多余的放回背包
            UiMgr.show('MsgBoxAutoHidePanel', `多了${count - (interval[prop.id].max + 1 - player.lv)}个`)
            prop.count = count - (interval[prop.id].max + 1 - player.lv)
            this.pushBackpack(prop)
            player.lv += interval[prop.id].max + 1 - player.lv
        } else {
            // 全部使用
            player.lv += count
        }
        // 更新显示
        wlgj.playerCtrl.show()
        // 重新计算属性
        wlgj.playerCtrl.calculate()
    },
});
