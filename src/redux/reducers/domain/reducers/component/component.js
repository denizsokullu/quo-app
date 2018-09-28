import uuidv1 from 'uuid/v1';
import _ from 'lodash';
import { newTab } from '../tabs';

//Recursively adds the children of an component to an array
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

export const addComponent = (tabs,action) => {

    var t0 = performance.now();

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
    let target = { ...tabs.allTabs[domain.tabs.activeTab] };
    let source = domain[payload.source][payload.filetype][payload.page]

    let component = source.components[payload.component.id];

    //add all the children components of the selected components if they exist
    let newComps = traverseAndAdd(component,source.components,{});

    //There is a need to retrieve the new id for the root comp
    //as it needs to be added to the children of the tab.

    let rootComponentID;

    //assign new IDs to all the keys.
    let oldIDMappings = {}

    _.forEach(newComps,(o)=>{
        let newID = uuidv1().toUpperCase();
        let oldID = o.id.slice();
        oldIDMappings[oldID] = newID;
        //if it is the root comp, save the id.
        if(o.id === payload.component.id){
            rootComponentID = newID;
        }
        o.id = newID;
        //replace the key
        delete Object.assign(newComps, {[newID]: newComps[oldID] })[oldID]
    })

    //Add the new mappings into newComps
    _.forEach(newComps,(o)=>{
        o.children = o.children.map(child=>{
            return oldIDMappings[child]
        })
    })

    //add the new components to the existing component obj.
    target.components = _.merge(target.components,newComps);

    //add the root component to the existing children array.
    target.children.push(rootComponentID);

    let newTabs =  _.cloneDeep(tabs);

    var t1 = performance.now();
    console.log("Call to addComponent took " + (t1 - t0) + " milliseconds.")

    return newTabs;

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
