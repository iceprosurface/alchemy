import React, {Component} from 'react'
import arrowIcon from './../../imgs/utils/arrow_down.svg'
import {observer, inject} from 'mobx-react'

const MaterialItem = inject('store')(
    observer(function ({active, material, store}) {
        let {ingredients, available, sources, rarity, type, name} = material
        let {nameIngredients, CDN_HOST} = store
        let ingredientsList = []
        // 制作一个渲染列表
        if (available) {
            for (let i in ingredients) {
                if (ingredients.hasOwnProperty(i)) {
                    let name = nameIngredients[i]
                    let ingredient = ingredients[i]
                    if (ingredient > 0) {
                        ingredientsList.push({
                            name,
                            ingredient,
                        })
                    }
                }
            }
            // 然后从高到低排序
            ingredientsList.sort((a, b) => b.ingredient - a.ingredient)
        }

        return (
            <div
                className={['material-item', active ? 'toggled' : ''].join(' ')}
            >
                {available ? (
                    <div
                        className={[
                            'material-item-wrap',
                            available ? '' : 'hidden',
                        ].join(' ')}
                    >
                        <div className="header">
                            <div
                                className={['item-name', `r${rarity}`].join(
                                    ' ',
                                )}
                            >
                                <img
                                    className="icon"
                                    src={`${CDN_HOST}/img/item/item_${type}_L.png`}
                                    alt={type}
                                />
                            </div>
                            <div className="body-content">
                                <div className="inner">
                                    <div className="name">{name}</div>
                                    <div className="ingredient">
                                        {ingredientsList.map(_ => (
                                            <span key={_.name}>
                                                {_.name}: {_.ingredient}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="drop-down-icon">
                                <img src={arrowIcon} alt=""/>
                            </div>
                        </div>
                        <div className="toggled-body">
                            <div className="outer">
                                <div className="inner">
                                    <p>来源：</p>
                                    <p>{sources}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        )
    }),
)

@inject('store')
export default class Materials extends Component {
    constructor(props) {
        super(props)
        this.state = {activeIndex: -1}
    }

    render() {
        const {active, store} = this.props
        const {activeIndex} = this.state
        const {materials} = store
        return (
            <div className={['tab-item', active ? 'active' : ''].join(' ')}>
                {materials.map((material, index) => (
                    <div
                        onClick={() => {
                            if (index === activeIndex) {
                                this.setState({activeIndex: -1})
                            } else {
                                this.setState({activeIndex: index})
                            }
                        }}
                        key={index}
                    >
                        <MaterialItem
                            material={material}
                            active={activeIndex === index}
                            key={index}
                        />
                    </div>
                ))}
            </div>
        )
    }
}
