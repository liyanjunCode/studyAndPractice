import React, { Component } from 'react';
import logo from './logo.svg';
import HeadCom from './component/head.js'
class App extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div class="todo-container">
            <div class="todo-wrap">
            <HeadCom/>
            
            <div class="todo-footer">
                <label>
                <input type="checkbox"/>
                </label>
                <span>
                <span>已完成0件</span> / 总计2件
                </span>
                <button class="btn btn-warning">清除已完成任务</button>
            </div>
            </div>
        </div>
        );
    }
}
export default App;
