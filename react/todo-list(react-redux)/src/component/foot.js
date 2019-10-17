import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkAllItem, selectAllItem } from '../store/actionCreators'
 class Foot extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { finishedCount, todos, allChecked, checkAll, selectAllItems } = this.props;
        return (
            <div className="todo-footer">
                <label>
                <input type="checkbox" checked={allChecked} onChange={(ev) => {selectAllItems(ev)}}/>
                </label>
                <span>
                <span>已完成{ finishedCount }件</span> / 总计{ todos.length }件
                </span>
                <button className="btn btn-warning" onClick={() => {checkAll()}}>清除已完成任务</button>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        finishedCount: state.finishedCount,
        todos: state.todos,
        allChecked: state.allChecked
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        checkAll() {
            const action = checkAllItem(); 
            dispatch(action);
        },
        selectAllItems(ev) {
            const action = selectAllItem(ev.target.checked); 
            dispatch(action);
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Foot)


