import React, { Component } from 'react'
import store from '../store/index'

import { checkAllItem, selectAllItem } from '../store/actionCreators'
export default class Foot extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
        store.subscribe(() => {
            this.setState(store.getState());
        })
    }
    render() {
        const { finishedCount, todos, allChecked } = this.state;
        return (
            <div className="todo-footer">
                <label>
                <input type="checkbox" checked={allChecked} onChange={(ev) => {const action = selectAllItem(ev.target.checked); store.dispatch(action);}}/>
                </label>
                <span>
                <span>已完成{ finishedCount }件</span> / 总计{ todos.length }件
                </span>
                <button className="btn btn-warning" onClick={() => {const action = checkAllItem(); store.dispatch(action);}}>清除已完成任务</button>
            </div>
        )
    }
}




