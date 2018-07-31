import { combineReducers } from 'redux';

const controller = (state = {}, action) => {return state};

const ui = combineReducers({
  controller,
})

export default ui
