import React, { Component } from 'react'

export default class HeadCom extends Component {
    render() {
        return (
            <div class="todo-header">
                <input type="text" placeholder="请输入今天的任务清单，按回车键确认"/>
            </div>
        )
    }
}