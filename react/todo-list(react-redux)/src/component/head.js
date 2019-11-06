import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addItemList } from '../store/actionCreators'
 class HeadCom extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="todo-header">
                <input type="text" placeholder="请输入今天的任务清单，按回车键确认" onKeyDown={(ev) => this.props.additemDetail(ev)}/>
            </div>
        )
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        additemDetail(ev) {
            if (ev.target.value) {
                if(ev.keyCode === 13) {
                   const action =  addItemList(ev.target.value);
                   dispatch(action)
                }
            }
        }
    }
}
export default connect(null, mapDispatchToProps)(HeadCom)