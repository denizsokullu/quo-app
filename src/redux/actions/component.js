import { getSubState } from 'quo-redux/state';
import { ADD_MESSAGE } from './messageStack';

export const ADD_COMPONENT_ACTION = (payload,domain) => ({
  type:'ADD_COMPONENT_TO_TAB',
  payload:payload,
  domain:domain,
})

const ADD_COMPONENT = (payload) => (dispatch,getState) => {
  let domain = getSubState(getState(),'domain');
  dispatch(ADD_COMPONENT_ACTION(payload,domain));
  dispatch(ADD_MESSAGE({type:'status',duration:1500,text:'Added component'}));
}

export const COMPONENT_SELECT = (component) => ({
  type:'COMPONENT_SELECT',
  payload: component
})
