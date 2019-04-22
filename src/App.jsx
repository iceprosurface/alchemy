import React from "react";
import Header from "./components/Header.jsx";
import Content from "./components/Content.jsx";

export default class App extends React.Component {
    constructor ( props) {
        super (props);
        this.state = {
            tabIndex: 0
        }
    }

    render() {
        return (
            <div className="app">
                <Header updateTab={(index) => this.setState({tabIndex: index})} defaultTabSelect={this.state.tabIndex}/>
                <div className="hr"/>
                <Content tabIndex={this.state.tabIndex}/>
            </div>
        );
    }
}
