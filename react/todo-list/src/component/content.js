import React, { Component } from 'react'

export default class Main extends Component {
    render() {
        return (
            <ul class="todo-main">
                <li>
                <label>
                    <input type="checkbox"/>
                    <span>Vue-拼多多项目实战-课程讲解</span>
                </label>
                <button class="btn btn-warning" style="display:none">删除</button>
                </li>
                <li>
                <label>
                    <input type="checkbox"/>
                    <span>Vue-拼多多项目实战-作业布置</span>
                </label>
                <button class="btn btn-warning" style="display:none">删除</button>
                </li>
            </ul>
        )
    }
}