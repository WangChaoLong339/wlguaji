cc.Class({
    extends: cc.Component,

    properties: {
        select: cc.Node,
        allSelect: cc.Node,
        listRoot: cc.Node,
        grade: cc.Node,
        forbid: cc.Node,
        count: cc.Label,
    },

    onLoad: function () {
        // 消耗配置
        this.consume = { one: 5000, ten: 50000 }
        // shake动画
        this.shakeAnimation = this.listRoot.getComponent(cc.Animation)
        // 十次动画选中的节点
        this.allFlyItems = []
        for (var i = 0; i < 10; i++) {
            this.allSelect.addChild(cc.instantiate(this.select))
            this.allFlyItems.push(cc.instantiate(this.grade))
        }
        // 隐藏显示次数的节点
        this.count.node.active = false
    },

    init: function () {
        // 计算移动次数[20 - 32]
        this.minCount = 20
        this.maxCount = 32
        // 更新列表
        this.updateList()
        // 抽奖结果列表
        this.rewards = []
        // 光标当前所在下标
        this.selectIdx = this.selectIdx || 0
        // 显示奖品列表
        this.showPropList()
        // 隐藏forbid
        this.forbid.active = false
    },

    updateList: function () {
        if (parseInt(player.lv / 100) === this.lastStage) {
            return
        }
        this.lastStage = parseInt(player.lv / 100)
        // 得到开奖列表(需要动态添加相应的奖品)
        this.initPropsList()
        // 根据概率填充数据
        this.initRewardValue()
    },

    initPropsList: function () {
        // 根据当前等级来判断阶段
        let stage = parseInt(player.lv / 100)
        /* 
        消耗(4):252/1000 
        材料(5):745/1000 
        特殊(1):1/1000 
        翅膀(1):1/1000 
        诅咒(1):1/1000
        */
        // TODO 目前只有等级丹是做了动态变化的
        this.showList = []
        // 添加 消耗物品
        this.showList.push({ id: `100${stage}`, value: 70, type: Type.Drug, count: 1 })
        this.showList.push({ id: `100${stage}`, value: 30, type: Type.Drug, count: 6 - stage })
        this.showList.push({ id: `1007`, value: 150, type: Type.Drug, count: 5 * Math.pow(2, stage) })
        this.showList.push({ id: `1008`, value: 2, type: Type.Drug, count: 1 })
        // 添加 材料物品
        this.showList.push({ id: `200${stage}`, value: 400, type: Type.Mat, count: 1 })
        this.showList.push({ id: `200${stage}`, value: 200, type: Type.Mat, count: 2 })
        this.showList.push({ id: `200${stage}`, value: 100, type: Type.Mat, count: 3 })
        this.showList.push({ id: `200${stage}`, value: 43, type: Type.Mat, count: 5 })
        this.showList.push({ id: `2100`, value: 2, type: Type.Mat, count: 5 })
        // 添加 特殊物品
        this.showList.push({ id: `700${stage < 3 ? 0 : stage < 5 ? 1 : stage < 7 ? 2 : 3}`, value: 1, type: Type.Spec, count: 1 })
        // 添加 翅膀物品
        this.showList.push({ id: `800${stage > 0 ? stage - 1 : stage}`, value: 1, type: Type.Wing, count: 1 })
        // 添加 诅咒物品
        this.showList.push({ id: `900${stage < 3 ? 0 : stage < 5 ? 1 : stage < 7 ? 2 : 3}`, value: 1, type: Type.Cut, count: 1 })

        // 乱序
        this.showList.sort(function (a, b) { return Math.random() > 0.5 ? -1 : 1 })
        // 记录一个下标
        this.showList.forEach((val, idx) => {
            val.idx = idx
        })

        let score = 0
        for (var i = 0; i < this.showList.length; i++) {
            score += this.showList[i].value
        }
        if (score != 1000) {
            cc.error(`cfg score${score} err`)
        }
    },

    initRewardValue: function () {
        this.allList = []
        this.showList.forEach((val, idx) => {
            for (var i = 0; i < val.value; i++) {
                this.allList.push({ id: val.id, count: val.count, idx: val.idx })
            }
        })
        // 乱序
        this.allList.sort(function (a, b) { return Math.random() > 0.5 ? -1 : 1 })
    },

    showPropList: function () {
        this.showList.forEach((it, idx) => {
            SetSpriteFrame(`grade/${PropList[it.id].grade}`, this.listRoot.children[idx].PathChild('Grade', cc.Sprite))
            SetSpriteFrame(`prop/${it.id}`, this.listRoot.children[idx].PathChild('Icon', cc.Sprite))
            this.listRoot.children[idx].PathChild('Count', cc.Label).string = `X${it.count}`
        })
    },

    pushBackpack: function () {
        // 放进背包
        for (var i = 0; i < this.rewards.length; i++) {
            let prop = Clone(PropList[this.rewards[i].id])
            prop.count = this.rewards[i].count
            wlgj.propCtrl.pushBackpack(prop)
        }
        // 清空获奖列表
        this.rewards = []
    },

    getFlyItem: function () {
        let node = this.allFlyItems.pop()
        if (!node) {
            node = cc.instantiate(this.grade)
        }
        node.parent = this.node
        return node
    },

    flyToBackpack: function (node, cb) {
        // 往上弹一下
        let actionUp = cc.spawn(
            cc.fadeIn(0.6).easing(cc.easeExponentialOut()),
            cc.moveBy(0.6, -30, 60).easing(cc.easeExponentialOut())
        )
        // 往下飞 + 渐隐
        let spa = cc.spawn(
            cc.moveTo(0.5, -94.8, -581.5).easing(cc.easeExponentialIn()),
            cc.fadeOut(0.5).easing(cc.easeExponentialIn()),
        )
        // 回调
        if (!cb) {
            cb = cc.callFunc(() => { })
        }
        node.runAction(cc.sequence(actionUp, spa, cb))
    },

    randomAnimation: function (count) {
        if (count == 0) {
            this.select.runAction(cc.sequence(
                cc.fadeOut(0.2),
                cc.fadeIn(0.2),
                cc.fadeOut(0.2),
                cc.fadeIn(0.2),
                cc.fadeOut(0.2),
                cc.fadeIn(0.2),
                cc.callFunc(() => {
                    let id = this.showList[(this.selectIdx - 1) % this.listRoot.children.length].id
                    let node = this.getFlyItem()
                    SetSpriteFrame(`grade/${PropList[id].grade}`, node.getComponent(cc.Sprite))
                    SetSpriteFrame(`prop/${id}`, node.PathChild('icon', cc.Sprite))
                    let pos = this.listRoot.children[(this.selectIdx - 1) % this.listRoot.children.length]
                    node.setPosition(pos.x, pos.y + 15)
                    node.opacity = 0
                    // 飞向背包动画
                    this.flyToBackpack(node, cc.callFunc(() => {
                        this.select.y = 2222
                        node.y = 2222
                        this.allFlyItems.push(node)
                        this.forbid.active = false
                    }))
                })
            ))
            return
        }
        let pos = this.listRoot.children[this.selectIdx % this.listRoot.children.length]
        this.select.runAction(cc.sequence(
            cc.callFunc(() => { this.select.setPosition(pos.x, pos.y + 15) }),
            cc.delayTime(1 / count * 0.7),
            cc.callFunc(() => { this.selectIdx++; this.randomAnimation(--count) }),
        ))
    },

    randomTenAnimation: function (indexs) {
        this.shakeAnimation.play()
        let animState = this.shakeAnimation.getAnimationState('shake')
        if (animState) {
            animState.on('stop', (event) => {
                indexs.forEach((val, idx) => {
                    let node = this.listRoot.children[val]
                    node.runAction(cc.sequence(
                        cc.delayTime(idx * 0.7),
                        cc.callFunc(() => {
                            this.indexCount++
                            this.count.string = `幸运十连抽${this.indexCount} / 10次`
                        }),
                        cc.scaleTo(0.5, 1.2, 1.2),
                        cc.scaleTo(0.2, 1, 1),
                        cc.callFunc(() => {
                            let newIdx = idx
                            let pos = this.listRoot.children[indexs[newIdx]].getPosition()
                            this.allSelect.children[newIdx].setPosition(pos.x, pos.y + 15)
                            if (newIdx == indexs.length - 1) {
                                this.node.runAction(cc.sequence(
                                    cc.delayTime(1),
                                    cc.callFunc(() => {
                                        let temp = []
                                        for (var i = 0; i < indexs.length; i++) {
                                            let c = indexs[i] % this.showList.length
                                            if (temp.indexOf(c) == -1) {
                                                temp.push(c)
                                            }
                                        }
                                        for (var i = 0; i < temp.length; i++) {
                                            let node = this.getFlyItem()
                                            SetSpriteFrame(`grade/${this.showList[temp[i]].grade}`, node.getComponent(cc.Sprite))
                                            SetSpriteFrame(`prop/${this.showList[temp[i]].id}`, node.PathChild('icon', cc.Sprite))
                                            let pos = this.listRoot.children[temp[i]]
                                            node.setPosition(pos.x, pos.y + 15)
                                            node.opacity = 0
                                            // 飞向背包动画
                                            let newI = i
                                            this.node.runAction(cc.sequence(
                                                cc.delayTime(newI * 0.1),
                                                cc.callFunc(() => {
                                                    this.flyToBackpack(node, cc.callFunc(() => {
                                                        node.y = 2222
                                                        this.allFlyItems.push(node)
                                                        if (newI == temp.length - 1) {
                                                            this.allSelect.children.forEach((it) => {
                                                                it.setPosition(0, 2222)
                                                                this.count.node.active = false
                                                                this.forbid.active = false
                                                            })
                                                        }
                                                    }))
                                                }),
                                            ))
                                        }
                                    }),
                                ))
                            }
                        }),
                    ))
                })
            }, this);
        }
    },

    calculateOffset: function (newIdx) {
        let count = 0
        while (true) {
            if ((this.selectIdx + count) % this.listRoot.children.length == newIdx) {
                break
            }
            count++
        }
        count = count < this.listRoot.children.length / 2 ? count + this.listRoot.children.length * 2 : count + this.listRoot.children.length
        return ++count
    },

    btnItem: function (event, idx) {
        UiMgr.show("MsgBoxShowDetailPanel", { prop: PropList[this.showList[idx].id] })
    },

    btnOne: function () {
        if (player.coin - this.consume.one < 0) {
            UiMgr.show('MsgBoxAutoHidePanel', '剩余的金币不足')
            return
        }
        // 开启遮罩 防止一直点击
        this.forbid.active = true
        // 获得随机到的道具
        this.rewards.push(this.allList[GetLimiteRandom(0, 1000)])
        // 计算当前位置到随机道具位置的距离
        let count = this.calculateOffset(this.rewards[0].idx)
        // 播放随机动画
        this.randomAnimation(count)
        // 扣钱
        player.coin -= this.consume.one
        // 直接放进背包 避免玩家突然断开不能领奖的现象
        this.pushBackpack()
        // 刷新玩家界面
        wlgj.playerCtrl.show()
    },

    btnTen: function () {
        if (player.coin - this.consume.ten < 0) {
            UiMgr.show('MsgBoxAutoHidePanel', '剩余的金币不足')
            return
        }
        // 显示十连抽次数
        this.count.node.active = true
        this.indexCount = 0

        this.count.string = `幸运十连抽${this.indexCount} / 10次`
        // 开启遮罩 防止一直点击
        this.forbid.active = true
        // 获得随机到的道具
        let indexs = []
        for (var i = 0; i < 10; i++) {
            let idx = GetLimiteRandom(0, 1000)
            indexs.push(this.allList[idx].idx)
            this.rewards.push(this.allList[idx])
        }
        this.rewards.sort(function (a, b) { return a.id - b.id })
        // 播放随机动画
        this.randomTenAnimation(indexs)
        // 扣钱
        player.coin -= this.consume.ten
        // 直接放进背包 避免玩家突然断开不能领奖的现象
        this.pushBackpack()
        // 刷新玩家界面
        wlgj.playerCtrl.show()
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
