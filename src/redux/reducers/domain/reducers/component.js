import uuidv1 from 'uuid/v1';
import _ from 'lodash';
import { newTab } from './tabs';

export const addComponent = (tabs,action) => {

  //find tab
  //use the location of the component
  //add it using a new ID

  //add a tab if there is none
  if(_.isEmpty(tabs.allTabs)){
    //this is the part where it tries to create a size for the tab
    //for the time being, ignore this aspect;
    tabs = newTab(tabs,{data:undefined});
  }

  //unpack action
  let domain = action.domain;
  let payload = action.payload;

  //target tab to add

  let target = tabs.allTabs[domain.tabs.activeTab];

  let source = domain[payload.source][payload.filetype][payload.page]
  // let componentTree = payload.component.components
  let component = source.components[payload.component.id];

  console.log(component,source.components);

  let allTheComponentsToAdd = traverseAndAdd(component,source.components,{});

  target.components = _.merge(target.components,allTheComponentsToAdd);

  return { ...tabs };

}

export const removeComponent = (tabs,action) => {
  let domain = action.domain;
  let payload = action.payload;
  let target = tabs.allTabs[domain.tabs.activeTab];
  let component = target.components[payload.id];
  let allTheComponentsToDelete = traverseAndAdd(component,target.components,{});
  Object.keys(allTheComponentsToDelete).map( comp => {
    delete target.components[comp.id]
  })
  return { ...tabs };
}

const traverseAndAdd = (component,components,collector) => {

  //create a new id, and add it to the collector
  let newID = uuidv1().toUpperCase();
  collector[newID] = {...components[component.id]};
  collector[newID].id = newID;

  //recursively call it for the children
  let allTheChildren = component.children.map( childID => {
    return traverseAndAdd(components[childID],components,{})
  })

  //merge the collected components
  collector = allTheChildren.reduce(_.merge,collector);

  return collector;

}

export const removeComponent = (tabs,action) => {

  //find tab
  //use the location of the component
  //add it using a new ID

  // //add it to the list of tabs
  // tabs.allTabs[newTab.id] = newTab;
  //
  // //switch the active tab to the new tab
  // tabs.activeTab = newTab.id;
  //
  // // increment the tabCount
  // tabs.tabCount += 1;

  return tabs
}
