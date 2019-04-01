import { handleActions } from 'redux-actions';
import actionTypes from './actionTypes';

// 初始化redux数据
const initialState = () => {
    return JSON.parse(window.localStorage.getItem('$$/User/info')) || {
        enthusiasmLevel: 2,
        describe: 'ant-mobile + react + redux, 个人github了解更多...',
    };
};

// actions
export default handleActions({
    [actionTypes.INCREMENT_ENTHUSIASM]: (state, action) => {
        return {
            ...state,
            enthusiasmLevel: state.enthusiasmLevel + 1,
        };
    },
    [actionTypes.DECREMENT_ENTHUSIASM]: (state, action) => {
        return {
            ...state,
            enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1),
        };
    },
    [actionTypes.SET_ENTHUSIASM]: (state, action) => {
        const newData = {
            ...state,
            ...action.payload,
        };
        // 保存到localStorage 防止刷新数据丢失
        // userInfo.cToken ? Cookies.set('cToken', userInfo.cToken) : Cookies.remove('cToken');
        window.localStorage.setItem('$$/User/info', JSON.stringify(newData));
        return newData;
    },
    [actionTypes.SET_NEW_MSG]: (state, action) => {
        return {
            ...state,
            describe: action.payload.describe,
        };
    },
    
}, initialState());