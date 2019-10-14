import { DELETE_LIST_ITEM, 
    CHANGE_LIST_STATUS,
    ADD_LIST_ITEM
 } from './actionTypes'

let defaultState = {
    todos: [
        {id: 1, title: '看一小时React的课程', finished: false},
        {id: 2, title: '打一小时台球', finished: false},
        {id: 3, title: '看一小时Java的课程', finished: false},
        {id: 4, title: '看一小时Python的课程', finished: false},
    ],
    finishedCount: 0,
    allChecked: false
}

export default (state = defaultState, action) => {
    if (action.type === DELETE_LIST_ITEM) {
        let newState = JSON.parse(JSON.stringify(state));
        newState.todos.splice(action.index, 1);
        return newState
    }
    if (action.type === CHANGE_LIST_STATUS) {
        const { id , flag } = action;
        let newState = JSON.parse(JSON.stringify(state));
        let finishedCount = 0;
        newState.todos.forEach((item, index) => {
            if (item.id === id) {
                item.finished = flag;
            }
        })
        newState.todos.forEach((item) => {
            if (item.finished) {
                finishedCount++;
            }
        })
        newState.allChecked = finishedCount === newState.todos.length;
        return newState
    }
    if (action.type ===  ADD_LIST_ITEM) {
        console.log(111)
    }
   
    return state
}