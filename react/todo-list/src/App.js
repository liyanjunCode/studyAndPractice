import React, { Component } from 'react';
import logo from './logo.svg';
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
    _changeFinished = (id, flag) => {
        let finishedCount = 0;
        this.state.todos.find((item, index) => {
            if (item.id === id) {
                item.finished = flag;
            }
        })
        this.state.todos.forEach((item) => {
            if (item.finished) {
                finishedCount++;
            }
        })
        this.setState({
            finishedCount,
            allChecked: finishedCount === this.state.todos.length
        })
    }
    _deleteList = (idx) => {
        this.state.todos.splice(idx, 1);
        this.setState({
            todos: this.state.todos
        })
    }
    _addItem = (item) => {
        this.state.todos.push(item);
        this.setState({
            todos: this.state.todos
        })
    }
    _clearFinished = () => {
        const notFinish = [];
        let finishedCount = 0;
        this.state.todos.forEach((item) => {
            if (!item.finished) {
                notFinish.push(item);
            }
        })
        notFinish.forEach((item) => {
            if (item.finished) {
                finishedCount++;
            }
        })
        this.setState({
            todos: notFinish,
            finishedCount,
            allChecked: false
        })
    }
    _selectAll = (ev) => {
        this.state.todos.forEach((item) => {
            if (ev.target.checked) {
                item.finished = true;
            } else {
                item.finished = false;
            }
            
        })
        this.setState({
            todos: this.state.todos,
            finishedCount :  ev.target.checked ? this.state.todos.length : 0,
            allChecked: ev.target.checked
        })
    }
    render() {
        return (
            <div className="todo-container">
            <div className="todo-wrap">
                <HeadCom addItem={this._addItem} prevId={this.state.todos.length ? this.state.todos.length : 0 }/>
                <Main todos={ this.state.todos } changeFinished={this._changeFinished} deleteList={this._deleteList}/>
                <Foot allChecked={this.state.allChecked} finishedCount={this.state.finishedCount} totalNum={this.state.todos.length} clearFinished={this._clearFinished} selectAll={this._selectAll}/>
            </div>
        </div>
        );
    }
}
export default App;
