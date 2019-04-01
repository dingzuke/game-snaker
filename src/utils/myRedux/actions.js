import { createActions } from 'redux-actions';
import actionTypes from './actionTypes';

export default createActions(
    actionTypes.INCREMENT_ENTHUSIASM,
    actionTypes.DECREMENT_ENTHUSIASM,
    actionTypes.SET_NEW_MSG,
    actionTypes.SET_ENTHUSIASM,
);