import { getState } from 'quo-redux/state';
import { getCurrentLinkBuilderMode } from 'quo-redux/helpers';
import uuidv1 from 'uuid/v1';

const SET_LINK_SOURCE = (payload,domain,app) => ({
  type:'SET_LINK_SOURCE',
  payload:payload,
  domain:domain,
  app:app,
})

const SET_LINK_TARGET = (payload,domain,app) => ({
  type:'SET_LINK_TARGET',
  payload:payload,
  domain:domain,
  app:app,
})

const UPDATE_LINK_BUILDER_MODE = (payload) => ({
  type:'UPDATE_LINK_BUILDER_MODE',
  payload:payload
})

const SET_CURRENT_LINK_ID = (payload) => ({
  type:'SET_CURRENT_LINK_ID',
  payload:payload
})

const CREATE_LINK = (payload) => (dispatch,getFullState) => {
  let domain = getState(getFullState(), 'domain');
  let app = getState(getFullState(), 'app');
  let currentMode = getCurrentLinkBuilderMode(app);

  switch(currentMode){
    case 'INIT':
    //nothing is selected, selecting first component
    //create the the shared link id here:
    let id = uuidv1();
    payload = { linkId: id }
    dispatch(SET_CURRENT_LINK_ID(id));
    dispatch(SET_LINK_SOURCE(payload,domain,app));
    dispatch(UPDATE_LINK_BUILDER_MODE('SOURCE_SELECTED'));
    break
    case 'SOURCE_SELECTED':
    //first component selected, selecting 2nd component
    dispatch(SET_LINK_TARGET(payload,domain,app));
    dispatch(UPDATE_LINK_BUILDER_MODE('TARGET_SELECTED'));
    break
    case 'TARGET_SELECTED':
    //second component is selected, finalize linking
    dispatch(UPDATE_LINK_BUILDER_MODE('INIT'));
    break
    default:
    break
  }
  //order of actions
  // check the state of the link builder
  // case on that and call according reducer actions
  // update the state of the link builder
}

//selecting a component triggers a change.
// if tab is active set according to the mode of the link builder
// this includes selections that are in order.
// if tab is not active:
//  only update the source when re-selecting.

export default {
  CREATE_LINK,
  UPDATE_LINK_BUILDER_MODE
}
