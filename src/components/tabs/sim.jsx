import React from 'react';

export default class Equip extends  React.Component{
    render () {
        return (
            <div className={['tab-item', this.props.active ? 'active' : ''].join(' ')}>
                this.sim
            </div>
        )
    }
}