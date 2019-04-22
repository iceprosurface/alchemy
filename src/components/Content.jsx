import React from "react";
import Equip from './tabs/equip'
import Material from './tabs/material'
import Sim from './tabs/sim'

export default class Content extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="tab-body">
                <Material active={this.props.tabIndex === 0} />
                <Equip active={this.props.tabIndex === 1} />
                <Sim active={this.props.tabIndex === 2} />
            </div>
        );
    }
}
