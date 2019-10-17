import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
        deleteListItem,
        changeFinished
    } from '../store/actionCreators'


 class Main extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { todos, deleteList, changeStatus } =  this.props;
        return (
            <ul className="todo-main">
                {
                    todos.map((item, index) => (
                        <li key={index}>
                            <label>
                                <input type="checkbox" checked={item.finished} onChange={(ev) => changeStatus(ev, item.id)}/>
                                <span>{item.title}</span>
                            </label>
                            <button className="btn btn-warning" onClick={() => deleteList(index)}>删除</button>
                        </li>
                    ))
                }
            </ul>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        todos: state.todos
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeStatus(ev, id) {
            const action = changeFinished(id, ev.target.checked);
            dispatch(action);
        },
        deleteList(index) {
            const action = deleteListItem(index);
            dispatch(action);
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);