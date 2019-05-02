import React, { Component } from 'react'

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

import { observer } from 'mobx-react'
import { store } from '../store/global'

@observer
export default class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabSelect: props.defaultTabSelect || 0,
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

    toggleServer() {
        const lang = store.lang === 'chs' ? 'cht' : 'chs'
        store.changeLang(lang)
    }

    render() {
        const { langMap, headerMap, tabList, tabSelect } = this.state
        return (
            <div
                className="tab-header"
                style={{
                    backgroundImage: `url("${headerMap[store.lang]}")`,
                }}
            >
                {tabList.map((_, index) => (
                    <button
                        key={index}
                        className={[
                            'tab-btn',
                            index === tabSelect ? 'active' : '',
                            _.className,
                        ].join(' ')}
                        onClick={this.setTab.bind(this, index)}
                        style={{
                            backgroundImage: `url("${_.icon[store.lang]}")`,
                        }}
                    >
                        {_.name}
                    </button>
                ))}
                <img
                    className="server-tab"
                    src={langMap[store.lang]}
                    alt=""
                    onClick={this.toggleServer.bind(this)}
                />
            </div>
        )
    }
}
