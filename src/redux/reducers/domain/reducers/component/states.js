// import { getComponentFromCurrentTab, getCurrentState, PropCompositor } from 'quo-redux/helpers';
import _ from 'lodash';

export const addComponentState = (tabs,action) => {

  window.alert('adding state to component state');

  // no component specified
  if(!action.payload) return tabs;

  return _.cloneDeep(tabs);

}
