import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import mySaga from './saga';
const sagaMiddleware = createSagaMiddleware();
const composeEnhancer = composeWithDevTools(
    applyMiddleware(sagaMiddleware)
);
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(
    reducer,
    composeEnhancer
);

sagaMiddleware.run(mySaga);

export default store