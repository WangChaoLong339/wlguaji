cc.Class({
    extends: cc.Component,

    onLoad: function () {
        window.config = require('Config')
        config.init()

        window.testPushProp = function (idx, count) {
            let prop = Clone(PropList[idx])
            prop.count = count
            wlgj.propCtrl.pushBackpack(prop)
        }

        // 记录一个进入游戏的时间
        window.EnterGameTime = new Date().getTime() / 1000

        window.SetLocalStorage = function (key, data) {
            cc.sys.localStorage.setItem(key, JSON.stringify(data))
        }

        window.GetLocalStorage = function (key) {
            let data = cc.sys.localStorage.getItem(key)
            if (data) {
                return JSON.parse(data)
            }
            return null
        }

        window.RegisterGlobal = function (k, v) {
            if (window[k]) {
                return
            }
            window[k] = v
        }

        window.UnRegisterGlobal = function (k) {
            if (!window[k]) {
                return
            }
            window[k] = null
        }

        // 品级对应颜色
        window.GradeToColor = function (grade) {
            switch (grade) {
                case Grade.White:
                    return cc.color(255, 255, 255)
                case Grade.Green:
                    return cc.color(0, 255, 0)
                case Grade.Pink:
                    return cc.color(255, 0, 255)
                case Grade.Red:
                    return cc.color(255, 0, 0)
            }
            return cc.Color.WHITE
        }

        window.EffectToString = function (val) {
            switch (val) {
                case 'att':
                    return '攻击'
                case 'def':
                    return '防御'
                case 'hp':
                    return '血量'
                case 'crit':
                    return '暴击'
                case 'crit_rate':
                    return '暴击率'
                case 'dodge':
                    return '闪避'
                case 'dodge_rate':
                    return '闪避率'
                case 'all_rate':
                    return '全属性提升'
                case 'def_rate':
                    return '防御增幅'
                case 'att_rate':
                    return '攻击增幅'
            }
            return ''
        }

        window.Clone = function (obj) {
            return JSON.parse(JSON.stringify(obj))
        }

        // 随机一个左闭右开的数字
        window.GetLimiteRandom = function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        window.IsEmpty = function (obj) {
            for (var i in obj) {
                return false
            }
            return true
        }

        window.SetSpriteFrame = function (path, sprite) {
            if (!path) {
                sprite.spriteFrame = null
                return
            }
            cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    console.log(err)
                    return
                }
                sprite.spriteFrame = spriteFrame
            })
        }


        /*--------------------------------------------------分割线-------------------------------------------------*/
        /*
                                                       分割线以上是常用方法
                                                       分割线以下是扩展方法
        */
        /*--------------------------------------------------分割线-------------------------------------------------*/


        cc.Node.prototype.PathChild = function (path, componentName) {
            let names = path.split('/')
            let nd = null

            for (let i = 0; i < names.length; i++) {
                if (nd) {
                    nd = nd.getChildByName(names[i])
                } else {
                    nd = this.getChildByName(names[i])
                }
            }

            if (componentName) {
                return nd.getComponent(componentName)
            } else {
                return nd
            }
        }
    },
});
