import React from 'react'

import equipChs from './../imgs/tabicon/equip_chs.png'
import equipCht from './../imgs/tabicon/equip_cht.png'
import materialChs from './../imgs/tabicon/material_chs.png'
import materialCht from './../imgs/tabicon/material_cht.png'
import simChs from './../imgs/tabicon/sim_chs.png'
import simCht from './../imgs/tabicon/sim_cht.png'

import serverChs from './../imgs/utils/server_chs.png'
import serverCht from './../imgs/utils/server_cht.png'

import headerChs from './../imgs/bgp1_chs.png'
import headerCht from './../imgs/bgp1_cht.png'

export default class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabSelect: props.defaultTabSelect || 0,
            lang: props.lang,
            langMap: {
                chs: serverChs,
                cht: serverCht,
            },
            headerMap: {
                chs: headerChs,
                cht: headerCht,
            },
            tabList: [
                {
                    icon: {
                        chs: materialChs,
                        cht: materialCht,
                    },
                    text: '材料',
                    className: 'material',
                },
                {
                    icon: {
                        chs: equipChs,
                        cht: equipCht,
                    },
                    text: '装备',
                    className: 'equip',
                },
                {
                    icon: {
                        chs: simChs,
                        cht: simCht,
                    },
                    text: '模拟器',
                    className: 'sim',
                },
            ],
        }
    }

    setTab(index) {
        this.setState({ tabSelect: index })
        this.props.updateTab(index)
    }

    setLang(lang) {
        this.setState({
            lang: lang,
        })
        this.props.updateLang(lang)
    }

    toggleServer() {
        this.setLang(this.state.lang === 'chs' ? 'cht' : 'chs')
    }

    render() {
        const { lang, langMap, headerMap } = this.state
        let buttonList = this.state.tabList.map((_, index) => (
            <button
                key={index}
                className={[
                    'tab-btn',
                    index === this.state.tabSelect ? 'active' : '',
                    _.className,
                ].join(' ')}
                onClick={this.setTab.bind(this, index)}
                style={{ backgroundImage: `url("${_.icon[lang]}")` }}
            >
                {_.name}
            </button>
        ))
        return (
            <div
                className="tab-header"
                style={{ backgroundImage: `url("${headerMap[lang]}")` }}
            >
                {buttonList}
                <img
                    className="server-tab"
                    src={langMap[lang]}
                    alt=""
                    onClick={this.toggleServer.bind(this)}
                />
            </div>
        )
    }
}
