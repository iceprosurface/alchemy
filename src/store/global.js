import { observable, configure, action, computed } from 'mobx'
import names from './../data/names.json'


/**
 * @type {[]}
 */
import equips from './../data/equips.json'
/**
 * @type {[]}
 */
import materials from '../data/materials.json'

import React from 'react'

configure({ enforceActions: 'always' })

const namePosRegex = /[{+-]/

function getFloatStr(value, floating) {
    if (!floating) return value
    const min = Math.round(value * 0.8)
    const max = Math.round(value * 1.2)
    if (min === max) return min
    return min + '~' + max
}

class Store {
    @observable CDN_HOST = '//kardia-c.github.io'
    @observable lang = 'chs'
    @observable _names = names
    @observable _equips = equips
    @observable _materials = materials


    @action changeLang = lang => {
        this.lang = lang
    }

    @computed get equipDetailI18 () {
        return {
            chs: {
                info: "装备信息",
                rarity: "品质",
                rarityMap: ["", "普通", "精致", "极品", "史诗","传说"],
                attrib: "属性",
                position: "部位",
                recommend: "推荐公式",
                time: "时间",
                cost: "金币",
                ingredient: "详细成分",
                ingredientDetail: ["条件", "要素达到最少"],
                positionMap: [""].concat(this._names.position['chs'])
            },
            cht: {
                info: "装备信息",
                rarity: "品質",
                rarityMap: ["", "普通", "精致", "極品", "史詩","傳說"],
                attrib: "屬性",
                position: "部位",
                recommend: "推薦配方",
                time: "時間",
                cost: "金幣",
                ingredient: "详细成分",
                positionMap: [""].concat(this._names.position['cht']),
                ingredientDetail: ["條件", "要素達到最少"]
            },
        }[this.lang];
    }

    @computed get filterI18 () {
        return {
            chs: {
                filterName: '词缀',
                filterPosition: '部位',
                navName: '过滤器',
            },
            cht: {
                filterName: '詞綴',
                filterPosition: '部位',
                navName: '過濾器',
            },
        }[this.lang];
    }

    @computed get materials() {
        return this._materials.map(material => {
            return {
                ...material,
                available: material.available.includes(store.lang),
                name: material.name[store.lang],
                sources: material.sources[store.lang].replace(/\n/g, '，'),
            }
        })
    }

    @computed get nameIngredients() {
        return this._names.ingredients[this.lang]
    }
    @computed get nameAttribute() {
        return this._names.attribs[this.lang]
    }
    @computed get nameAttributeWithoutFloat () {
        return this.nameAttribute.map(_ => _.substring(0, _.search(namePosRegex)))
    }

    @computed get namePosition() {
        return this._names.position[this.lang]
    }

    @computed get equips() {
        return this._equips.map(_ => {
            let ingredients = [];
            if (_.ingredients) {
                ingredients = _.ingredients.map((_, index) => {
                    if (_ > 0) {
                        return {
                            name: this.nameIngredients[index],
                            value: _
                        }
                    }
                    return null
                })
            }

            return {
                ..._,
                name: _.name[this.lang],
                available: _.available.includes(this.lang),
                ingredients: ingredients,
                attribs: _.attribs.map((attrib, index) => {
                    let floating = _.floating
                    if (attrib instanceof Array) {
                        if (attrib[0] > 0) {
                            let v1 = getFloatStr(attrib[0], floating)
                            let v2 = getFloatStr(attrib[1], floating)
                            // 不懂什么情况，先照抄
                            if (![14, 15, 16, 17].includes(index)) v2 = '2' // mmp
                            return this.nameAttribute[index]
                                .replace('{$v1}', v1)
                                .replace('{$v2}', v2)
                        }
                    } else {
                        if (attrib > 0) {
                            let v = getFloatStr(attrib, floating)
                            return this.nameAttribute[index].replace('{$v}', v)
                        }
                    }
                }),
            }
        })
    }
}

export const store = new Store()
