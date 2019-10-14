import React, { Component } from 'react'
import store from '../store/index'
import { addItemList } from '../store/actionCreators'
export default class HeadCom extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
        store.subscribe(() => {
            this.setState(store.getState());
        })
    }
    render() {
        return (
            <div className="todo-header">
                <input type="text" placeholder="请输入今天的任务清单，按回车键确认" onKeyDown={(ev) => this._additemDetail(ev, this.props.prevId)}/>
            </div>
        )
    }
    _additemDetail(ev, prevId) {
        if (ev.target.value) {
            if(ev.keyCode === 13) {
                addItemList({id: prevId + 1, title: ev.target.value, finished: false}) 
            }
        }
    }
}