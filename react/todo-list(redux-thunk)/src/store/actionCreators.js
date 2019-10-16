import { 
    DELETE_LIST_ITEM, 
    CHANGE_LIST_STATUS,
    ADD_LIST_ITEM,
    CHECK_ALL_ITEM,
    SELECT_ALL_ITEM,
    INIT_LIST_ITEM
} from './actionTypes'

// 删除列表项
const deleteListItem = (index) => ({
    type: DELETE_LIST_ITEM,
    index
})
const changeFinished = (id, flag) => ({
    type: CHANGE_LIST_STATUS,
    id, 
    flag
})
const addItemList = (text) => ({
    type: ADD_LIST_ITEM,
    text
})
const checkAllItem = () => ({
    type: CHECK_ALL_ITEM
})
const selectAllItem = (flag) => ({
    type: SELECT_ALL_ITEM,
    flag
})
const initList = () => {
    const list = [
        {id: 1, title: '看一小时React的课程', finished: false},
        {id: 2, title: '打一小时台球', finished: false},
        {id: 3, title: '看一小时Java的课程', finished: false},
        {id: 4, title: '看一小时Python的课程', finished: false}
    ]
    return (dispatch) => {
        setTimeout(() => {
            dispatch({
                type: INIT_LIST_ITEM,
                list
            })
        }, 1000)
    }
}
export {
    deleteListItem,
    changeFinished,
    addItemList,
    checkAllItem,
    selectAllItem,
    initList
}