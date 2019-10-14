import { 
    DELETE_LIST_ITEM, 
    CHANGE_LIST_STATUS,
    ADD_LIST_ITEM
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
const addItemList = (item) => ({
    type: ADD_LIST_ITEM,
    item
})
export {
    deleteListItem,
    changeFinished,
    addItemList
}