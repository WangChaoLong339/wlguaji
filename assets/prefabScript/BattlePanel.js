let STATUS_NONE = 0
let STATUS_RUN_AWAY = 1
let STATUS_ENEMY_DEATH = 2
let STATUS_PLAYER_DEATH = 3

cc.Class({
    extends: cc.Component,

    properties: {
        enemyRoot: cc.Node,
        playerRoot: cc.Node,
        areaPos: cc.Node,
        propItem: cc.Node,
        close: cc.Node,
    },

    onLoad: function () {
        // TODO 需要配置爆率表

        // 默认血条宽度
        this.defualtHpWidth = this.enemyRoot.PathChild('HpBg').width
        // 缓存propitem
        this.propItemCache = []
    },

    init: function (info) {
        let enemy = info.enemy
        this.cb = info.cb
        if (!enemy) {
            cc.error(`enemy(${enemy}) is illegal`)
            return
        }
        // 是否逃跑
        this.runAway = false
        // 结算标识
        this.flagResult = false
        // 隐藏close节点
        this.close.active = false
        // 缓存敌人和玩家的信息
        this.enemy = Clone(enemy)
        this.player = Clone(player)
        // 记录一个最大血量
        this.maxHp = { enemy: enemy.property.hp, player: player.property.hp }
        // 显示敌人
        this.showEnemy()
        // 显示自己
        this.showPlayer()
        // 开始战斗
        this.startBattle()
    },

    showEnemy: function () {
        // 敌人血条
        this.enemyRoot.PathChild('HpFg').width = this.enemy.property.hp / this.maxHp.enemy * this.defualtHpWidth
        // 敌人血量显示
        this.enemyRoot.PathChild('HpVal', cc.Label).string = `${this.enemy.property.hp}/${this.maxHp.enemy}`
        // 敌人信息
        this.enemyRoot.PathChild('Info', cc.Label).string = `Lv${this.enemy.lv} ${this.enemy.name}`
        // 敌人Icon
        SetSpriteFrame(`enemy/${this.enemy.id}`, this.enemyRoot.PathChild('EnemyIcon', cc.Sprite))
        // 设置透明度
        this.enemyRoot.opacity = 255
    },

    showPlayer: function () {
        // 玩家血条
        this.playerRoot.PathChild('HpFg').width = this.player.property.hp / this.maxHp.player * this.defualtHpWidth
        // 玩家血量显示
        this.playerRoot.PathChild('HpVal', cc.Label).string = `${this.player.property.hp}/${this.maxHp.player}`
        // 玩家信息
        this.playerRoot.PathChild('Info', cc.Label).string = `Lv${player.lv} ${player.name}`
    },

    startBattle: function () {
        this.node.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.playerAtt()
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.enemyAtt()
            }),
        ))
    },

    playerAtt: function () {
        if (this.tryBattleEnd() != STATUS_NONE) {
            return
        }
        let hurtInfo = this.getHurtValue(this.player, this.enemy)
        this.enemyRoot.runAction(cc.sequence(
            cc.delayTime(1000 - this.player.property.speed),
            cc.callFunc(() => {
                this.enemy.property.hp -= hurtInfo.val
                this.enemy.property.hp = this.enemy.property.hp > 0 ? this.enemy.property.hp : 0
                this.showEnemy()
                // 敌人抖动
                this.enemyRoot.PathChild('EnemyIcon').runAction(cc.sequence(
                    cc.moveBy(0.1, cc.p(-5, 0)),
                    cc.moveBy(0.1, cc.p(5, 0)),
                ))
                // 飘血
                this.enemyRoot.PathChild('Hurt', cc.Label).string = `-${hurtInfo.val}`
                this.enemyRoot.PathChild('Hurt').runAction(cc.sequence(
                    cc.fadeIn(0.1),
                    cc.delayTime(0.5),
                    cc.fadeOut(0.2),
                    cc.callFunc(() => { this.playerAtt() }),
                ))
                // 触发诅咒
                if (hurtInfo.cut) {
                    this.enemyRoot.PathChild('Cut').runAction(cc.sequence(
                        cc.fadeIn(0.1),
                        cc.delayTime(0.5),
                        cc.fadeOut(0.2),
                    ))
                }
            }),
        ))
    },

    enemyAtt: function () {
        if (this.tryBattleEnd() != STATUS_NONE) {
            return
        }
        let hurtInfo = this.getHurtValue(this.enemy, this.player)
        this.playerRoot.runAction(cc.sequence(
            cc.delayTime(0.8),
            cc.callFunc(() => {
                this.player.property.hp -= hurtInfo.val
                this.player.property.hp = this.player.property.hp > 0 ? this.player.property.hp : 0
                this.showPlayer()
                // 敌人抖动
                this.playerRoot.PathChild('PlayerIcon').runAction(cc.sequence(
                    cc.moveBy(0.1, cc.p(-5, 0)),
                    cc.moveBy(0.1, cc.p(5, 0)),
                ))
                // 飘血
                this.playerRoot.PathChild('Hurt', cc.Label).string = `-${hurtInfo.val}`
                this.playerRoot.PathChild('Hurt').runAction(cc.sequence(
                    cc.fadeIn(0.1),
                    cc.delayTime(0.5),
                    cc.fadeOut(0.2),
                    cc.callFunc(() => { this.enemyAtt() }),
                ))
            }),
        ))
    },

    tryBattleEnd: function () {
        // 玩家逃跑
        if (this.runAway) {
            this.enemyRoot.stopAllActions()
            this.playerRoot.stopAllActions()
            if (!this.flagResult) {
                this.flagResult = true
                this.showResult([])
            }
            return STATUS_RUN_AWAY
        }
        // 敌人死亡
        if (this.enemy.property.hp <= 0) {
            this.playerRoot.stopAllActions()
            // 死亡动画
            this.enemyRoot.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.fadeOut(1),
                cc.callFunc(() => {
                    if (!this.flagResult) {
                        this.flagResult = true
                        this.showResult([
                            { id: 1009, count: GetLimiteRandom(this.enemy.lv * 100, this.enemy.lv * 200) },
                            { id: 1000, count: GetLimiteRandom(this.enemy.lv * 100, this.enemy.lv * 200) },
                            { id: 1001, count: GetLimiteRandom(this.enemy.lv * 100, this.enemy.lv * 200) },
                            { id: 1002, count: GetLimiteRandom(this.enemy.lv * 100, this.enemy.lv * 200) },
                            { id: 1003, count: GetLimiteRandom(this.enemy.lv * 100, this.enemy.lv * 200) },
                        ])
                        // 删除上个界面被击败的敌人
                        this.cb()
                    }
                }),
            ))
            return STATUS_ENEMY_DEATH
        }
        // 玩家死亡
        if (this.player.property.hp <= 0) {
            this.enemyRoot.stopAllActions()
            if (!this.flagResult) {
                this.flagResult = true
                this.showResult([])
            }
            return STATUS_PLAYER_DEATH
        }
        // 战斗继续
        return STATUS_NONE
    },

    getHurtValue: function (atter, defer) {
        let val = 0
        // 是否触发诅咒(只能是玩家)
        if (atter.property.cut && GetLimiteRandom(0, 100) < atter.property.cut_rate) {
            val = parseInt(this.maxHp.enemy * atter.property.cut / 100)
            return { cut: true, val: val }
        }
        let atterProperty = atter.property
        let deferProperty = defer.property
        // 伤害值 = (攻击者攻击 - 防御者的防御) + Math.ceil(((攻击者的暴击率 - 防御者的闪避率) * Math.abs(攻击者的暴击 -  防御者的闪避)))
        val = (atterProperty.att - deferProperty.def)
        // 攻击上下波动 [0.6 - 1.4]
        val = parseInt(Math.ceil(Math.random() * (val * 1.4 - val * 0.6)) + val * 0.6)
        // 最小攻击
        val = val < 0 ? 1 : val
        return { cut: false, val: val }
    },

    showResult: function (reward) {
        if (reward.length > 0) {
            let temp = []
            for (var i = 0; i < reward.length; i++) {
                let propItem = this.getPropItem()
                SetSpriteFrame(`prop/${reward[i].id}`, propItem.PathChild('PropIcon', cc.Sprite))
                propItem.PathChild('PropName', cc.Label).string = `${PropList[reward[i].id].name}`
                propItem.PathChild('PropName').color = GradeToColor(PropList[reward[i].id].grade)
                propItem.PathChild('PropEffect').active = PropList[reward[i].id].grade > 0
                propItem.setPosition(GetLimiteRandom(-this.areaPos.width / 2, this.areaPos.width / 2), GetLimiteRandom(-this.areaPos.height / 2, this.areaPos.height / 2))
                temp.push(propItem)
            }
            temp.sort(function (a, b) { return b.y - a.y })
            // 道具爆出来的动画

            for (var i = 0; i < temp.length; i++) {
                this.areaPos.addChild(temp[i])
            }
            this.close.active = true
            this.close.PathChild('label', 'Shake').play()
        } else {
            UiMgr.show('MsgBoxAutoHidePanel', '您被击败,请去提升您的实力')
        }
    },

    getPropItem: function () {
        let item = this.propItemCache.pop()
        if (!item) {
            item = cc.instantiate(this.propItem)
        }
        return item
    },

    btnRunAway: function () {
        UiMgr.show('MsgBoxPanel', {
            title: '注意',
            val: '是否选择逃跑?',
            btn1: function () {
                UiMgr.hide(this.node.name)
            }.bind(this)
        })
    },

    btnClose: function () {
        // 回收PropItem节点
        for (var i = 0; i < this.areaPos.children.length; i++) {
            this.propItemCache.push(this.areaPos.children[i])
        }
        this.areaPos.removeAllChildren()
        UiMgr.hide(this.node.name)
    },
});
