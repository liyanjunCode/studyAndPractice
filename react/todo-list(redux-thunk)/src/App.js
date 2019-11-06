import React, { Component } from 'react';
import HeadCom from './component/head.js'
import Main from './component/content.js'
import Foot from './component/foot.js'
import { initList } from './store/actionCreators'
import store from './store/index.js';
class App extends Component {
    constructor(props) {
        super(props);   
    }
    componentWillMount () {
        const action = initList();
        store.dispatch(action)
    }
    render() {
        return (
            <div className="todo-container">
            <div className="todo-wrap">
                <HeadCom/>
                <Main />
                <Foot/>
            </div>
        </div>
        );
    }
}
export default App;
