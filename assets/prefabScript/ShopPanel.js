cc.Class({
    extends: cc.Component,

    properties: {
        currency: cc.Node,
        content: cc.Node,
        waresItem: cc.Node,
        countdown: cc.Label,
    },

    onLoad: function () {
        // 定义后缀名
        this.currencyInfo = {}
        this.currencyInfo[CurrencyType.Coin] = { prefix: 'logo_consume_copper', name: '金币' }
        this.currencyInfo[CurrencyType.Diam] = { prefix: 'logo_consume_diamonds', name: '钻石' }
        this.currencyInfo[CurrencyType.Exchange] = { prefix: 'logo_consume_exchange', name: '装备兑换卷' }
        // 配置一个刷新时间(s)
        this.loopTime = 600
        // 刷新商品
        this.updateShop()
    },

    updateCountdown: function () {
        let now = new Date().getTime() / 1000
        let offsetTime = parseInt(now - EnterGameTime) % this.loopTime
        this.countdown.string = `${this.secondToString(this.loopTime - offsetTime)} 自动刷新商城`
        // 倒计时结束
        if (this.loopTime - offsetTime <= 0) {
            EnterGameTime = new Date().getTime() / 1000
            // 刷新商品
            this.updateShop()
        }
        this.node.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.updateCountdown()
            }),
        ))
    },

    secondToString: function (second) {
        let str = ''
        let h = parseInt(second / 3600)
        str += h > 0 ? h >= 10 ? h : '0' + h + ':' : '00:'
        let m = parseInt((second % 3600) / 60)
        str += m > 0 ? m >= 10 ? m : '0' + m + ":" : "00:"
        let s = parseInt(second % 60)
        str += s >= 10 ? s : '0' + s
        return str
    },

    init: function () {
        // 开始刷新时间
        this.updateCountdown()
        // 每次进入界面自动回滚到顶部
        this.content.parent.parent.getComponent(cc.ScrollView).scrollToTop()
        // 计算兑换卷的张数
        this.calculateExchangeCount()
        // 刷新货币
        this.updateCurrency()
    },

    updateCurrency: function () {
        // 金币
        this.currency.PathChild('logo_coin/val', cc.Label).string = `${player.coin}`
        // 钻石
        this.currency.PathChild('logo_diam/val', cc.Label).string = `${player.diam}`
        // 兑换卷
        this.currency.PathChild('logo_exch/val', cc.Label).string = `${this.exchangeCount}`
    },

    calculateExchangeCount: function () {
        this.exchangeIdx = -1
        this.exchangeCount = 0
        for (var i = 0; i < player.backpack.length; i++) {
            if (player.backpack[i].id == 2100) {
                this.exchangeIdx = i
                this.exchangeCount = player.backpack[i].count
                break
            }
        }
    },

    updateShop: function () {
        // 一般不超过20件商品
        this.waresList = [
            // 消耗
            { id: 1000, consumeType: CurrencyType.Coin, consumeValue: 1000, purchased: false },
            { id: 1001, consumeType: CurrencyType.Coin, consumeValue: 2000, purchased: false },
            { id: 1002, consumeType: CurrencyType.Coin, consumeValue: 3000, purchased: false },
            { id: 1003, consumeType: CurrencyType.Coin, consumeValue: 3000, purchased: false },
            { id: 1004, consumeType: CurrencyType.Diam, consumeValue: 500, purchased: false },
            { id: 1005, consumeType: CurrencyType.Diam, consumeValue: 1000, purchased: false },
            { id: 1006, consumeType: CurrencyType.Diam, consumeValue: 2000, purchased: false },
            // 装备
            { id: 5100, consumeType: CurrencyType.Exchange, consumeValue: 100, purchased: false },
            { id: 5101, consumeType: CurrencyType.Exchange, consumeValue: 80, purchased: false },
            { id: 5102, consumeType: CurrencyType.Exchange, consumeValue: 50, purchased: false },
            { id: 5103, consumeType: CurrencyType.Exchange, consumeValue: 50, purchased: false },
            { id: 5104, consumeType: CurrencyType.Exchange, consumeValue: 50, purchased: false },
            { id: 5105, consumeType: CurrencyType.Exchange, consumeValue: 50, purchased: false },
            { id: 5240, consumeType: CurrencyType.Exchange, consumeValue: 1000, purchased: false, },
            { id: 5241, consumeType: CurrencyType.Exchange, consumeValue: 800, purchased: false, },
            { id: 5242, consumeType: CurrencyType.Exchange, consumeValue: 500, purchased: false, },
            { id: 5243, consumeType: CurrencyType.Exchange, consumeValue: 500, purchased: false, },
            { id: 5244, consumeType: CurrencyType.Exchange, consumeValue: 500, purchased: false, },
            { id: 5245, consumeType: CurrencyType.Exchange, consumeValue: 500, purchased: false, },
        ]
        // 显示商品
        this.showWares()
    },

    showWares: function () {
        this.content.removeAllChildren()
        for (var i = 0; i < this.waresList.length; i++) {
            let item = cc.instantiate(this.waresItem)
            // icon
            SetSpriteFrame(`prop/${this.waresList[i].id}`, item.PathChild('icon', cc.Sprite))
            // 名称
            item.PathChild('nickname', cc.Label).string = `${PropList[this.waresList[i].id].name}`
            // 名称颜色
            item.PathChild('nickname').color = GradeToColor(PropList[this.waresList[i].id].grade)
            // 详情
            item.PathChild('detail', cc.Label).string = `${PropList[this.waresList[i].id].detail}`
            // 是否已购买
            item.PathChild('tag').active = this.waresList[i].purchased
            // 消耗货币类型
            SetSpriteFrame(`home/${this.currencyInfo[this.waresList[i].consumeType].prefix}`, item.PathChild('consumeType', cc.Sprite))
            // 消耗货币金额
            item.PathChild('consumeType/consumeValue', cc.Label).string = `${this.waresList[i].consumeValue}`
            // 
            item.PathChild('buy/val', cc.Label).string = this.waresList[i].consumeType == CurrencyType.Exchange ? '兑换' : '购买'
            this.content.addChild(item)
        }
    },

    btnItem: function (event) {
        let idx = this.content.children.indexOf(event.currentTarget.parent)
        UiMgr.show("MsgBoxShowDetailPanel", { prop: PropList[this.waresList[idx].id] })
    },

    btnBuy: function (event) {
        let idx = this.content.children.indexOf(event.currentTarget.parent)
        let prop = this.waresList[idx]
        UiMgr.show('MsgBoxPanel', {
            title: '系统提示',
            val: `是否花费${prop.consumeValue}${this.currencyInfo[prop.consumeType].name}${prop.consumeType == CurrencyType.Exchange ? '兑换' : '购买'}${PropList[prop.id].name}?`,
            btn1: function () {
                // 扣钱
                if (prop.consumeType == CurrencyType.Coin) {
                    if (player.coin - prop.consumeValue < 0) {
                        UiMgr.show('MsgBoxAutoHidePanel', '[金币]不足')
                        return
                    }
                    player.coin -= prop.consumeValue
                } else if (prop.consumeType == CurrencyType.Diam) {
                    if (player.diam - prop.consumeValue < 0) {
                        UiMgr.show('MsgBoxAutoHidePanel', '[钻石]不足')
                        return
                    }
                    player.diam -= prop.consumeValue
                } else if (prop.consumeType == CurrencyType.Exchange) {
                    if (this.exchangeCount - prop.consumeValue < 0) {
                        UiMgr.show('MsgBoxAutoHidePanel', '[装备兑换卷]不足')
                        return
                    }
                    this.exchangeCount -= prop.consumeValue
                    wlgj.propCtrl.useProp(this.exchangeIdx, prop.consumeValue)
                }
                // 放进背包
                wlgj.propCtrl.pushBackpack(Clone(PropList[prop.id]))
                // 更新显示
                wlgj.playerCtrl.show()
                // 刷新界面显示
                this.waresList[idx].purchased = true
                this.content.children[idx].PathChild('tag').active = true
                // 刷新货币
                this.updateCurrency()
            }.bind(this),
        })
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
