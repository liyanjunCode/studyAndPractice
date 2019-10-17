import React, { Component } from 'react';
import HeadCom from './component/head.js'
import Main from './component/content.js'
import Foot from './component/foot.js'
import store from './store/index.js';
import { initAllItem } from './store/actionCreators';
class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="todo-container">
            <div className="todo-wrap">
                <HeadCom/>
                <Main/>
                <Foot/>
            </div>
        </div>
        );
    }
    componentDidMount() {
        store.dispatch(initAllItem())
    }
}
export default App;
