import { getState } from 'quo-redux/state';
import messageActions from './messageStack';

const UPDATE_COMPONENT_PROPS_ACTION = (payload,domain) => ({
  type:'UPDATE_COMPONENT_PROPS',
  payload:payload,
  domain:domain,
})

const UPDATE_COMPONENT_PROPS = (payload) => (dispatch,getFullState) => {
  let domain = getState(getFullState(),'domain');
  dispatch(UPDATE_COMPONENT_PROPS_ACTION(payload,domain));
}

const ADD_STATE_TO_COMPOSITE = (payload) => ({
  type:'ADD_STATE_TO_COMPOSITE',
  payload:payload,
})

const REMOVE_STATE_FROM_COMPOSITE = (payload) => ({
  type:'REMOVE_STATE_FROM_COMPOSITE',
  payload:payload,
})

export default {
  UPDATE_COMPONENT_PROPS,
  ADD_STATE_TO_COMPOSITE,
  REMOVE_STATE_FROM_COMPOSITE
}
