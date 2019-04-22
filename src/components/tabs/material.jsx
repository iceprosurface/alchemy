import React from 'react'
import names from '../../data/names.json'
import materials from '../../data/materials.json'
import arrowIcon from './../../imgs/utils/arrow_down.svg'
const ingredientsName = names.ingredients
const CDN_HOST = '//kardia-c.github.io'

function MaterialItem({ active, material, lang }) {
    let { available, name, ingredients, rarity, sources, type } = material
    const langAvailable = available.includes(lang)
    let materialInLanguage
    if (langAvailable) {
        let ingredientsList = []
        for (let i in ingredients) {
            let name = ingredientsName[lang][i]
            let ingredient = ingredients[i]
            if (ingredient > 0) {
                ingredientsList.push({
                    name,
                    ingredient,
                })
            }
        }
        ingredientsList.sort((a, b) => b.ingredient - a.ingredient)
        materialInLanguage = {
            available: available[lang],
            name: name[lang],
            ingredients: ingredientsList,
            rarity,
            sources: sources[lang].replace(/\n/g, '，'),
            type,
        }
    }

    return (
        <div className={['material-item', active ? 'toggled' : ''].join(' ')}>
            <div
                className={[
                    'material-item-wrap',
                    langAvailable ? '' : 'hidden',
                ].join(' ')}
            >
                {langAvailable ? (
                    <div>
                        <div className="header">
                            <div
                                className={['item-name', `r${rarity}`].join(
                                    ' ',
                                )}
                            >
                                <img
                                    className="icon"
                                    src={`${CDN_HOST}/img/item/item_${
                                        materialInLanguage.type
                                    }_L.png`}
                                    alt={materialInLanguage.type}
                                />
                            </div>
                            <div className="body-content">
                                <div className="inner">
                                    <div className="name">
                                        {materialInLanguage.name}
                                    </div>
                                    <div className="ingredient">
                                        {materialInLanguage.ingredients.map(
                                            _ => (
                                                <span key={_.name}>
                                                    {_.name}: {_.ingredient}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="drop-down-icon">
                                <img src={arrowIcon} alt="" />
                            </div>
                        </div>
                        <div className="toggled-body">
                            <div className="outer">
                                <div className="inner">
                                    <p>来源：</p>
                                    <p>{materialInLanguage.sources}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    )
}

export default class Materials extends React.Component {
    constructor(props) {
        super(props)
        this.state = { activeIndex: -1 }
    }
    render() {
        const { lang, active } = this.props
        const { activeIndex } = this.state
        return (
            <div className={['tab-item', active ? 'active' : ''].join(' ')}>
                {materials.map((material, index) => (
                    <div
                        onClick={() => {
                            if (index === activeIndex) {
                                this.setState({ activeIndex: -1 })
                            } else {
                                this.setState({ activeIndex: index })
                            }
                        }}
                        key={index}
                    >
                        <MaterialItem
                            material={material}
                            active={activeIndex === index}
                            lang={lang}
                            key={index}
                        />
                    </div>
                ))}
            </div>
        )
    }
}
