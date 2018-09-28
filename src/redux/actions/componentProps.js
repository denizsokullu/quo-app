import { getSubState } from 'quo-redux/state';
import { ADD_MESSAGE } from './messageStack';
import { ADD_COMPONENT_ACTION } from './component';

export const UPDATE_COMPONENT_PROP = (payload) => (dispatch,getState) => {
  let domain = getSubState(getState(),'domain');
  dispatch(ADD_COMPONENT_ACTION(payload,domain));
  dispatch(ADD_MESSAGE({type:'status',duration:1500,text:'Updated component property'}));
}
