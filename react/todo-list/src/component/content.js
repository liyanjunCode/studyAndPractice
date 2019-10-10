import React, { Component } from 'react'
import PropTypes from 'prop-types'
export default class Main extends Component {
    static propTypes = {
        todos: PropTypes.array.isRequired,
        changeFinished: PropTypes.func.isRequired,
        deleteList: PropTypes.func.isRequired
    };
    render() {
        const { todos, deleteList } = this.props;
        return (
            <ul className="todo-main">
                {
                    todos.map((item, index) => (
                        <li key={index}>
                            <label>
                                <input type="checkbox" checked={item.finished} onChange={(ev) => this._changeStatus(ev, item.id)}/>
                                <span>{item.title}</span>
                            </label>
                            <button className="btn btn-warning" onClick={() => deleteList(index)}>删除</button>
                        </li>
                    ))
                }
            </ul>
        )
    }
    _changeStatus(ev, id) {
        this.props.changeFinished(id, ev.target.checked);
    }
}