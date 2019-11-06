import React, { Component } from 'react'
import store from '../store/index'
import { 
        deleteListItem,
        changeFinished
    } from '../store/actionCreators'


export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState();
        store.subscribe(() => {
            this.setState(store.getState())
        })
    }
    render() {
        const { todos } =  this.state;
        return (
            <ul className="todo-main">
                {
                        
                    todos.map((item, index) => (
                        <li key={index}>
                            <label>
                                <input type="checkbox" checked={item.finished} onChange={(ev) => this._changeStatus(ev, item.id)}/>
                                <span>{item.title}</span>
                            </label>
                            <button className="btn btn-warning" onClick={() => this._deleteList(index)}>删除</button>
                        </li>
                    ))
                }
            </ul>
        )
    }
    _changeStatus= (ev, id) => {
        const action = changeFinished(id, ev.target.checked);
        store.dispatch(action);
    }
    _deleteList = (index) => {
        const action = deleteListItem(index);
        store.dispatch(action);
    }
}