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

  let allTheComponentsToAdd = traverseAndAdd(component,source.components,{});

  target.components = _.merge(target.components,allTheComponentsToAdd);

  // let componentTree = findComponentTree(page,id);

  // console.log(component,componentTree);

  //a component can be added from the reactive components as well
  //so make sure that there is a check for that later

  //call a function to transform(create a copy of the component and all its subtree)

  //this should work as
  //find the component, give it a new id,
  //find its tree structure, as you go down, copy and give as well as adding to the list of components.
  //then add the component tree to the existing artboards tree,
  //merge the componenent collection with the component collection of the artboard
  //return the tab back.

  //add the component

  //how to handle links

  //links are stored in the trigger component
  //and fire of a change in the other element.

  // links = {
  //   linkId:{
  //     trigger:{
  //       id:'id of the trigger component'
  //       method:'click'
  //     },
  //     targets:[
  //       {
  //         id:'id of the target component',
  //         change:[
  //           {
  //             type:'position,style-bg-color',
  //             value:'value of the property change'
  //             timing:{
  //               'props for timing go here'
  //             }
  //           },
  //         ]
  //       }
  //     ]
  //   },
  //   linkId...,
  //   linkId...,
  // }

  // //add it to the list of tabs
  // tabs.allTabs[newTab.id] = newTab;
  //
  // //switch the active tab to the new tab
  // tabs.activeTab = newTab.id;
  //
  // // increment the tabCount
  // tabs.tabCount += 1;

  return { ...tabs };
}

const traverseAndAdd = (component,components,collector) => {

  //create a new id, and add it to the collector
  let newID = uuidv1();
  collector[newID] = components[component.id];
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
