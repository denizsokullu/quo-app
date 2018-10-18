import { getState } from 'quo-redux/state';
import { getSelectionFirstID,
         getCurrentLinkBuilderMode,
         getLinkBuilder } from 'quo-redux/helpers';
import uuidv1 from 'uuid/v1';

const SET_LINK_SOURCE = () => (dispatch,getFullState) => {
  let app = getState(getFullState(), 'app');

  window.alert('set link source fired')

  let action = (payload) => ({
      type:'SET_LINK_SOURCE',
      payload: payload,
  })

  dispatch(action(getLinkBuilder(app)))
}
// update this
const SET_LINK_TARGET = (payload,domain,app) => ({
  type:'SET_LINK_TARGET',
  payload:payload,
})

const UPDATE_LINK_BUILDER_DATA = (payload) => ({
  type:'UPDATE_LINK_BUILDER_DATA',
  payload:payload
})

const CREATE_LINK = (payload) => (dispatch,getFullState) => {
  let domain = getState(getFullState(), 'domain');
  let app = getState(getFullState(), 'app');
  let currentMode = getCurrentLinkBuilderMode(app);

  switch(currentMode){
    case 'INIT':
    let linkId = uuidv1();
    let source = getSelectionFirstID(getFullState(),app);
    if(!source) return;
    dispatch(UPDATE_LINK_BUILDER_DATA({ source, linkId, mode: 'SOURCE_SELECTED' }));
    break
    case 'SOURCE_SELECTED':
    let target = getSelectionFirstID(getFullState(),app);
    if(!target) return;
    dispatch(UPDATE_LINK_BUILDER_DATA({ target, mode: 'TARGET_SELECTED' }));
    break
    case 'TARGET_SELECTED':
    let data = {
      triggers:['onMouseEnter'],
      disables:['onMouseLeave'],
      //props will be used later.
      props:{},
    }
    dispatch(UPDATE_LINK_BUILDER_DATA({ ...data, mode: 'INIT' }));
    dispatch(SET_LINK_SOURCE());
    break
    default:
    break
  }
}

//selecting a component triggers a change.
// if tab is active set according to the mode of the link builder
// this includes selections that are in order.
// if tab is not active:
//  only update the source when re-selecting.

export default {
  SET_LINK_SOURCE,
  CREATE_LINK,
  UPDATE_LINK_BUILDER_DATA
}
