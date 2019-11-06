
import { put, takeEvery, call } from 'redux-saga/effects'
import { INIT_ALL_ITEM, GET_ALL_ITEM} from './actionTypes'
import { getItem } from './get'
function* inits() {
    const item = yield call(getItem);
    yield put({type: GET_ALL_ITEM, item})
}

function* mySaga () {
    yield takeEvery(INIT_ALL_ITEM, inits)
}

export default mySaga;