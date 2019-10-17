import { 
    DELETE_LIST_ITEM, 
    CHANGE_LIST_STATUS,
    ADD_LIST_ITEM,
    CHECK_ALL_ITEM,
    SELECT_ALL_ITEM,
    INIT_ALL_ITEM
} from './actionTypes'
// 初始化列表数据
const initAllItem = () => ({
    type: INIT_ALL_ITEM
})
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
export {
    deleteListItem,
    changeFinished,
    addItemList,
    checkAllItem,
    selectAllItem,
    initAllItem
}