import React from 'react'
import Equip from './tabs/equip'
import Material from './tabs/material'
import Sim from './tabs/sim'

export default class Content extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { lang } = this.props
        return (
            <div className="tab-body">
                <Material active={this.props.tabIndex === 0} lang={lang} />
                <Equip active={this.props.tabIndex === 1} lang={lang} />
                <Sim active={this.props.tabIndex === 2} lang={lang} />
            </div>
        )
    }
}
