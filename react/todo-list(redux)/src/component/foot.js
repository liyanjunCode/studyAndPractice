import React, { Component } from 'react'
import PropTypes from 'prop-types'
export default class Foot extends Component {
    static propTypes = {
        finishedCount: PropTypes.number.isRequired,
        totalNum: PropTypes.number.isRequired,
        clearFinished: PropTypes.func.isRequired,
        selectAll: PropTypes.func.isRequired,
        allChecked:  PropTypes.bool.isRequired,
    };
    render() {
        const { finishedCount, totalNum, allChecked, selectAll, clearFinished } = this.props;
        return (
            <div className="todo-footer">
                <label>
                <input type="checkbox" checked={allChecked} onChange={(ev) => selectAll(ev)}/>
                </label>
                <span>
                <span>已完成{ finishedCount }件</span> / 总计{ totalNum }件
                </span>
                <button className="btn btn-warning" onClick={() => clearFinished()}>清除已完成任务</button>
            </div>
        )
    }
}




