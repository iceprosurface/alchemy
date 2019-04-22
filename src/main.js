import React from "react";
import ReactDOM from "react-dom";
import './sass/index.scss';
import App from './App.jsx';

let mountNode = document.getElementById("app");
ReactDOM.render(
    <App />
, mountNode);