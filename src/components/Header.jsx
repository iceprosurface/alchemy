import React from "react";

import equip from "./../imgs/tabicon/equip_chs.png";
import material from "./../imgs/tabicon/material_chs.png";
import sim from "./../imgs/tabicon/sim_chs.png";
import header from "./../imgs/bgp1_chs.png";

export default class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelect: props.defaultTabSelect || 0,
            tabList: [
                {
                    icon: material,
                    text: "材料",
                    className: "material"
                },
                {
                    icon: equip,
                    text: "装备",
                    className: "equip"
                },
                {
                    icon: sim,
                    text: "模拟器",
                    className: "sim"
                }
            ]
        };
    }

    setTab (index) {
        this.setState({tabSelect: index});
        this.props.updateTab(index)
    }

    render() {
        let buttonList = this.state.tabList.map((_, index) => (
            <button
                key={index}
                className={[
                    "tab-btn",
                    index === this.state.tabSelect ? "active" : "",
                    _.className
                ].join(" ")}
                onClick={this.setTab.bind(this, index)}
                style={{backgroundImage: `url("${_.icon}")`}}
            >
                {_.name}
            </button>
        ));
        return (
            <div
                className="tab-header"
                style={{backgroundImage: `url("${header}")`}}
            >
                {buttonList}
            </div>
        );
    }
}
