import { getState } from 'quo-redux/state';
import { getSelectionFirstID,
         getCurrentLinkBuilderMode,
         getLinkBuilder } from 'quo-redux/helpers';
import ComponenState from 'parser/ComponentState';
import uuidv1 from 'uuid/v1';
import ComponentState from '../../parser/ComponentState';

const SET_LINK_SOURCE = (payload) => ({
  type:'SET_LINK_SOURCE',
  payload: payload,
})

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
    let linkName = 'link1'
    let source = getSelectionFirstID(getFullState(),app);
    if(!source) return;
    dispatch(UPDATE_LINK_BUILDER_DATA({ source, linkId, mode: 'SOURCE_SELECTED', ...payload}));
    break

    case 'SOURCE_SELECTED':
    let target = getSelectionFirstID(getFullState(),app);
    if(!target) return;
    dispatch(UPDATE_LINK_BUILDER_DATA({ target, mode: 'TARGET_SELECTED' }));
    break

    case 'TARGET_SELECTED':
    // set the fake data for the time being
    let linkBuilderData = { ...getLinkBuilder(app)};
    let data = {
      // enables:['onMouseEnter'],
      // disables:['onMouseLeave'],

      //this should be set in the link builder reducer instead of here...
      linkState: new ComponentState('link1',[],[],linkBuilderData.props,10,linkBuilderData.linkId),
    }
    // add in the data
    dispatch(UPDATE_LINK_BUILDER_DATA({ ...data }));
    // get the data
    linkBuilderData = { ...getLinkBuilder(app), ...data};

    // pass the data to the components(source & target)
    dispatch(SET_LINK_SOURCE(linkBuilderData));
    dispatch(SET_LINK_TARGET(linkBuilderData));
    // change this, but for now, this sets 
    // the link builder back to init
    dispatch(UPDATE_LINK_BUILDER_DATA({mode: 'INIT'}))
    break

    default:
    break
  }
}

export default {
  SET_LINK_SOURCE,
  CREATE_LINK,
  UPDATE_LINK_BUILDER_DATA
}
