import { getSelectionFirstID, getComponentFromCurrentTab } from 'quo-redux/helpers';
import uuidv1 from 'uuid/v1';
import _ from 'lodash';
import { addComponentState } from './states';

// INIT
// set current link id in link builder
// update the link builder mode('sourceSelected')

// SOURCE_SELECTED
// set the target in link linkBuilder

// TARGET_SELECTED
// you can't link a component to itself => noop
// set the source in the link linkBuilder

// CREATE_LINK
// cleans the linkBuilder
// uses the information to populate the components
// the component should have a links tab with

// { linkid: { id: linkid, isSource, isTarget, trigger }}
// { triggers { onHover: [linkid1,linkid2] }, targets {linkid :component}
// }

export const setLinkSource = (tabs, action) => {

  if(!action.payload) return { ...tabs }

  let { linkId, source, target, triggers, disables } = action.payload

  let sourceComponent = getComponentFromCurrentTab(tabs, source);

  triggers.forEach((event)=>{
    sourceComponent.links.triggers[event].push(target);
  })

  disables.forEach((event)=>{
    sourceComponent.links.disables[event].push(target);
  })

  sourceComponent.links.targetStateIds[target] = linkId;

  console.log(sourceComponent)

  return _.cloneDeep(tabs);

}

// export const setLinkSource = (links,action) => {
//   const { domain, app } = action;
//
//   let selectionID = getSelectionFirstID(undefined,action.app);
//
//   if(!selectionID) return { ...links };
//
//   let newLink = createNewLink(action.payload.linkId);
//   newLink.source = selectionID;
//   links[newLink.id] = newLink;
//
//   //lazy way to return new object
//   return _.cloneDeep(links);
// }

export const setLinkTarget = (tabs,action) => {

  if(!action.payload) return { ...tabs }

  let { linkId, source, target, triggers, disables, linkState } = action.payload


  let targetComponent = getComponentFromCurrentTab(tabs, target);

  targetComponent.state.states[linkState.id] = linkState;

  console.log(targetComponent.state.states);

  return _.cloneDeep(tabs);
}
