let Status = {
    ready: 0,
    start: 1,
    end: 2,
}

cc.Class({
    extends: cc.Component,

    properties: {
        tipsRoot: cc.Node,
        close: cc.Node,
        startFight: cc.Node,
        stopFight: cc.Node,
        combatRoot: cc.Node,
        myHpFg: cc.Node,
        my: cc.Node,
        myHp: cc.Label,
        myInfo: cc.Label,
        myHurt: cc.Label,
        enemyHpFg: cc.Node,
        enemy: cc.Node,
        enemyHp: cc.Label,
        enemyInfo: cc.Label,
        enemyCut: cc.Node,
        enemyHurt: cc.Label,
        layout: cc.Node,
        item: cc.Node,
        enemyRoot: cc.Node,
    },

    onLoad: function () {
        // 数据缓存
        this.model = { status: Status.ready, idx: 0, }

        // 获取屏幕的宽度
        this.offset = cc.winSize.width

        // 默认血条宽度
        this.defualtHpWidth = this.combatRoot.PathChild('myHpBg').width

        // warn动画
        this.warnAni = this.node.PathChild('warn', cc.Animation)

        // 初始化爆率表
        this.initRewardCfg()

        // 
        this.poolRoot = []
    },

    initRewardCfg: function () {
        this.rewardCfg = [
            // tag0
            { coin: 500, list: { 1000: 15 } },
            // tag1
            { coin: 800, list: { 1000: 20 } },
            // tag2
            { coin: 2000, list: { 1001: 10 } },
            // tag3
            { coin: 3000, list: { 1001: 15 } },
            // tag4
            { coin: 4000, list: { 1002: 7 } },
            // tag5
            { coin: 5000, list: { 1002: 10 } },
            // tag6
            { coin: 8000, list: { 1003: 4 } },
            // tag7
            { coin: 15000, list: { 1003: 10 } },
            // tag8
            { coin: 20000, list: { 1004: 3 } },
            // tag9
            { coin: 25000, list: { 1004: 6 } },
            // tag10
            { coin: 40000, list: { 1005: 1 } },
            // tag11
            { coin: 50000, list: { 1005: 3 } },
        ]
    },

    init: function (idx) {
        // 每次进入清空显示列表
        this.layout.removeAllChildren()
        this.model.status = Status.ready
        this.model.idx = idx
        this.clearEnemy()
        this.show()
    },

    show: function () {
        switch (this.model.status) {
            case Status.ready:
                this.close.active = true
                this.startFight.active = true
                this.stopFight.active = false
                this.enemyRoot.active = false
                break
            case Status.start:
                this.close.active = false
                this.startFight.active = false
                this.tipsRoot.setPosition(-this.offset, 0)
                this.tipsRoot.stopAllActions()
                this.tipsRoot.PathChild('Bg').color = cc.Color.GREEN
                this.tipsRoot.PathChild('Info', cc.Label).string = '开始挂机'
                this.tipsRoot.runAction(cc.sequence(
                    cc.moveTo(0.2, cc.p(0, 0)),
                    cc.delayTime(0.5),
                    cc.moveTo(0.2, cc.p(this.offset, 0)),
                    cc.callFunc(() => {
                        this.stopFight.active = true
                        this.enemyRoot.active = true
                        this.combatInit()
                    }),
                ))
                break
            case Status.end:
                this.stopFight.active = false
                this.enemyRoot.active = false
                this.tipsRoot.setPosition(-this.offset, 0)
                this.tipsRoot.stopAllActions()
                this.tipsRoot.PathChild('Bg').color = cc.Color.GRAY
                this.tipsRoot.PathChild('Info', cc.Label).string = '结束挂机'
                this.tipsRoot.runAction(cc.sequence(
                    cc.moveTo(0.2, cc.p(0, 0)),
                    cc.delayTime(0.5),
                    cc.moveTo(0.2, cc.p(this.offset, 0)),
                    cc.callFunc(() => {
                        this.close.active = true
                        this.startFight.active = true
                    }),
                ))
                break
        }
    },

    clearEnemy: function () {
        this.enemyInfo.string = ``
        this.enemyHp.string = ``
        SetSpriteFrame(null, this.enemy.getComponent(cc.Sprite))
    },

    combatInit: function () {
        // 生成一个敌人
        this.newEnemy = this.generateEnemy()
        this.enemyInfo.string = `Lv${this.newEnemy.lv} ${this.newEnemy.name}`
        this.enemyHp.string = `${this.newEnemy.property.hp}/${this.enemyMaxHp}`
        SetSpriteFrame(`enemy/${this.newEnemy.id}`, this.enemy.getComponent(cc.Sprite))
        this.enemyMaxHp = this.newEnemy.property.hp

        // 初始化血量
        this.myInfo.string = `Lv${player.lv} ${player.name}`
        this.myHpFg.width = this.enemyHpFg.width = this.defualtHpWidth
        player.property.hp = player.property.maxHp
        this.myHp.string = `${player.property.hp}/${player.property.maxHp}`

        // 如果是boss 需要播放警告动画
        if (this.newEnemy.id % 10 == 4) {
            this.warnAni.play()
        }

        // combat
        this.myAtt()
        this.enemyAtt()
    },

    generateEnemy: function () {
        let r = GetLimiteRandom(0, 100)
        this.enemyId = 0
        let enemy = null
        let count = 0
        while (enemy == null) {
            count += EnemyList[this.model.idx][this.enemyId].val
            if (r <= count) {
                enemy = Clone(EnemyList[this.model.idx][this.enemyId].enemy)
                break
            }
            this.enemyId++
        }
        return enemy
    },

    myAtt: function () {
        if (this.tryCombatEnd()) {
            return
        }

        let hurtInfo = this.getHurtValue(player, this.newEnemy)
        this.combatRoot.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.newEnemy.property.hp -= hurtInfo.val
                this.newEnemy.property.hp = this.newEnemy.property.hp > 0 ? this.newEnemy.property.hp : 0
                this.enemyHpFg.width = this.newEnemy.property.hp / this.enemyMaxHp * this.defualtHpWidth
                // 打斗动画
                this.enemy.runAction(cc.sequence(
                    cc.moveBy(0.1, cc.p(-5, 0)),
                    cc.moveBy(0.1, cc.p(5, 0)),
                ))
                // 飘血
                this.enemyHurt.string = `-${hurtInfo.val}`
                this.enemyHurt.node.runAction(cc.sequence(
                    cc.callFunc(() => { this.enemyHurt.node.opacity = 255 }),
                    cc.delayTime(0.5),
                    cc.callFunc(() => { this.enemyHurt.node.opacity = 0 }),
                ))
                // 触发诅咒
                if (hurtInfo.cut) {
                    this.enemyCut.runAction(cc.sequence(
                        cc.fadeIn(0.1),
                        cc.delayTime(0.5),
                        cc.fadeOut(0.2),
                    ))
                }
            }),
            cc.callFunc(() => {
                this.enemyHp.string = `${this.newEnemy.property.hp}/${this.enemyMaxHp}`
            }),
            cc.callFunc(() => {
                this.myAtt()
            }),
        ))
    },

    enemyAtt: function () {
        if (this.tryCombatEnd()) {
            return
        }

        let hurtInfo = this.getHurtValue(this.newEnemy, player)
        this.combatRoot.runAction(cc.sequence(
            cc.delayTime(0.8),
            cc.callFunc(() => {
                player.property.hp -= hurtInfo.val
                player.property.hp = player.property.hp > 0 ? player.property.hp : 0
                this.myHpFg.width = player.property.hp / player.property.maxHp * this.defualtHpWidth
                // 打斗动画
                this.my.runAction(cc.sequence(
                    cc.moveBy(0.1, cc.p(-5, 0)),
                    cc.moveBy(0.1, cc.p(5, 0)),
                ))
                // 飘血
                this.myHurt.string = `-${hurtInfo.val}`
                this.myHurt.node.runAction(cc.sequence(
                    cc.callFunc(() => { this.myHurt.node.opacity = 255 }),
                    cc.delayTime(0.5),
                    cc.callFunc(() => { this.myHurt.node.opacity = 0 }),
                ))
            }),
            cc.callFunc(() => {
                this.myHp.string = `${player.property.hp}/${player.property.maxHp}`
            }),
            cc.callFunc(() => {
                this.enemyAtt()
            }),
        ))
    },

    getHurtValue: function (atter, defer) {
        let val = 0
        // 是否触发诅咒(只能是玩家)
        if (atter.property.cut && GetLimiteRandom(0, 100) < atter.property.cut_rate) {
            val = parseInt(this.enemyMaxHp * atter.property.cut / 100)
            return { cut: true, val: val }
        }
        let atterProperty = atter.property
        let deferProperty = defer.property
        // 伤害值 = (攻击者攻击 - 防御者的防御) + Math.ceil(((攻击者的暴击率 - 防御者的闪避率) * Math.abs(攻击者的暴击 -  防御者的闪避)))
        val = (atterProperty.att - deferProperty.def) + Math.ceil((atterProperty.crit_rate - deferProperty.dodge_rate) * Math.abs(atterProperty.crit - deferProperty.dodge))
        // 攻击上下波动 [0.6 - 1.4]
        val = parseInt(Math.ceil(Math.random() * (val * 1.4 - val * 0.6)) + val * 0.6)
        // 最小攻击
        val = val < 0 ? 0 : val
        return { cut: false, val: val }
    },

    tryCombatEnd: function () {
        // 玩家手动结束战斗
        if (this.model.status == Status.end) {
            return true
        }
        // 敌人死亡
        if (this.newEnemy.property.hp <= 0) {
            this.combatRoot.stopAllActions()
            if (this.model.status == Status.end) {
                this.combatRoot.runAction(cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(() => { this.show() }),
                ))

            } else {
                this.combatRoot.runAction(cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(() => { this.combatInit() }),
                ))
            }

            // 战斗奖励
            let reward = this.fightReward()
            // 添加金币到显示列表
            let item = this.getItem()
            item.getComponent(cc.Label).string = `击败"${this.newEnemy.name}",金币+${reward.coin}`
            item.color = GradeToColor(0)
            if (this.layout.children.length == 10) {
                this.poolRoot.push(this.layout.children[0])
                this.layout.removeChild(this.layout.children[0])
            }
            this.layout.addChild(item)
            // 添加道具到显示列表
            for (var i = 0; i < reward.list.length; i++) {
                let propId = reward.list[i]
                let item = this.getItem()
                item.getComponent(cc.Label).string = `击败"${this.newEnemy.name}",获得[${PropList[propId].name}]`
                item.color = GradeToColor(PropList[propId].grade)
                if (this.layout.children.length == 10) {
                    this.poolRoot.push(this.layout.children[0])
                    this.layout.removeChild(this.layout.children[0])
                }
                this.layout.addChild(item)
            }
            return true
        }
        // 玩家死亡
        if (player.property.hp <= 0) {
            UiMgr.show("MsgBoxAutoHidePanel", "----------------")
            UiMgr.show("MsgBoxAutoHidePanel", "|  您 已 阵 亡   |")
            UiMgr.show("MsgBoxAutoHidePanel", "----------------")
            this.combatRoot.stopAllActions()
            this.model.status = Status.end
            this.node.runAction(cc.sequence(
                cc.delayTime(2),
                cc.callFunc(() => { this.show() }),
            ))
            return true
        }
        // 战斗继续
        return false
    },

    getItem: function () {
        let item = this.poolRoot.pop()
        if (!item) {
            item = cc.instantiate(this.item)
        }
        return item
    },

    fightReward: function () {
        let r = this.rewardCfg[this.newEnemy.tag]
        // 黄金收益
        let randomCoin = parseInt((Math.ceil(Math.random() * (r.coin * 1.4 - r.coin * 0.6)) + r.coin * 0.6))
        // 其他列表
        let list = []
        for (var i in r.list) {
            // 幸运掉落物品(Boss是1.2倍爆率)
            let offsetLucky = 1 + (this.newEnemy.id % 10 == 4 ? 0.2 : 0)
            if (GetLimiteRandom(0, 100) < r.list[i] * offsetLucky) {
                list.push(i)
            }
        }
        // 金币增加
        player.coin += randomCoin
        // 更新显示
        wlgj.playerCtrl.show()
        // 放进背包
        for (var i = 0; i < list.length; i++) {
            wlgj.propCtrl.pushBackpack(Clone(PropList[list[i]]))
        }
        return { coin: randomCoin, list: list }
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },

    btnStartFight: function () {
        this.model.status = Status.start
        this.show()
    },

    btnStopFight: function () {
        this.model.status = Status.end
        this.clearEnemy()
        this.show()
    },
});
