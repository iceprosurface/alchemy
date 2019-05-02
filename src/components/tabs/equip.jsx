import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {observable, action, reaction} from 'mobx'
import Hammer from 'hammerjs'

function EquipAttributeLine({equip}) {
    return (equip.attribs
            .filter(_ => _)
            .map(_ => (
                <div className="attribute-line" key={_}>
                    {_}
                </div>
            ))
    )
}

class SelectedObject {
    @observable equip = null;
    @observable open = false;

    @action setEquip(equip) {
        this.equip = equip;
        this.open = true;
    }

    @action close() {
        this.open = false;
    }
}

class FilterObject {
    @observable positions = []

    @action toggleFilterPosition(addIndex) {
        if (this.positions.includes(addIndex)) {
            this.positions.splice(this.positions.indexOf(addIndex), 1)
        } else {
            this.positions.push(addIndex)
        }
    }

    @observable attribs = []

    @action toggleFilterAttrib(addIndex) {
        if (this.attribs.includes(addIndex)) {
            this.attribs.splice(this.attribs.indexOf(addIndex), 1)
        } else {
            this.attribs.push(addIndex)
        }
    }

    @observable show = false

    @action display() {
        this.show = true
    }

    @action hide() {
        this.show = false
    }

    @action toggleShow() {
        this.show = !this.show
    }
}

@inject('store')
@observer
class FilterSide extends Component {
    container = React.createRef()

    constructor(props) {
        super(props)
        this.state = {
            deltaX: 0,
            startPan: false,
        }
        const {filter} = this.props;
        reaction(
            () => filter.show,
            () => {
                const {deltaX} = this.state
                if (!this.state.startPan && filter.show && deltaX !== 0) {
                    this.setState({
                        deltaX: 0,
                    })
                }
            },
        )
    }

    componentDidMount() {
        const filter = this.props.filter
        // TODO: 先硬编码，后面抽离成单独的侧滑组件
        this.hammerControl = Hammer(this.container.current)
        this.hammerControl.get('pan').set({
            threshold: 1,
        })
        this.hammerControl.on(
            'panstart panright panleft panend swiperight',
            ev => {
                const width = this.container.current.clientWidth
                const deltaX = ev.deltaX
                switch (ev.type) {
                    case 'panend':
                        if (deltaX > 0.3 * width) {
                            this.setState({
                                startPan: false,
                            })
                            filter.hide()
                        } else {
                            this.setState({
                                startPan: false,
                                deltaX: 0,
                            })
                        }
                        break
                    case 'panstart':
                        this.setState({
                            startPan: true,
                        })
                        break
                    case 'swiperight':
                        this.setState({
                            startPan: false,
                        })
                        filter.hide()
                        break
                    default:
                        if (deltaX < 0) {
                            this.setState({
                                deltaX: 0,
                            })
                        } else if (deltaX > width) {
                            this.setState({
                                deltaX: width,
                            })
                        } else {
                            this.setState({
                                deltaX,
                            })
                        }

                        break
                }
            },
        )
    }

    render() {
        const {store, filter} = this.props
        const {filterI18, nameAttributeWithoutFloat, namePosition} = store
        const {deltaX, startPan} = this.state
        return (
            <div
                className={[
                    'equip-filter-container',
                    'equip-filter',
                    filter.show && 'active',
                ].join(' ')}
            >
                <div
                    className="container-wrap"
                    ref={this.container}
                    style={{
                        transform: `translate3d(${deltaX}px, 0, 0)`,
                        transition: !startPan
                            ? 'transform .4s ease-in-out'
                            : false,
                    }}
                >
                    <div className="filter-nav">
                        <div className="filter-back-icon"
                             onClick={() => filter.toggleShow()}>{'<'}</div>
                        <div
                            className="filter-nav-text">{filterI18.navName}</div>
                    </div>
                    <hr/>
                    <div className="filter-title">{filterI18.filterName}</div>
                    <div className="filter-wrap">
                        {nameAttributeWithoutFloat.map((_, index) => (
                            <div
                                key={index}
                                className={[
                                    'equip-item',
                                    filter.attribs.includes(index)
                                        ? 'active'
                                        : '',
                                ].join(' ')}
                                onClick={() => filter.toggleFilterAttrib(index)}
                            >
                                {_}
                            </div>
                        ))}
                    </div>
                    <div className="filter-title">
                        {filterI18.filterPosition}
                    </div>
                    <div className="filter-wrap">
                        {namePosition.map((_, index) => (
                            <div
                                key={index}
                                className={[
                                    'equip-item',
                                    filter.positions.includes(index)
                                        ? 'active'
                                        : '',
                                ].join(' ')}
                                onClick={() =>
                                    filter.toggleFilterPosition(index)
                                }
                            >
                                {_}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

const Equips = inject('store')(
    observer(function (props) {
        const {filter, store, selected} = props
        const positionFilter = filter.positions
        const attribsFilter = filter.attribs
        const {CDN_HOST, namePosition, equips} = store
        const equipsForRender = equips.map(_ => {
            let equip = {..._};
            if (!equip.available) {
                // 不可达装备直接返回false
                equip.active = false
                return equip
            }
            if (positionFilter.length === 0 && attribsFilter.length === 0) {
                // 为空情况下默认全部装备
                equip.active = true
                return equip
            }
            if (
                positionFilter.length > 0 &&
                !positionFilter.includes(equip.position - 1)
            ) {
                equip.active = false
                return equip
            }
            equip.active = attribsFilter.every(
                attribIndex => equip.attribs[attribIndex],
            )
            return equip;
        })
        // 顺序不对，倒序排列
        equipsForRender.sort((a, b) => b.rarity - a.rarity)
        return (
            <div className="equip-wrap">
                {equipsForRender.map((equip, index) => (
                    <div
                        key={index}
                        className={[
                            'equip-item',
                            equip.active && 'active',
                        ].join(' ')}
                        onClick={() => selected.setEquip(equip)}
                    >
                        <div className="equip-item-wrap">
                            <div className="name">
                                <img
                                    className="icon"
                                    src={`${CDN_HOST}/img/item/item_${
                                        equip.type
                                        }_L.png`}
                                    alt={equip.type}
                                />
                                <div className="name-text">{equip.name}</div>
                            </div>
                            <div className="attribute">
                                <EquipAttributeLine equip={equip}/>
                            </div>
                            <div className="position">
                                <span>
                                    {namePosition.hasOwnProperty(equip.position - 1)
                                        ? namePosition[equip.position - 1]
                                        : '/'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }),
)

const numberSet = ' ①②③④⑤⑥⑦⑧⑨⑩';

function IngredientsDetail({ingredients, I18Text}) {
    return ingredients.filter(_ => _)
        .map(function (_, index) {
            return (
                <div className="ingredient-detail-line" key={index}>
                    {I18Text[0]}{numberSet[index + 1]}: {_.name}{I18Text[1]}{_.value}
                </div>
            )
        })
}

function Recommend ({props}) {
    return (
    <table>
        <tbody>
        <tr>
            <th colSpan="2"> 配方1
            </th>
        </tr>
        <tr>
            <td colSpan="2" style="text-align;left">
            </td>
        </tr>
        </tbody>
    </table>)
}
@inject('store')
@observer
class EquipDetail extends Component {
    render() {
        const {store, selected} = this.props
        const equip = selected.equip
        const active = selected.open ? 'active' : null;
        const {CDN_HOST, equipDetailI18} = store;
        return (
            <div className={["equip-detail", active].join(' ')}>
                <div className="detail-back-icon"
                     onClick={() => selected.close()}/>
                <div className="equip-detail-wrap">
                    <div className="line-title">{equipDetailI18.info}</div>
                    {equip && (
                        <div>
                            <table>
                                <tbody>
                                <tr>
                                    <th colSpan="2"
                                        className="title">{equip.name}</th>
                                </tr>
                                <tr>
                                    <td colSpan="2"><img
                                        className="icon"
                                        src={`${CDN_HOST}/img/item/item_${
                                            equip.type
                                            }_L.png`}
                                        alt={equip.type}
                                    /></td>
                                </tr>
                                <tr>
                                    <th>{equipDetailI18.position}</th>
                                    <td>{equipDetailI18.positionMap[equip.position]}</td>
                                </tr>
                                <tr>
                                    <th>{equipDetailI18.rarity}</th>
                                    <td> {equipDetailI18.rarityMap[equip.rarity]}</td>
                                </tr>
                                <tr>
                                    <th>{equipDetailI18.attrib}</th>
                                    <td><EquipAttributeLine equip={equip}/></td>
                                </tr>
                                {
                                    equip.ingredients.filter(_ => _).length > 0 && (
                                        <tr>
                                            <th>{equipDetailI18.ingredient}</th>
                                            <td className="left">
                                                <IngredientsDetail
                                                    ingredients={equip.ingredients}
                                                    I18Text={equipDetailI18.ingredientDetail}/>
                                            </td>
                                        </tr>
                                    )

                                }
                                </tbody>
                            </table>
                            <div className="line-title">{equipDetailI18.recommend}</div>

                        </div>
                    )}
                </div>

            </div>
        );
    }
}


@inject('store')
@observer
export default class Equip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: new FilterObject(),
            selected: new SelectedObject()
        }
    }

    updateFilter(filter) {
        this.setState({
            filter,
        })
    }

    render() {
        const {filter, selected} = this.state;
        const filterActive = filter.positions.length > 0 || filter.attribs.length > 0;
        return (
            <div
                className={[
                    'tab-item',
                    'equip-tab',
                    this.props.active ? 'active' : '',
                ].join(' ')}
            >
                <FilterSide filter={filter}/>
                <div className="abs-header">
                    <div className="equip-header">
                        <div className="name">名称</div>
                        <div className="attribute">属性</div>
                        <div className="position">部位
                            <div
                                className={["click-detail", filterActive ? 'active' : ''].join(' ')}
                                onClick={() => filter.toggleShow()}
                            />
                        </div>

                    </div>
                </div>
                <EquipDetail selected={selected}/>
                <Equips filter={filter} selected={selected}/>
            </div>
        )
    }
}
