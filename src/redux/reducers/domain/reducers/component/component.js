import uuidv1 from 'uuid/v1';
import _ from 'lodash';
import { newTab } from '../tabs';

export const addComponent = (tabs,action) => {

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

  let component = source.components[payload.component.id];
  let newComps = traverseAndAdd(component,source.components,{});

  //There is a need to retrieve the new id for the root comp
  //as it needs to be added to the children of the tab.

  let rootComponentID;

  //assign new IDs to all the keys.

   _.forEach(newComps,(o)=>{
     let newID = uuidv1().toUpperCase();
     let oldID = o.id.slice();
     //if it is the root comp, save the id.
     if(o.id === payload.component.id){
       rootComponentID = newID;
     }
     o.id = newID;
     //replace the key
     delete Object.assign(newComps, {[newID]: newComps[oldID] })[oldID]
  })

  //add the new components to the existing component obj.

  target.components = _.merge(target.components,newComps);

  //add the root component to the existing children array.

  target.children.push(rootComponentID);

  return { ...tabs };

}

export const removeComponent = (tabs,action) => {

  let domain = action.domain;
  let payload = action.payload;
  let target = tabs.allTabs[domain.tabs.activeTab];
  let component = target.components[payload.id];

  //NOT WORKING YET!!!

  let allTheComponentsToDelete = traverseAndAdd(component,target.components,{});
  Object.keys(allTheComponentsToDelete).map( comp => {
    delete target.components[comp.id]
  })
  return { ...tabs };
}

const traverseAndAdd = (component,components,collector) => {

  //add it to the collector
  collector[component.id] = {...components[component.id]};

  //recursively call it for the children
  let allTheChildren = component.children.map( childID => {
    return traverseAndAdd(components[childID],components,{})
  })

  //merge the collected components
  collector = allTheChildren.reduce(_.merge,collector);

  return collector;

}
