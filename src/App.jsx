import React from 'react'
import Header from './components/Header.jsx'
import Content from './components/Content.jsx'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: 0,
            lang: 'chs',
        }
    }

    render() {
        const {lang} = this.state
        return (
            <div className="app">
                <Header
                    updateTab={index => this.setState({tabIndex: index})}
                    defaultTabSelect={this.state.tabIndex}
                    updateLang={lang => this.setState({lang})}
                    lang={lang}
                />
                <div className="hr"/>
                <Content tabIndex={this.state.tabIndex} lang={lang}/>
            </div>
        )
    }
}
