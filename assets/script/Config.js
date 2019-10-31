(function () {
    module['exports'] = {
        init: function () {
            // 货币类型
            window.CurrencyType = {
                Coin: 0,        // 金币
                Diam: 1,        // 钻石
                Exchange: 2,    // 兑换券
            }
            // 物品类型
            window.PropType = {
                Drug: 0,   // 消耗类
                Mat: 1,    // 材料类
                Equip: 2,  // 装备类
                Spec: 3,   // 特殊类
            }
            // 装备部位
            window.EquipPlace = {
                Arms: 0,     // 武器
                Clothe: 1,   // 衣服
                Cap: 2,      // 帽子
                Necklace: 3, // 项链
                Ring: 4,     // 戒子
                Boots: 5,    // 靴子
                Spec: 7,     // 特殊
            }
            // 装备品级
            window.Grade = {
                White: 0,   //  白色
                Green: 1,   //  绿色
                Pink: 2,    //  粉红
                Red: 3,     //  红色
            }
            // 怪物属性
            window.property = {
                att: 0,              // 攻击力
                def: 0,              // 防御力
                hp: 0,               // 血量
                crit: 0,             // 暴击
                crit_rate: 0,        // 暴击率
                dodge: 0,            // 闪避
                dodge_rate: 0,       // 闪避率
                grade: Grade.White,  // 品级(白-绿-蓝-橙)
            }
            // 消耗属性
            window.drugProperty = {
                storageHp: 0,  // 增加生命储备
                coin: 1,       // 增加黄金
                ramdonEquip: 2,// 随机装备一件
            }
            // 特殊属性
            window.specProperty = {
                all_rate: 1,    // 全属性增加
            }
            window.PropList = {
                /* 消耗类 */
                1000: { id: 1000, name: '等级丹(初级)', detail: '1-99级使用,可提升玩家一个等级', type: PropType.Drug, sell: 5000, effect: { lv: 1 }, grade: Grade.White, count: 1 },
                1001: { id: 1001, name: '等级丹(高级)', detail: '100-199级使用,可提升玩家一个等级', type: PropType.Drug, sell: 10000, effect: { lv: 1 }, grade: Grade.White, count: 1 },
                1002: { id: 1002, name: '等级丹(超级)', detail: '200-299级使用,可提升玩家一个等级', type: PropType.Drug, sell: 15000, effect: { lv: 1 }, grade: Grade.Green, count: 1 },
                1003: { id: 1003, name: '等级丹(妖级)', detail: '300-399级使用,可提升玩家一个等级', type: PropType.Drug, sell: 20000, effect: { lv: 1 }, grade: Grade.Pink, count: 1 },
                1004: { id: 1004, name: '等级丹(魔级)', detail: '400-499级使用,可提升玩家一个等级', type: PropType.Drug, sell: 20000, effect: { lv: 1 }, grade: Grade.Red, count: 1 },
                1005: { id: 1005, name: '等级丹(仙级)', detail: '500-599级使用,可提升玩家一个等级', type: PropType.Drug, sell: 20000, effect: { lv: 1 }, grade: Grade.Red, count: 1 },
                1006: { id: 1006, name: '等级丹(神级)', detail: '600-699级使用,可提升玩家一个等级', type: PropType.Drug, sell: 20000, effect: { lv: 1 }, grade: Grade.Red, count: 1 },
                1007: { id: 1007, name: '生命药水', detail: '储存500生命值', type: PropType.Drug, sell: 2000, effect: { storageHp: 500 }, grade: Grade.White, count: 1 },
                1008: { id: 1008, name: '装备宝箱', detail: '打开可随机获得一件26阶(含)以上装备', type: PropType.Drug, sell: 2000, effect: { ramdonEquip: 1 }, grade: Grade.Red, count: 1 },
                /* 材料类 */
                2000: { id: 2000, name: '岩石', detail: '合成等级丹(初级)的材料.', type: PropType.Mat, sell: 1000, grade: Grade.White, count: 1 },
                2001: { id: 2001, name: '母英石', detail: '合成等级丹(高级)的材料.', type: PropType.Mat, sell: 1500, grade: Grade.White, count: 1 },
                2002: { id: 2002, name: '黄金矿石', detail: '合成等级丹(超级)的材料.', type: PropType.Mat, sell: 2000, grade: Grade.Green, count: 1 },
                2003: { id: 2003, name: '闪耀钻石', detail: '合成等级丹(妖级)的材料.', type: PropType.Mat, sell: 2500, grade: Grade.Green, count: 1 },
                2004: { id: 2004, name: '精品璞玉', detail: '合成等级丹(魔级)的材料.', type: PropType.Mat, sell: 3000, grade: Grade.Pink, count: 1 },
                2005: { id: 2005, name: '星辰砂', detail: '合成等级丹(仙级)的材料.', type: PropType.Mat, sell: 3500, grade: Grade.Pink, count: 1 },
                2006: { id: 2006, name: '火焰石', detail: '合成等级丹(神级)的材料.', type: PropType.Mat, sell: 4000, grade: Grade.Red, count: 1 },
                2100: { id: 2100, name: '装备兑换卷', detail: '收集一定的数量可在商城兑换极品装备.', type: PropType.Mat, sell: 100000, grade: Grade.Red, count: 1 },
                2101: { id: 2101, name: '羽毛', detail: '可在[翅膀]面板用于升级翅膀.', type: PropType.Mat, sell: 100000, grade: Grade.Red, count: 1 },
                /* 装备类 */
                5000: { id: 5000, name: '新手۰剑', detail: '劣质木头做成的的剑.', type: PropType.Equip, sell: 1000, place: EquipPlace.Arms, effect: { att: 20 }, grade: Grade.White, lv: 1, count: 1 },
                5001: { id: 5001, name: '新手۰甲', detail: '劣质木头做成的的甲.', type: PropType.Equip, sell: 1000, place: EquipPlace.Clothe, effect: { def: 10, hp: 100 }, grade: Grade.White, lv: 1, count: 1 },
                5002: { id: 5002, name: '新手۰盔', detail: '劣质木头做成的的盔.', type: PropType.Equip, sell: 1000, place: EquipPlace.Cap, effect: { dodge: 5 }, grade: Grade.White, lv: 1, count: 1 },
                5003: { id: 5003, name: '新手۰链', detail: '劣质木头做成的的链.', type: PropType.Equip, sell: 1000, place: EquipPlace.Necklace, effect: { dodge_rate: 1 }, grade: Grade.White, lv: 1, count: 1 },
                5004: { id: 5004, name: '新手۰戒', detail: '劣质木头做成的的戒.', type: PropType.Equip, sell: 1000, place: EquipPlace.Ring, effect: { crit: 5 }, grade: Grade.White, lv: 1, count: 1 },
                5005: { id: 5005, name: '新手۰手', detail: '劣质木头做成的的手.', type: PropType.Equip, sell: 1000, place: EquipPlace.Boots, effect: { crit_rate: 1 }, grade: Grade.White, lv: 1, count: 1 },
                /*
                    ...
                */
                // 追风了无痕(26)
                5100: { id: 5100, name: '风云★天地无双剑', detail: '别夜可怜长共月,当时曾约换追风.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 26, count: 1, effect: { att: 2222 }, place: EquipPlace.Arms },
                5101: { id: 5101, name: '风云★天地无双۰甲', detail: '别夜可怜长共月,当时曾约换追风.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 26, count: 1, effect: { def: 1333, hp: 1000 }, place: EquipPlace.Clothe },
                5102: { id: 5102, name: '追风了无痕۰盔', detail: '别夜可怜长共月,当时曾约换追风.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 26, count: 1, effect: { dodge: 5000 }, place: EquipPlace.Cap },
                5103: { id: 5103, name: '追风了无痕۰链', detail: '别夜可怜长共月,当时曾约换追风.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 26, count: 1, effect: { dodge_rate: 5 }, place: EquipPlace.Necklace },
                5104: { id: 5104, name: '追风了无痕۰戒', detail: '别夜可怜长共月,当时曾约换追风.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 26, count: 1, effect: { crit: 3000 }, place: EquipPlace.Ring },
                5105: { id: 5105, name: '追风了无痕۰手', detail: '别夜可怜长共月,当时曾约换追风.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 26, count: 1, effect: { crit_rate: 5 }, place: EquipPlace.Boots },
                // 王者冠荣耀(27)
                5110: { id: 5110, name: '烈焰★三昧真火剑', detail: '不争荣耀任沉沦,日与时疏共道亲.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 27, count: 1, effect: { att: 2500 }, place: EquipPlace.Arms },
                5111: { id: 5111, name: '烈焰★三昧真火甲', detail: '不争荣耀任沉沦,日与时疏共道亲.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 27, count: 1, effect: { def: 1500, hp: 2000 }, place: EquipPlace.Clothe },
                5112: { id: 5112, name: '王者冠荣耀۰盔', detail: '不争荣耀任沉沦,日与时疏共道亲.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 27, count: 1, effect: { dodge: 7000 }, place: EquipPlace.Cap },
                5113: { id: 5113, name: '王者冠荣耀۰链', detail: '不争荣耀任沉沦,日与时疏共道亲.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 27, count: 1, effect: { dodge_rate: 6 }, place: EquipPlace.Necklace },
                5114: { id: 5114, name: '王者冠荣耀۰戒', detail: '不争荣耀任沉沦,日与时疏共道亲.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 27, count: 1, effect: { crit: 4000 }, place: EquipPlace.Ring },
                5115: { id: 5115, name: '王者冠荣耀۰手', detail: '不争荣耀任沉沦,日与时疏共道亲.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 27, count: 1, effect: { crit_rate: 6 }, place: EquipPlace.Boots },
                // 神芒耀九州(28)
                5120: { id: 5120, name: '奇迹★虎啸龙泉剑', detail: '禹开九洲汤放桀,秦吞六国汉登基.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 28, count: 1, effect: { att: 2777 }, place: EquipPlace.Arms },
                5121: { id: 5121, name: '奇迹★虎啸龙泉甲', detail: '禹开九洲汤放桀,秦吞六国汉登基.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 28, count: 1, effect: { def: 1670, hp: 3000 }, place: EquipPlace.Clothe },
                5122: { id: 5122, name: '神芒耀九州۰盔', detail: '禹开九洲汤放桀,秦吞六国汉登基.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 28, count: 1, effect: { dodge: 10000 }, place: EquipPlace.Cap },
                5123: { id: 5123, name: '神芒耀九州۰链', detail: '禹开九洲汤放桀,秦吞六国汉登基.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 28, count: 1, effect: { dodge_rate: 7 }, place: EquipPlace.Necklace },
                5124: { id: 5124, name: '神芒耀九州۰戒', detail: '禹开九洲汤放桀,秦吞六国汉登基.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 28, count: 1, effect: { crit: 6000 }, place: EquipPlace.Ring },
                5125: { id: 5125, name: '神芒耀九州۰手', detail: '禹开九洲汤放桀,秦吞六国汉登基.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 28, count: 1, effect: { crit_rate: 7 }, place: EquipPlace.Boots },
                // 杀戮问苍天(29)
                5130: { id: 5130, name: '命运★不屈幽冥剑', detail: '天时怼兮威灵怒,严杀尽兮弃原野.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 29, count: 1, effect: { att: 3055 }, place: EquipPlace.Arms },
                5131: { id: 5131, name: '命运★不屈幽冥甲', detail: '天时怼兮威灵怒,严杀尽兮弃原野.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 29, count: 1, effect: { def: 1830, hp: 4000 }, place: EquipPlace.Clothe },
                5132: { id: 5132, name: '杀戮问苍天۰盔', detail: '天时怼兮威灵怒,严杀尽兮弃原野.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 29, count: 1, effect: { dodge: 14000 }, place: EquipPlace.Cap },
                5133: { id: 5133, name: '杀戮问苍天۰链', detail: '天时怼兮威灵怒,严杀尽兮弃原野.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 29, count: 1, effect: { dodge_rate: 8 }, place: EquipPlace.Necklace },
                5134: { id: 5134, name: '杀戮问苍天۰戒', detail: '天时怼兮威灵怒,严杀尽兮弃原野.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 29, count: 1, effect: { crit: 8000 }, place: EquipPlace.Ring },
                5135: { id: 5135, name: '杀戮问苍天۰手', detail: '天时怼兮威灵怒,严杀尽兮弃原野.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 29, count: 1, effect: { crit_rate: 8 }, place: EquipPlace.Boots },
                // 狂霸占天下(30)
                5140: { id: 5140, name: '残月★暗影流光剑', detail: '莫愁前路无知己,天下谁人不识君.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 30, count: 1, effect: { att: 3333 }, place: EquipPlace.Arms },
                5141: { id: 5141, name: '残月★暗影流光甲', detail: '莫愁前路无知己,天下谁人不识君.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 30, count: 1, effect: { def: 2000, hp: 5000 }, place: EquipPlace.Clothe },
                5142: { id: 5142, name: '狂霸占天下۰盔', detail: '莫愁前路无知己,天下谁人不识君.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 30, count: 1, effect: { dodge: 19000 }, place: EquipPlace.Cap },
                5143: { id: 5143, name: '狂霸占天下۰链', detail: '莫愁前路无知己,天下谁人不识君.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 30, count: 1, effect: { dodge_rate: 9 }, place: EquipPlace.Necklace },
                5144: { id: 5144, name: '狂霸占天下۰戒', detail: '莫愁前路无知己,天下谁人不识君.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 30, count: 1, effect: { crit: 10000 }, place: EquipPlace.Ring },
                5145: { id: 5145, name: '狂霸占天下۰手', detail: '莫愁前路无知己,天下谁人不识君.', type: PropType.Equip, sell: 1000, grade: Grade.Pink, lv: 30, count: 1, effect: { crit_rate: 9 }, place: EquipPlace.Boots },
                // 永恒天命星河[妖](31)
                5150: { id: 5150, name: '疾风★时空逆流剑[妖]', detail: '天接云涛连晓雾,星河欲转千帆舞.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 31, count: 1, effect: { att: 3833 }, place: EquipPlace.Arms },
                5151: { id: 5151, name: '疾风★时空逆流甲[妖]', detail: '天接云涛连晓雾,星河欲转千帆舞.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 31, count: 1, effect: { def: 2300, hp: 10000 }, place: EquipPlace.Clothe },
                5152: { id: 5152, name: '永恒天命星河۰盔[妖]', detail: '天接云涛连晓雾,星河欲转千帆舞.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 31, count: 1, effect: { dodge: 25000 }, place: EquipPlace.Cap },
                5153: { id: 5153, name: '永恒天命星河۰链[妖]', detail: '天接云涛连晓雾,星河欲转千帆舞.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 31, count: 1, effect: { dodge_rate: 10 }, place: EquipPlace.Necklace },
                5154: { id: 5154, name: '永恒天命星河۰戒[妖]', detail: '天接云涛连晓雾,星河欲转千帆舞.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 31, count: 1, effect: { crit: 12000 }, place: EquipPlace.Ring },
                5155: { id: 5155, name: '永恒天命星河۰手[妖]', detail: '天接云涛连晓雾,星河欲转千帆舞.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 31, count: 1, effect: { crit_rate: 10 }, place: EquipPlace.Boots },
                // 三界不灭神火[魔](32)
                5160: { id: 5160, name: '辉煌★至尊荣耀剑[魔]', detail: '九九道至成真日,三界四府朝元节.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 32, count: 1, effect: { att: 4333 }, place: EquipPlace.Arms },
                5161: { id: 5161, name: '辉煌★至尊荣耀甲[魔]', detail: '九九道至成真日,三界四府朝元节.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 32, count: 1, effect: { def: 2600, hp: 15000 }, place: EquipPlace.Clothe },
                5162: { id: 5162, name: '三界不灭神火۰盔[魔]', detail: '九九道至成真日,三界四府朝元节.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 32, count: 1, effect: { dodge: 32000 }, place: EquipPlace.Cap },
                5163: { id: 5163, name: '三界不灭神火۰链[魔]', detail: '九九道至成真日,三界四府朝元节.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 32, count: 1, effect: { dodge_rate: 15 }, place: EquipPlace.Necklace },
                5164: { id: 5164, name: '三界不灭神火۰戒[魔]', detail: '九九道至成真日,三界四府朝元节.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 32, count: 1, effect: { crit: 15000 }, place: EquipPlace.Ring },
                5165: { id: 5165, name: '三界不灭神火۰手[魔]', detail: '九九道至成真日,三界四府朝元节.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 32, count: 1, effect: { crit_rate: 15 }, place: EquipPlace.Boots },
                // 弑神圣墟修罗[仙](33)
                5170: { id: 5170, name: '烈火★幻灭红莲剑[仙]', detail: '冲冠一怒凭谁问?血流千里魔噬魂.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 33, count: 1, effect: { att: 4833 }, place: EquipPlace.Arms },
                5171: { id: 5171, name: '烈火★幻灭红莲甲[仙]', detail: '冲冠一怒凭谁问?血流千里魔噬魂.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 33, count: 1, effect: { def: 3383, hp: 20000 }, place: EquipPlace.Clothe },
                5172: { id: 5172, name: '弑神圣墟修罗۰盔[仙]', detail: '冲冠一怒凭谁问?血流千里魔噬魂.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 33, count: 1, effect: { dodge: 39000 }, place: EquipPlace.Cap },
                5173: { id: 5173, name: '弑神圣墟修罗۰链[仙]', detail: '冲冠一怒凭谁问?血流千里魔噬魂.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 33, count: 1, effect: { dodge_rate: 20 }, place: EquipPlace.Necklace },
                5174: { id: 5174, name: '弑神圣墟修罗۰戒[仙]', detail: '冲冠一怒凭谁问?血流千里魔噬魂.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 33, count: 1, effect: { crit: 18000 }, place: EquipPlace.Ring },
                5175: { id: 5175, name: '弑神圣墟修罗۰手[仙]', detail: '冲冠一怒凭谁问?血流千里魔噬魂.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 33, count: 1, effect: { crit_rate: 20 }, place: EquipPlace.Boots },
                // 混沌不败冥帝[神](34)
                5180: { id: 5180, name: '嗜血★紫金盘龙剑[神]', detail: '灰池炎灼定浮枕,见了方知造化深.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 34, count: 1, effect: { att: 5333 }, place: EquipPlace.Arms },
                5181: { id: 5181, name: '嗜血★紫金盘龙甲[神]', detail: '灰池炎灼定浮枕,见了方知造化深.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 34, count: 1, effect: { def: 3200, hp: 25000 }, place: EquipPlace.Clothe },
                5182: { id: 5182, name: '混沌不败冥帝۰盔[神]', detail: '灰池炎灼定浮枕,见了方知造化深.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 34, count: 1, effect: { dodge: 47000 }, place: EquipPlace.Cap },
                5183: { id: 5183, name: '混沌不败冥帝۰链[神]', detail: '灰池炎灼定浮枕,见了方知造化深.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 34, count: 1, effect: { dodge_rate: 25 }, place: EquipPlace.Necklace },
                5184: { id: 5184, name: '混沌不败冥帝۰戒[神]', detail: '灰池炎灼定浮枕,见了方知造化深.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 34, count: 1, effect: { crit: 21000 }, place: EquipPlace.Ring },
                5185: { id: 5185, name: '混沌不败冥帝۰手[神]', detail: '灰池炎灼定浮枕,见了方知造化深.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 34, count: 1, effect: { crit_rate: 25 }, place: EquipPlace.Boots },
                // 幽冥毁天灭地[圣](35)
                5190: { id: 5190, name: '死神★无坚不摧剑[圣]', detail: '端能捷疾追芳躅,当复幽冥入苦心.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 35, count: 1, effect: { att: 5833 }, place: EquipPlace.Arms },
                5191: { id: 5191, name: '死神★无坚不摧甲[圣]', detail: '端能捷疾追芳躅,当复幽冥入苦心.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 35, count: 1, effect: { def: 4083, hp: 30000 }, place: EquipPlace.Clothe },
                5192: { id: 5192, name: '幽冥毁天灭地۰盔[圣]', detail: '端能捷疾追芳躅,当复幽冥入苦心.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 35, count: 1, effect: { dodge: 56000 }, place: EquipPlace.Cap },
                5193: { id: 5193, name: '幽冥毁天灭地۰链[圣]', detail: '端能捷疾追芳躅,当复幽冥入苦心.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 35, count: 1, effect: { dodge_rate: 30 }, place: EquipPlace.Necklace },
                5194: { id: 5194, name: '幽冥毁天灭地۰戒[圣]', detail: '端能捷疾追芳躅,当复幽冥入苦心.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 35, count: 1, effect: { crit: 24000 }, place: EquipPlace.Ring },
                5195: { id: 5195, name: '幽冥毁天灭地۰手[圣]', detail: '端能捷疾追芳躅,当复幽冥入苦心.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 35, count: 1, effect: { crit_rate: 30 }, place: EquipPlace.Boots },
                // 开天辟地长生[不灭](36)
                5200: { id: 5200, name: '主宰★幻灭太虚剑[不灭]', detail: '世途官宦两不恶,争做长生不老仙.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 36, count: 1, effect: { att: 6666 }, place: EquipPlace.Arms },
                5201: { id: 5201, name: '主宰★幻灭太虚剑[不灭]', detail: '世途官宦两不恶,争做长生不老仙.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 36, count: 1, effect: { def: 4000, hp: 35000 }, place: EquipPlace.Clothe },
                5202: { id: 5202, name: '开天辟地长生۰盔[不灭]', detail: '世途官宦两不恶,争做长生不老仙.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 36, count: 1, effect: { dodge: 66000 }, place: EquipPlace.Cap },
                5203: { id: 5203, name: '开天辟地长生۰链[不灭]', detail: '世途官宦两不恶,争做长生不老仙.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 36, count: 1, effect: { dodge_rate: 35 }, place: EquipPlace.Necklace },
                5204: { id: 5204, name: '开天辟地长生۰戒[不灭]', detail: '世途官宦两不恶,争做长生不老仙.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 36, count: 1, effect: { crit: 27000 }, place: EquipPlace.Ring },
                5205: { id: 5205, name: '开天辟地长生۰手[不灭]', detail: '世途官宦两不恶,争做长生不老仙.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 36, count: 1, effect: { crit_rate: 35 }, place: EquipPlace.Boots },
                // 凤凰涅槃重生[无上](37)
                5210: { id: 5210, name: '灭世★幽冥学煞[无上]', detail: '下野终知民意贵,凤凰浴火获重生.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 37, count: 1, effect: { att: 7500 }, place: EquipPlace.Arms },
                5211: { id: 5211, name: '灭世★幽冥学煞甲[无上]', detail: '下野终知民意贵,凤凰浴火获重生.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 37, count: 1, effect: { def: 4500, hp: 40000 }, place: EquipPlace.Clothe },
                5212: { id: 5212, name: '凤凰涅槃重生۰盔[无上]', detail: '下野终知民意贵,凤凰浴火获重生.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 37, count: 1, effect: { dodge: 77000 }, place: EquipPlace.Cap },
                5213: { id: 5213, name: '凤凰涅槃重生۰链[无上]', detail: '下野终知民意贵,凤凰浴火获重生.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 37, count: 1, effect: { dodge_rate: 40 }, place: EquipPlace.Necklace },
                5214: { id: 5214, name: '凤凰涅槃重生۰戒[无上]', detail: '下野终知民意贵,凤凰浴火获重生.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 37, count: 1, effect: { crit: 30000 }, place: EquipPlace.Ring },
                5215: { id: 5215, name: '凤凰涅槃重生۰手[无上]', detail: '下野终知民意贵,凤凰浴火获重生.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 37, count: 1, effect: { crit_rate: 40 }, place: EquipPlace.Boots },
                // 日月星辰不灭[乾坤](38)
                5220: { id: 5220, name: '诛仙★万古无常剑[乾坤]', detail: '东南西北效皇极,日月星辰奏凯歌.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 38, count: 1, effect: { att: 8333 }, place: EquipPlace.Arms },
                5221: { id: 5221, name: '诛仙★万古无常甲[乾坤]', detail: '东南西北效皇极,日月星辰奏凯歌.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 38, count: 1, effect: { def: 5000, hp: 45000 }, place: EquipPlace.Clothe },
                5222: { id: 5222, name: '日月星辰不灭۰盔[乾坤]', detail: '东南西北效皇极,日月星辰奏凯歌.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 38, count: 1, effect: { dodge: 89000 }, place: EquipPlace.Cap },
                5223: { id: 5223, name: '日月星辰不灭۰链[乾坤]', detail: '东南西北效皇极,日月星辰奏凯歌.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 38, count: 1, effect: { dodge_rate: 45 }, place: EquipPlace.Necklace },
                5224: { id: 5224, name: '日月星辰不灭۰戒[乾坤]', detail: '东南西北效皇极,日月星辰奏凯歌.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 38, count: 1, effect: { crit: 33000 }, place: EquipPlace.Ring },
                5225: { id: 5225, name: '日月星辰不灭۰手[乾坤]', detail: '东南西北效皇极,日月星辰奏凯歌.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 38, count: 1, effect: { crit_rate: 45 }, place: EquipPlace.Boots },
                // 君临天下无量[鸿蒙](39)
                5230: { id: 5230, name: '无妄★遮天蔽日剑[鸿蒙]', detail: '黄沙百战穿金甲,不破楼兰终不还.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 39, count: 1, effect: { att: 9166 }, place: EquipPlace.Arms },
                5231: { id: 5231, name: '无妄★遮天蔽日甲[鸿蒙]', detail: '黄沙百战穿金甲,不破楼兰终不还.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 39, count: 1, effect: { def: 5500, hp: 50000 }, place: EquipPlace.Clothe },
                5232: { id: 5232, name: '君临天下无量۰盔[鸿蒙]', detail: '黄沙百战穿金甲,不破楼兰终不还.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 39, count: 1, effect: { dodge: 100000 }, place: EquipPlace.Cap },
                5233: { id: 5233, name: '君临天下无量۰链[鸿蒙]', detail: '黄沙百战穿金甲,不破楼兰终不还.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 39, count: 1, effect: { dodge_rate: 50 }, place: EquipPlace.Necklace },
                5234: { id: 5234, name: '君临天下无量۰戒[鸿蒙]', detail: '黄沙百战穿金甲,不破楼兰终不还.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 39, count: 1, effect: { crit: 36000 }, place: EquipPlace.Ring },
                5235: { id: 5235, name: '君临天下无量۰手[鸿蒙]', detail: '黄沙百战穿金甲,不破楼兰终不还.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 39, count: 1, effect: { crit_rate: 50 }, place: EquipPlace.Boots },
                // 天下无敌杀戮[盘古](40)
                5240: { id: 5240, name: '轮回★血染九天剑[盘古]', detail: '四海翻腾云水怒,五洲震荡风雷激.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 40, count: 1, effect: { att: 10000 }, place: EquipPlace.Arms },
                5241: { id: 5241, name: '轮回★血染九天甲[盘古]', detail: '四海翻腾云水怒,五洲震荡风雷激.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 40, count: 1, effect: { def: 6000, hp: 55000 }, place: EquipPlace.Clothe },
                5242: { id: 5242, name: '天下无敌杀戮۰盔[盘古]', detail: '四海翻腾云水怒,五洲震荡风雷激.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 40, count: 1, effect: { dodge: 130000 }, place: EquipPlace.Cap },
                5243: { id: 5243, name: '天下无敌杀戮۰链[盘古]', detail: '四海翻腾云水怒,五洲震荡风雷激.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 40, count: 1, effect: { dodge_rate: 55 }, place: EquipPlace.Necklace },
                5244: { id: 5244, name: '天下无敌杀戮۰戒[盘古]', detail: '四海翻腾云水怒,五洲震荡风雷激.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 40, count: 1, effect: { crit: 40000 }, place: EquipPlace.Ring },
                5245: { id: 5245, name: '天下无敌杀戮۰手[盘古]', detail: '四海翻腾云水怒,五洲震荡风雷激.', type: PropType.Equip, sell: 1000, grade: Grade.Red, lv: 40, count: 1, effect: { crit_rate: 55 }, place: EquipPlace.Boots },
            }
            // 怪物列表
            window.EnemyList = [
                [
                    // 1～5 勇者平原
                    { val: 22, enemy: { id: 20000, tag: 0, name: '草原白狼', lv: 1, property: { att: 5, def: 3, hp: 50, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 22, enemy: { id: 20001, tag: 0, name: '人类弓手', lv: 2, property: { att: 6, def: 3, hp: 50, crit: 0, crit_rate: 0, dodge: 1, dodge_rate: 1 } } },
                    { val: 22, enemy: { id: 20002, tag: 0, name: '爬虫', lv: 3, property: { att: 3, def: 5, hp: 80, crit: 1, crit_rate: 1, dodge: 0, dodge_rate: 0 } } },
                    { val: 22, enemy: { id: 20003, tag: 0, name: '猎鹰', lv: 4, property: { att: 7, def: 5, hp: 80, crit: 1, crit_rate: 1, dodge: 1, dodge_rate: 1 } } },
                    { val: 12, enemy: { id: 20004, tag: 0, name: '野猪王(Boss)', lv: 5, property: { att: 10, def: 8, hp: 200, crit: 3, crit_rate: 3, dodge: 2, dodge_rate: 2 } } },
                ],
                [
                    // 6~10 黑暗森林
                    { val: 24, enemy: { id: 20010, tag: 1, name: '野猪战士', lv: 6, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20011, tag: 1, name: '野猪勇士', lv: 7, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20012, tag: 1, name: '丛林战士', lv: 8, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20013, tag: 1, name: '蝎子', lv: 9, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20014, tag: 1, name: '远古食人兽(Boss)', lv: 10, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 11~15 兽人领域
                    { val: 24, enemy: { id: 20020, tag: 2, name: '半兽人战士', lv: 11, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20021, tag: 2, name: '兽人祭祀', lv: 12, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20022, tag: 2, name: '蜥蜴战士', lv: 13, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20023, tag: 2, name: '兽人精英', lv: 14, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20024, tag: 2, name: '野猪头领(Boss)', lv: 15, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 16~20 死亡沙漠
                    { val: 24, enemy: { id: 20030, tag: 3, name: '毒蛇', lv: 16, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20031, tag: 3, name: '僵尸', lv: 17, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20032, tag: 3, name: '骷髅弓箭手', lv: 18, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20033, tag: 3, name: '锁链怪人', lv: 19, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20034, tag: 3, name: '死亡沙虫(Boss)', lv: 20, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 21~25 无尽废墟
                    { val: 24, enemy: { id: 20040, tag: 4, name: '死灵战士', lv: 21, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20041, tag: 4, name: '骷髅勇士', lv: 22, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20042, tag: 4, name: '骷髅骑士', lv: 23, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20043, tag: 4, name: '堕落弓箭手', lv: 24, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20044, tag: 4, name: '死灵骑士(Boss)', lv: 25, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 26~30 恐惧海湾
                    { val: 24, enemy: { id: 20050, tag: 5, name: '巨蟒', lv: 26, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20051, tag: 5, name: '沼泽鳄鱼', lv: 27, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20052, tag: 5, name: '水怪', lv: 28, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20053, tag: 5, name: '剧毒猛鳄', lv: 29, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20054, tag: 5, name: '娜迦(Boss)', lv: 30, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 31~35 远古遗迹
                    { val: 24, enemy: { id: 20060, tag: 6, name: '精灵刺客', lv: 31, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20061, tag: 6, name: '精灵巫师', lv: 32, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20062, tag: 6, name: '骷髅盾战士', lv: 33, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20063, tag: 6, name: '骷髅精灵', lv: 34, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20064, tag: 6, name: '石像鬼(Boss)', lv: 35, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 36~40 烈焰火山
                    { val: 24, enemy: { id: 20070, tag: 7, name: '火烈猪', lv: 36, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20071, tag: 7, name: '火焰怪', lv: 37, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20072, tag: 7, name: '炎魔', lv: 38, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20073, tag: 7, name: '石头人', lv: 39, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20074, tag: 7, name: '火山巨人(Boss)', lv: 40, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 41~45 恶魔之城
                    { val: 24, enemy: { id: 20080, tag: 8, name: '僵尸战士', lv: 41, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20081, tag: 8, name: '黑暗术士', lv: 42, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20082, tag: 8, name: '恶魔护卫', lv: 43, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20083, tag: 8, name: '玄黑狮豹兽', lv: 44, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20084, tag: 8, name: '恶魔城主(Boss)', lv: 45, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 46~50 恐怖地下城
                    { val: 24, enemy: { id: 20090, tag: 9, name: '魔化骷髅', lv: 46, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20091, tag: 9, name: '恶魔法师', lv: 47, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20092, tag: 9, name: '变异恶魔', lv: 48, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20093, tag: 9, name: '骷髅首领', lv: 49, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20094, tag: 9, name: '地狱三头犬(Boss)', lv: 50, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 51~55 死亡之地
                    { val: 24, enemy: { id: 20100, tag: 10, name: '地狱祭师', lv: 41, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20101, tag: 10, name: '食人花', lv: 42, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20102, tag: 10, name: '堕落巨人', lv: 43, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20103, tag: 10, name: '狂化熊魔', lv: 44, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20104, tag: 10, name: '恶魔猎手(Boss)', lv: 45, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
                [
                    // 56~60 龙之大陆
                    { val: 24, enemy: { id: 20110, tag: 11, name: '小火龙', lv: 46, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20111, tag: 11, name: '穿甲骨龙', lv: 47, property: { att: 10, def: 8, hp: 40, crit: 0, crit_rate: 0, dodge: 2, dodge_rate: 2 } } },
                    { val: 24, enemy: { id: 20112, tag: 11, name: '蓝盾水龙', lv: 48, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 0, dodge_rate: 0 } } },
                    { val: 24, enemy: { id: 20113, tag: 11, name: '钢铁飞龙', lv: 49, property: { att: 15, def: 12, hp: 60, crit: 2, crit_rate: 2, dodge: 2, dodge_rate: 2 } } },
                    { val: 4, enemy: { id: 20114, tag: 11, name: '赤焰魔龙(Boss)', lv: 50, property: { att: 30, def: 25, hp: 150, crit: 5, crit_rate: 5, dodge: 3, dodge_rate: 3 } } },
                ],
            ]
        },
    };
})();