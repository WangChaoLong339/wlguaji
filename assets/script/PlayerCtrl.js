cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        // 战斗力公式 = (攻击 + 防御) * 10 + 血量 * 2 + (暴击率 + 闪避率) * 5 + 暴击 + 闪避
        // 升级公式 = parseInt(((Math.pow(lv - 1, 3) + 60) / 5 * ((lv - 1) * 2 + 60) + 50) / 50) * 50
        this.model = {}

        let player = GetLocalStorage("WLGJ_PLAYER")
        if (!player) {
            player = this.createPlayer()
        }
        this.model.player = player
        window.player = this.model.player

        this.head = this.node.PathChild("Player/Head").getComponent("cc.Sprite")
        this.nickName = this.node.PathChild("Player/NickName").getComponent("cc.Label")
        this.lv = this.node.PathChild("Player/Lv").getComponent("cc.Label")
        this.coin = this.node.PathChild("Player/coin").getComponent("cc.Label")
        this.diam = this.node.PathChild("Player/diamonds").getComponent("cc.Label")
        this.battle = this.node.PathChild("Player/label/Battle").getComponent("cc.Label")
        this.vip = this.node.PathChild("Player/Vip").getComponent("cc.Sprite")

        // 计算所有属性
        this.calculate()
        // 战力值动画
        this.battleAction()
    },

    createPlayer: function () {
        return {
            /* 玩家名字 */name: "乱世枭雄",
            /* 玩家头像 */head: 1,
            /* 玩家黄金 */coin: 0,
            /* 玩家钻石 */diam: 0,
            /* 翅膀等级 */wing: { lv: 1, luckyVal: 0 },
            /* vipLv   */vip: 3,
            /* 玩家等级 */lv: 1,
            /* 封顶等级 */maxlv: 700,
            /* 背包列表 */backpack: [],//[Clone(PropList[1000]), Clone(PropList[1001]), Clone(PropList[5000]), Clone(PropList[5001]), Clone(PropList[5002]), Clone(PropList[5003]), Clone(PropList[5004]), Clone(PropList[5005])],
            /* 穿戴装备 */equip: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {} },
            /* 及时属性 */property: { att: 10, def: 5, hp: 100, cut: 0, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0, },
            /* 幸运增幅 */lucky_rate: 0,
            /* 黄金增幅 */coin_rate: 0,
            /* 防御增幅 */def_rate: 0,
            /* 攻击增幅 */att_rate: 0,
            /* 战 斗 力 */battle: 0,
            /* 生命储备 */storageHp: 0,
        }
    },

    battleAction: function () {
        this.battle.node.runAction(cc.repeatForever(cc.sequence(
            cc.spawn(cc.fadeTo(0.5, 150), cc.scaleTo(0.5, 0.95)),
            cc.spawn(cc.fadeTo(0.5, 255), cc.scaleTo(0.5, 1)),
        )))
    },

    show: function () {
        // vip
        SetSpriteFrame(`vip/vip_${player.vip}`, this.vip)
        // 昵称
        this.nickName.string = `${player.name}`
        // 等级
        this.lv.string = `Lv ${player.lv}`
        // 黄金
        this.coin.string = `${player.coin}`
        // 钻石
        this.diam.string = `${player.diam}`

        this.battle.string = `${player.battle}`
    },

    calculate: function () {
        // 清空
        this.playerPropertyClean()

        // 装备属性附加
        this.plusEquiproperty()

        // 攻防增幅
        this.tryAttRateAndDefRate()

        // 记录一个最大血量
        player.property.maxHp = player.property.hp

        // 计算战力值
        player.battle = (player.property.att + player.property.def) * 10 + player.property.maxHp * 2 + (player.property.crit_rate + player.property.dodge_rate) * 5 + player.property.crit + player.property.dodge

        // 显示战力值
        this.show()

        // 储存到本地 TODO 后期需要上传服务器
        SetLocalStorage("WLGJ_PLAYER", player)
    },

    playerPropertyClean: function () {
        player.property = { att: player.lv * 10, def: player.lv * 5, hp: player.lv * 100, cut: 0, cut_rate: 0, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0, }
        player.lucky_rate = 0
        player.coin_rate = 0
        player.def_rate = 0
        player.att_rate = 0
        player.battle = 0
    },

    plusEquiproperty: function () {
        for (var i in player.equip) {
            // 普通部件
            if (parseInt(i) == Place.Arms ||
                parseInt(i) == Place.Clothe ||
                parseInt(i) == Place.Cap ||
                parseInt(i) == Place.Necklace ||
                parseInt(i) == Place.Ring ||
                parseInt(i) == Place.Boots) {
                for (var j in player.equip[i].effect) {
                    player.property[j] += player.equip[i].effect[j]
                }
            }
            // 穿上了相应的装备
            if (player.equip[i].effect) {
                // 特殊 8
                if (parseInt(i) == Place.Spec) {
                    for (var j in player.equip[i].effect)
                        player[j] = player.equip[i].effect[j]
                }
                // 翅膀
                if (parseInt(i) == Place.Wing) {
                    for (var j in player.property) {
                        player.property[j] += parseInt(Math.ceil(player.property[j] * player.equip[i].effect.all_rate / 100))
                    }
                }
                // 诅咒
                if (parseInt(i) == Place.Cut) {
                    player.property.cut = player.equip[i].effect.cut
                    player.property.cut_rate = player.equip[i].effect.cut_rate
                }
            }
        }
    },

    tryAttRateAndDefRate: function () {
        // 攻击增幅
        player.property.att += parseInt(Math.ceil(player.att_rate / 100 * player.property.att))
        // 防御增幅
        player.property.def += parseInt(Math.ceil(player.def_rate / 100 * player.property.def))
    },
});
