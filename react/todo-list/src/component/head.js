import React, { Component } from 'react'
import PropTypes from 'prop-types'
export default class HeadCom extends Component {
    static propTypes = {
        addItem: PropTypes.func.isRequired,
        prevId: PropTypes.number.isRequired,
    };
    render() {
        return (
            <div className="todo-header">
                <input type="text" placeholder="请输入今天的任务清单，按回车键确认" onKeyDown={(ev) => this._additemDetail(ev, this.props.prevId)}/>
            </div>
        )
    }
    _additemDetail(ev, prevId) {
        console.log(prevId)
        if (ev.target.value) {
            if(ev.keyCode == 13) {
                this.props.addItem({id: prevId + 1, title: ev.target.value, finished: false}) 
            }
        }
    }
}