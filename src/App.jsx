import React from 'react'
import Header from './components/Header.jsx'
import Content from './components/Content.jsx'
import {observer, Provider} from 'mobx-react';
import {store} from "./store/global";
@observer
export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: 1,
        }
    }

    render() {
        return (
            <Provider store={store}>
                <div className="app">
                    <Header
                        updateTab={index => this.setState({tabIndex: index})}
                        defaultTabSelect={this.state.tabIndex}
                    />
                    <div className="hr"/>
                    <Content tabIndex={this.state.tabIndex}/>
                </div>
            </Provider>
        )
    }
}
