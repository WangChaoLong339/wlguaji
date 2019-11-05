cc.Class({
    extends: cc.Component,

    properties: {
        enemysRoot: cc.Node,
        enemy: cc.Node,
    },

    onLoad: function () {
        this.enemysPool = []
    },

    init: function (idx) {
        // 清空列表
        this.enemysRoot.removeAllChildren()
        // 生成所有敌人
        this.generateEnemys(idx)
    },

    generateEnemys: function (tag) {
        for (var i = 0; i < 10; i++) {
            let r = GetLimiteRandom(0, 100)
            this.enemyId = 0
            let enemy = null
            let count = 0
            while (enemy == null) {
                count += EnemyList[tag][this.enemyId].val
                if (r <= count) {
                    enemy = Clone(EnemyList[tag][this.enemyId].enemy)
                    break
                }
                this.enemyId++
            }
            let enemyItem = this.getEnemyItem()
            enemyItem.PathChild('Info', cc.Label).string = `Lv${enemy.lv} ${enemy.name}`
            enemyItem.PathChild('Info').color = enemy.id % 10 == 4 ? cc.color(255, 0, 0) : cc.color(127, 127, 127)
            SetSpriteFrame(`enemy/${enemy.id}`, enemyItem.getComponent(cc.Sprite))
            enemyItem.setPosition(this.getNewPosition())
            enemyItem.enemyTag = tag
            enemyItem.enemyIdx = this.enemyId
            this.enemysRoot.addChild(enemyItem)
        }
    },

    getEnemyItem: function () {
        let item = this.enemysPool.pop()
        if (!item) {
            item = cc.instantiate(this.enemy)
        }
        return item
    },

    getNewPosition: function () {
        return { x: GetLimiteRandom(-this.enemysRoot.width / 2, this.enemysRoot.width / 2), y: GetLimiteRandom(-this.enemysRoot.height / 2, this.enemysRoot.height / 2) }
    },

    btnEnemy: function (event) {
        let idx = this.enemysRoot.children.indexOf(event.currentTarget)
        let currItem = this.enemysRoot.children[idx]
        UiMgr.show('BattlePanel', {
            enemy: EnemyList[currItem.enemyTag][currItem.enemyIdx].enemy,
            cb: function () {
                this.enemysRoot.removeChild(currItem)
                this.enemysPool.push(currItem)
            }.bind(this)
        })
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
