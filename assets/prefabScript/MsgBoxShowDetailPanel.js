cc.Class({
    extends: cc.Component,

    properties: {
        root: cc.Node,
        item: cc.Node,
        title: cc.Node,
        bottom: cc.Node,
    },

    onLoad: function () {
    },

    init: function (info) {
        let prop = info.prop
        // 缓存一下
        this.cb = info.cb
        this.cb1 = info.cb1
        // 清空节点
        this.root.removeAllChildren()
        // name
        let titleNode = cc.instantiate(this.title)
        SetSpriteFrame(`prop/${prop.id}`, titleNode.PathChild('Icon', cc.Sprite))
        titleNode.PathChild('Nickname').color = GradeToColor(prop.grade)
        titleNode.PathChild('Nickname', cc.Label).string = `${prop.name}`
        this.root.addChild(titleNode)
        // detail
        let detailNode = cc.instantiate(this.item)
        detailNode.getComponent(cc.Label).string = `${prop.detail}`
        this.root.addChild(detailNode)
        // sell
        let selllNode = cc.instantiate(this.item)
        selllNode.getComponent(cc.Label).string = `回收可得:${prop.sell}`
        this.root.addChild(selllNode)
        // 如果是装备 特殊
        if (prop.type == PropType.Equip || prop.type == PropType.Spec) {
            // Lv
            let lvNode = cc.instantiate(this.item)
            lvNode.getComponent(cc.Label).string = `装备阶数:${prop.lv}阶`
            this.root.addChild(lvNode)

            // 显示品级颜色
            titleNode.color = GradeToColor(prop.grade)
            for (var i in prop.effect) {
                let node = cc.instantiate(this.item)
                // 如果是几率需要显示百分比
                let val = i.indexOf('_rate') == -1 ? prop.effect[i] : prop.effect[i] + '%'
                node.getComponent(cc.Label).string = `${EffectToString(i)}: +${val}`
                this.root.addChild(node)
            }
        }
        // 如果有回调 或者不是材料类 都需要加点击事件
        if (this.cb && prop.type != PropType.Mat) {
            let bottomNode = cc.instantiate(this.bottom)
            bottomNode.PathChild('use/val', cc.Label).string = info.btnInfo ? info.btnInfo : '使用'
            bottomNode.PathChild('useAll').active = prop.count > 1
            this.root.addChild(bottomNode)
        }
    },

    btnUse: function () {
        this.cb()
        UiMgr.hide(this.node.name)
    },

    btnUseAll: function () {
        this.cb1()
        UiMgr.hide(this.node.name)
    },

    btnClose: function () {
        UiMgr.hide(this.node.name)
    },
});
