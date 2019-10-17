import React, { Component } from 'react';
import HeadCom from './component/head.js'
import Main from './component/content.js'
import Foot from './component/foot.js'
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [
                {id: 1, title: '看一小时React的课程', finished: false},
                {id: 2, title: '打一小时台球', finished: false},
                {id: 3, title: '看一小时Java的课程', finished: false},
                {id: 4, title: '看一小时Python的课程', finished: false},
            ],
            finishedCount: 0,
            allChecked: false
        }
    }
    render() {
        return (
            <div className="todo-container">
            <div className="todo-wrap">
                <HeadCom/>
                <Main/>
                {/* allChecked={this.state.allChecked} finishedCount={this.state.finishedCount} totalNum={this.state.todos.length} clearFinished={this._clearFinished} selectAll={this._selectAll} */}
                <Foot/>
            </div>
        </div>
        );
    }
}
export default App;
