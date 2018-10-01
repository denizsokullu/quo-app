import { getState } from 'quo-redux/state';
import messageActions from './messageStack';

const ADD_COMPONENT_ACTION = (payload,domain) => ({
  type:'ADD_COMPONENT_TO_TAB',
  payload:payload,
  domain:domain,
})

const ADD_COMPONENT = (payload) => (dispatch,getFullState) => {
  let domain = getState(getFullState(),'domain');
  dispatch(ADD_COMPONENT_ACTION(payload,domain));
  dispatch(messageActions.ADD_MESSAGE({type:'status',duration:1500,text:'Added component'}));
}

const COMPONENT_SELECT = (component) => ({
  type:'COMPONENT_SELECT',
  payload: component
})

export default {
  ADD_COMPONENT_ACTION,
  ADD_COMPONENT,
  COMPONENT_SELECT,
}
