import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Sim extends Component {
    static contextTypes = {
        store: PropTypes.object,
    }
    render() {
        return (
            <div
                className={['tab-item', this.props.active ? 'active' : ''].join(
                    ' ',
                )}
            >
                this.sim
            </div>
        )
    }
}
