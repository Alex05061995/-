import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools}  from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import appReducer from './appReducer.js';
import fileReducer from './fileReducer.js';
import uploadReducer from './uploadReducer.js';
import userReducer from './userReducer.js';

const rootReducer = combineReducers({
    user: userReducer,
    files: fileReducer,
    upload: uploadReducer,
    app: appReducer
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))