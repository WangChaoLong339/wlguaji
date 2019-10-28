cc.Class({
    extends: cc.Component,

    properties: {
        prefabs: [cc.Prefab],
    },

    onLoad: function () {
        this.model = {
            // 所有预制资源
            prefabs: {},

            // 层级管理
            hierarchy: [
                'HelpPanel',
                'DetailPanel',
                'BackpackPanel',
                'CompoundPanel',
                'ShopPanel',
                'TurnTablePanel',
                'StageSelectPanel',
                'CombatPanel',
                'MsgBoxShowDetailPanel',
                'MsgBoxAutoHidePanel',
                'MsgBoxPanel',
            ]
        }

        // 加载并设置层级
        this.pushPrefab()
    },

    pushPrefab: function () {
        // 加载所有预制
        this.model.hierarchy.forEach((val) => {
            this.prefabs.forEach((prefab) => {
                if (prefab.name == val) {
                    // 缓存预制
                    this.model.prefabs[prefab.name] = cc.instantiate(prefab)
                    this.node.addChild(this.model.prefabs[prefab.name])
                    this.model.prefabs[prefab.name].active = false
                }
            });
        })
    },

    show: function (name) {
        if (this.model.prefabs[name]) {
            this.model.prefabs[name].active = true
            this.model.prefabs[name].getComponent(name).init(arguments[1])
        } else {
            cc.error(`prefab(${name}) is not exist`)
        }
    },

    hide: function (name) {
        if (this.model.prefabs[name]) {
            this.model.prefabs[name].active = false
        } else {
            cc.error(`prefab(${name}) is not exist`)
        }
    },

    get: function (name) {
        if (this.model.prefabs[name]) {
            return this.model.prefabs[name].getComponent(name)
        } else {
            cc.error(`component(${name}) is not exist`)
        }
    },
});
