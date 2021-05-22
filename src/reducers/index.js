import {combineReducers} from 'redux';
import hkReducer from './hkreducer';
let reducers = combineReducers({
    hk: hkReducer,
})
export default reducers