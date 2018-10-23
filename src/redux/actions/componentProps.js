import { getState } from 'quo-redux/state';
import messageActions from './messageStack';

const UPDATE_COMPONENT_PROPS_ACTION = (payload,domain) => ({
  type:'UPDATE_COMPONENT_PROPS',
  payload:payload,
  domain:domain,
})

const UPDATE_COMPONENT_PROPS = (payload) => (dispatch,getFullState) => {
  let domain = getState(getFullState(),'domain');
  // alert(JSON.stringify(payload));
  dispatch(UPDATE_COMPONENT_PROPS_ACTION(payload,domain));
  // dispatch(messageActions.ADD_MESSAGE({type:'status',duration:1500,text:'Updated component property'}));
}

export default {
  UPDATE_COMPONENT_PROPS
}
