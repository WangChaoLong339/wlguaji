cc.Class({
    extends: cc.Component,

    properties: {
        currency: cc.Node,
        content: cc.Node,
        item: cc.Node,
        topBtn: cc.Node,
        setRoot: cc.Node,
        animForbid: cc.Node,
        openBoxAnim: cc.Node,
    },

    onLoad: function () {
        // 回收等级
        this.recoverLimit = GetLocalStorage('WLGJ_SHOPPANEL_RECOVER_LIMIT') || { drug: false, mat: false, equip: 1 }
        // 设置背包上限
        this.maxCellCount = 105
        // 创建格子
        this.createCell()
        // 金币Label
        this.coin = this.currency.PathChild('coinLogo/val', cc.Label)
        // 钻石Label
        this.diam = this.currency.PathChild('diamLogo/val', cc.Label)
        // 回收中
        this.inChoice = false
        // 类型转提示字符串
        this.typeToTips = {}
        this.typeToTips[Type.Drug] = '使用'
        this.typeToTips[Type.Mat] = ''
        this.typeToTips[Type.Equip] = '装备'
        this.typeToTips[Type.Spec] = '装备'
        this.typeToTips[Type.Wing] = '装备'
        this.typeToTips[Type.Cut] = '装备'
    },

    createCell: function () {
        for (var i = 0; i < this.maxCellCount; i++) {
            let cell = cc.instantiate(this.item)
            this.content.addChild(cell)
        }
    },

    init: function () {
        // 填充背包
        this.show()
        // 顶部按钮
        this.updateTopBtn()
        // 隐藏设置节点
        this.hideSet()
        // 
        this.animForbid.active = false
    },

    show: function () {
        for (var i = 0; i < this.maxCellCount; i++) {
            let cell = this.content.children[i]
            cell.PathChild('Toggle').active = false
            if (i < player.backpack.length && !IsEmpty(player.backpack[i])) {
                let prop = player.backpack[i]
                SetSpriteFrame(`grade/${prop.grade}`, cell.PathChild('Grade', cc.Sprite))
                SetSpriteFrame(`prop/${prop.id}`, cell.PathChild('Fg', cc.Sprite))
                cell.PathChild('Count', cc.Label).string = `X${prop.count}`
            } else {
                SetSpriteFrame(null, cell.PathChild('Grade', cc.Sprite))
                SetSpriteFrame(null, cell.PathChild('Fg', cc.Sprite))
                cell.PathChild('Count', cc.Label).string = ''
            }
        }
        this.coin.string = `${player.coin}`
        this.diam.string = `${player.diam}`
    },

    playerOpenBoxAnim: function (propId) {
        // 打开动画遮罩 防止乱点
        this.animForbid.active = true
        // 道具位置初始化
        this.openBoxAnim.PathChild('Mask/Grade').setPosition(-29.6, -100)
        // 箱子状态初始化
        SetSpriteFrame('backpack/box_close', this.openBoxAnim.getComponent(cc.Sprite))
        // 箱子位置初始化
        this.openBoxAnim.setPosition(0, cc.winSize.height / 2)
        // 箱子透明度初始化
        this.openBoxAnim.opacity = 255
        // 箱子可见性初始化
        this.openBoxAnim.active = true
        // 动画
        this.openBoxAnim.runAction(cc.sequence(
            // 箱子掉下来
            cc.moveTo(0.5, 0, 0).easing(cc.easeBounceOut()),
            // 停顿0.5s
            cc.delayTime(0.5),
            // 摇一摇
            cc.repeat(cc.sequence(
                cc.rotateBy(0.03, 5),
                cc.rotateBy(0.03, -10),
                cc.rotateBy(0.03, 5),
            ), 10),
            cc.callFunc(() => {
                // 箱子打开
                SetSpriteFrame('backpack/box_open', this.openBoxAnim.getComponent(cc.Sprite))
                SetSpriteFrame(`grade/${PropList[propId].grade}`, this.openBoxAnim.PathChild('Mask/Grade', cc.Sprite))
                SetSpriteFrame(`prop/${propId}`, this.openBoxAnim.PathChild('Mask/Grade/Prop', cc.Sprite))
                this.openBoxAnim.PathChild('Mask/Grade/val').color = GradeToColor(PropList[propId].grade)
                this.openBoxAnim.PathChild('Mask/Grade/val', cc.Label).string = PropList[propId].name
                this.openBoxAnim.PathChild('Mask/Grade').runAction(cc.sequence(
                    // 停顿0.2s
                    cc.delayTime(0.2),
                    // 道具飘出来
                    cc.moveTo(1, 12, 55.3).easing(cc.easeBackOut()),
                    // 停顿0.2s
                    cc.delayTime(1),
                    cc.callFunc(() => {
                        this.openBoxAnim.runAction(cc.sequence(
                            // 箱子渐隐
                            cc.fadeOut(1),
                            cc.callFunc(() => {
                                this.animForbid.active = false
                                this.openBoxAnim.active = false
                                this.show()
                            }),
                        ))
                    }),
                ))
            }),
        ))
    },

    updateTopBtn: function () {
        this.topBtn.PathChild('recover').active = !this.inChoice
        this.topBtn.PathChild('inChoice').active = this.inChoice
    },

    showToggle: function () {
        for (var i = 0; i < player.backpack.length; i++) {
            if (!IsEmpty(player.backpack[i])) {
                this.content.children[i].PathChild('Toggle').active = true
            }
        }
    },

    hideToggle: function () {
        for (var i = 0; i < this.content.children.length; i++) {
            let cell = this.content.children[i]
            cell.PathChild('Toggle', cc.Toggle).isChecked = false
            cell.PathChild('Toggle').active = false
        }
    },

    showSet: function () {
        this.setRoot.PathChild('drug/toggle', cc.Toggle).isChecked = this.recoverLimit.drug
        this.setRoot.PathChild('mat/toggle', cc.Toggle).isChecked = this.recoverLimit.mat
        this.setRoot.PathChild('equip/editBox', cc.EditBox).string = this.recoverLimit.equip
        this.setRoot.active = true
    },

    hideSet: function () {
        this.setRoot.active = false
    },

    resetRecover: function () {
        this.inChoice = false
        this.updateTopBtn()
        this.hideToggle()
    },

    btnOnekeyRecover: function () {
        for (var i = 0; i < player.backpack.length; i++) {
            let prop = player.backpack[i]
            if (IsEmpty(prop) ||                                                    // 空格子
                (prop.type == Type.Drug && !this.recoverLimit.drug) ||              // 不回收消耗类
                (prop.type == Type.Mat && !this.recoverLimit.mat) ||                // 不回收材料类
                (prop.type == Type.Equip && prop.lv > this.recoverLimit.equip)) {   // 大于回收等级
                continue
            }
            wlgj.propCtrl.sellProp(i, player.backpack[i].count)
        }
        // 刷新背包
        this.show()
        // 储存到本地 TODO 后期需要上传服务器
        SetLocalStorage("WLGJ_PLAYER", player)
    },

    btnRecover: function () {
        this.inChoice = true
        this.updateTopBtn()
        this.showToggle()
    },

    btnConfirmRecover: function () {
        for (var i = 0; i < this.content.children.length; i++) {
            let cell = this.content.children[i]
            if (cell.PathChild('Toggle', cc.Toggle).isChecked) {
                wlgj.propCtrl.sellProp(i, player.backpack[i].count)
            }
        }
        // 刷新背包
        this.show()
        // 储存到本地 TODO 后期需要上传服务器
        SetLocalStorage("WLGJ_PLAYER", player)
        // 还原顶部按钮状态
        this.resetRecover()
    },

    btnCancel: function () {
        // 还原顶部按钮状态
        this.resetRecover()
    },

    btnProp: function (event) {
        let idx = this.content.children.indexOf(event.currentTarget)
        let prop = player.backpack[idx]
        if (!prop || IsEmpty(prop)) {
            return
        }
        UiMgr.show('MsgBoxShowDetailPanel', {
            prop: prop,
            btnInfo: this.typeToTips[prop.type],
            cb: function () {
                wlgj.propCtrl.useProp(idx, 1, function (id) {
                    if (player.backpack[idx].id == 1008) {
                        this.playerOpenBoxAnim(id)
                    } else {
                        UiMgr.show('MsgBoxAutoHidePanel', `使用成功`)
                        this.show()
                    }
                }.bind(this))
            }.bind(this),
            cb1: function () {
                wlgj.propCtrl.useProp(idx, prop.count)
                this.show()
            }.bind(this),
        })
    },

    btnUpdateBackpack: function () {
        // 还原顶部按钮状态
        this.resetRecover()
        let temp = Clone(player.backpack)
        player.backpack = []
        for (var i = 0; i < temp.length; i++) {
            if (!IsEmpty(temp[i])) {
                player.backpack.push(temp[i])
            }
        }
        player.backpack.sort(function (a, b) { return a.id - b.id })
        // 刷新背包
        this.show()
        // 储存到本地 TODO 后期需要上传服务器
        SetLocalStorage("WLGJ_PLAYER", player)
    },

    btnSet: function () {
        this.showSet()
    },

    btnSetConfirm: function () {
        // 赋值
        this.recoverLimit.drug = this.setRoot.PathChild('drug/toggle', cc.Toggle).isChecked
        this.recoverLimit.mat = this.setRoot.PathChild('mat/toggle', cc.Toggle).isChecked
        this.recoverLimit.equip = parseInt(this.setRoot.PathChild('equip/editBox', cc.EditBox).string)
        // 隐藏节点
        this.hideSet()
        // 缓存
        SetLocalStorage('WLGJ_SHOPPANEL_RECOVER_LIMIT', this.recoverLimit)
    },

    btnClose: function () {
        // 还原顶部按钮状态
        this.resetRecover()
        UiMgr.hide(this.node.name)
    },
});
