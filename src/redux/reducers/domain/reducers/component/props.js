import { getComponentFromCurrentTab, getCurrentState } from 'quo-redux/helpers';
import _ from 'lodash';

export const updateComponentProps = (tabs,action) => {

  //no component specified
  if(!action.payload.id) return tabs;

  //no prop update specified
  if(!action.payload.props) return tabs;

  let id = action.payload.id;
  let propsToUpdate = action.payload.props;
  let component = getComponentFromCurrentTab(tabs,id);
  let sourceProps = component.state.states[component.state.current].props;
  sourceProps = _.mergeWith(sourceProps,propsToUpdate, (s,n) => n);
  console.log(sourceProps)
  return _.cloneDeep(tabs);
}
