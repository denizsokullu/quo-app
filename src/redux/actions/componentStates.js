import { getState } from 'quo-redux/state';
import messageActions from './messageStack';

const ADD_COMPONENT_STATE_ACTION = (payload,domain) => ({
  type:'ADD_COMPONENT_STATE',
  payload:payload
})

const ADD_COMPONENT_STATE = (payload) => (dispatch,getFullState) => {
  dispatch(ADD_COMPONENT_STATE_ACTION(payload));
  dispatch(messageActions.ADD_MESSAGE({type:'status',duration:1500,text:'Added component state'}));
}

export default {
    ADD_COMPONENT_STATE
}
