cc.Class({
    extends: cc.Component,

    properties: {
        warover: cc.Node,
        equip: [cc.Sprite],
        guang: [cc.Sprite],
        confirm: cc.Node,
        content: cc.Node,
        item: cc.Node,
    },

    onLoad: function () {
        // 数据
        this.model = {
            cache: [],
            selected: [],
            takeOffIdxToList: { 0: null, 1: null, 2: null },
        }
    },

    init: function () {
        // 隐藏合成节点
        this.confirm.active = false
        // 清空列表
        this.equipIdx = []
        // 清空已选的列表
        this.model.selected = []
        this.model.takeOffIdxToList = { 0: null, 1: null, 2: null }
        // 清空显示
        this.clearEquip()
        // 设置需要显示的装备列表
        this.setEquipIdxFromPackage()
        // 显示装备列表
        this.showEquipList()
    },

    clearEquip: function () {
        for (var i = 0; i < this.equip.length; i++) {
            this.equip[i].spriteFrame = null
            this.guang[i].spriteFrame = null
        }
    },

    setEquipIdxFromPackage: function () {
        // 这里给背包排个序 方便把同样的道具显示在一起
        player.backpack.sort(function (a, b) { return a.id - b.id })
        for (var i = 0; i < player.backpack.length; i++) {
            let prop = player.backpack[i]
            if (IsEmpty(prop)) {
                continue
            }
            if (prop.type == Type.Equip ||
                prop.type == Type.Spec ||
                prop.type == Type.Wing ||
                prop.type == Type.Cut) {
                this.equipIdx.push(i)
            }
        }
    },

    showEquipList: function () {
        for (var i = 0; i < this.equipIdx.length; i++) {
            let item = this.model.cache.pop()
            if (!item) {
                item = new cc.instantiate(this.item)
            }
            SetSpriteFrame(`grade/${player.backpack[this.equipIdx[i]].grade}`, item.PathChild('guang', cc.Sprite))
            SetSpriteFrame(`prop/${player.backpack[this.equipIdx[i]].id}`, item.PathChild('Fg', cc.Sprite))
            this.content.addChild(item)
        }
    },

    clearItem: function () {
        // 回收item
        while (this.content.children.length) {
            let item = this.content.children[this.content.children.length - 1]
            item.PathChild('guang', cc.Sprite).spriteFrame = null
            item.PathChild('Fg', cc.Sprite).spriteFrame = null
            item.PathChild('Mask').active = false
            item.x = 1e8
            this.content.removeChild(item)
            this.model.cache.push(item)
        }
    },

    check: function () {
        if (this.model.selected.length != 3) {
            UiMgr.show('MsgBoxAutoHidePanel', '请选择3件物品进行合成')
            return false
        }
        let id = player.backpack[this.equipIdx[this.model.selected[0]]].id
        let grade = player.backpack[this.equipIdx[this.model.selected[0]]].grade
        for (var i = 1; i < this.model.selected.length; i++) {
            if (player.backpack[this.equipIdx[this.model.selected[i]]].id != id) {
                UiMgr.show('MsgBoxAutoHidePanel', '必须是同类型的物品')
                return false
            }
            if (player.backpack[this.equipIdx[this.model.selected[i]]].grade != grade) {
                UiMgr.show('MsgBoxAutoHidePanel', '必须是同品质的物品')
                return false
            }
            if (player.backpack[this.equipIdx[this.model.selected[i]]].type == Type.Equip) {
                if (player.backpack[this.equipIdx[this.model.selected[i]]].place != player.backpack[this.equipIdx[this.model.selected[0]]].place) {
                    UiMgr.show('MsgBoxAutoHidePanel', '必须是同样的部件才能合成')
                    return false
                }
            }
        }
        return true
    },

    btnItem: function (event) {
        let idx = this.content.children.indexOf(event.currentTarget)
        // 显示当前点击item的mask
        this.content.children[idx].PathChild('Mask').active = true
        // 
        for (var i = 0; i < this.equip.length; i++) {
            if (this.equip[i].spriteFrame != null) {
                continue
            }
            this.content.children[idx].PathChild('guang', cc.Sprite).spriteFrame = null
            SetSpriteFrame(`grade/${player.backpack[this.equipIdx[idx]].grade}`, this.guang[i])
            SetSpriteFrame(`prop/${player.backpack[this.equipIdx[idx]].id}`, this.equip[i])
            // 这里记录一个已选的下标转列表下标 主要是为了解决点击已选的装备 可以回退列表的Mask状态
            this.model.takeOffIdxToList[i] = idx
            break
        }
        this.model.selected.push(idx)

        this.confirm.active = this.model.selected.length == 3
    },

    btnTakeOff: function (event, idx) {
        if (this.model.takeOffIdxToList[idx] == null) {
            return
        }
        let i = this.model.selected.indexOf(this.model.takeOffIdxToList[idx])
        if (i == -1) {
            cc.error(`i is err(${i})`)
            return
        }
        this.model.selected.splice(i, 1)
        SetSpriteFrame(`grade/${player.backpack[this.equipIdx[this.model.takeOffIdxToList[idx]]].grade}`, this.content.children[this.model.takeOffIdxToList[idx]].PathChild('guang', cc.Sprite))
        this.content.children[this.model.takeOffIdxToList[idx]].PathChild('Mask').active = false
        this.equip[idx].spriteFrame = null
        this.guang[idx].spriteFrame = null
        this.confirm.active = this.model.selected.length == 3
    },

    btnConfirm: function () {
        if (this.check()) {
            this.confirm.active = false
            this.warover.runAction(cc.sequence(
                cc.rotateBy(2, 3600).easing(cc.easeSineInOut()),
                cc.callFunc(() => {
                    // 品级+1
                    player.backpack[this.equipIdx[this.model.selected[0]]].grade += 1
                    // 删除合成的材料
                    for (var i = 1; i < this.model.selected.length; i++) {
                        wlgj.propCtrl.removeProp(this.equipIdx[this.model.selected[i]], 1)
                    }
                    // 回收
                    this.clearItem()
                    // 隐藏合成节点
                    this.confirm.active = false
                    // 清空列表
                    this.equipIdx = []
                    // 清空已选的列表
                    this.model.selected = []
                    this.model.takeOffIdxToList = { 0: null, 1: null, 2: null }
                    // 清空显示
                    this.clearEquip()
                    // 设置需要显示的装备列表
                    this.setEquipIdxFromPackage()
                    // 显示装备列表
                    this.showEquipList()
                    // 提示
                    UiMgr.show('MsgBoxAutoHidePanel', '合成成功')
                }),
            ))
        }
    },

    btnClose: function () {
        this.clearItem()
        UiMgr.hide(this.node.name)
    },
});
