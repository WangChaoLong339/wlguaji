cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        RegisterGlobal("wlgj", this)
        // 首次登陆的奖品
        this.firstLoginReward = {
            coin: 500000,
            diam: 1000000,
            prop: [
                { id: 5000, count: 1 },
                { id: 5001, count: 1 },
                { id: 5002, count: 1 },
                { id: 5003, count: 1 },
                { id: 5004, count: 1 },
                { id: 5005, count: 1 },
            ],
        }
        //prefab管理
        window.UiMgr = this.node.PathChild("UiPanelRoot", "UiMgr")

        // 玩家脚本
        this.playerCtrl = this.node.PathChild("PlayerRoot", "PlayerCtrl")
        // 道具脚本
        this.propCtrl = this.node.PathChild("PropRoot", "PropCtrl")
        // 转盘背景节点
        this.turnTabelBg = this.node.PathChild("TurnTableRoot/TurnTable")
        // Logo
        this.logo = this.node.PathChild("Logo")
        // 更新按钮状态
        let status = GetLocalStorage('WLGJ_FIRST_REWARD')
        this.node.PathChild("BeginReward").active = !status
    },

    onEnable: function () {
        this.turnTabelBg.runAction(cc.repeatForever(cc.rotateBy(3, 360)))
        this.logo.runAction(cc.repeatForever(cc.scaleBy(4, -1, 1)))
    },

    onDisable: function () {
        UnRegisterGlobal("wlgj")
    },

    btnBeginReward: function () {
        UiMgr.show('MsgBoxPanel', {
            title: '系统提示',
            val: `首次登陆游戏,赠送${this.firstLoginReward.coin}金币,${this.firstLoginReward.diam}钻石`,
            btn1: function () {
                player.coin += this.firstLoginReward.coin
                player.diam += this.firstLoginReward.diam
                // 更新玩家主页信息
                wlgj.playerCtrl.show()
                this.node.PathChild("BeginReward").active = false
                SetLocalStorage('WLGJ_FIRST_REWARD', true)
                // 储存到本地 TODO 后期需要上传服务器
                SetLocalStorage("WLGJ_PLAYER", player)
            }.bind(this),
        })
    },

    btnHelp: function () {
        UiMgr.show("HelpPanel")
    },

    btnBossHome: function () {
        UiMgr.show("MsgBoxAutoHidePanel", "[Boss之家]正在开发中...")
    },

    btnTurnTable: function () {
        UiMgr.show("TurnTablePanel")
    },

    btnDetail: function () {
        UiMgr.show("DetailPanel")
    },

    btnPkg: function () {
        UiMgr.show("BackpackPanel")
    },

    btnShop: function () {
        UiMgr.show('ShopPanel')
    },

    btnStageSelect: function () {
        UiMgr.show('StageSelectPanel')
    },

    btnCompound: function () {
        UiMgr.show('CompoundPanel')
    },

    btnFeather: function () {
        UiMgr.show('WingPanel')
    },

    btnCurse: function () {
        UiMgr.show('CursePanel')
    },
});
