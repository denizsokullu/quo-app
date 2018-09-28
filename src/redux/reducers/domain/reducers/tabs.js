import uuidv1 from 'uuid/v1';

const newTab = (tabs,action) => {

  let newTab = {
    id:uuidv1().toUpperCase(),
    name:`Tab ${tabs.tabCount}`,
    components:action.payload ? action.payload : {},
    children:[],
    tabCount:tabs.tabCount
  }
  //add it to the list of tabs
  tabs.allTabs[newTab.id] = newTab;

  //switch the active tab to the new tab
  tabs.activeTab = newTab.id;

  // increment the tabCount
  tabs.tabCount += 1;

  return { ...tabs }
}

const changeActiveTab = (tabs,action) => {
  let newTabs = { ...tabs };
  newTabs.activeTab = action.payload.id;
  return newTabs
}

const editTab = (tabs,action) => {

  tabs.allTabs[action.payload.id] = action.payload;
  return { ...tabs };

}

const deleteTab = (tabs,action) => {
  //if tab exists
  if(action.payload && tabs.allTabs[action.payload.id]){
      //get rid of the tab data
      delete tabs.allTabs[action.payload.id];
      if(tabs.activeTab === action.payload.id){
        let tabIds = Object.keys(tabs.allTabs);
        //if it was the last tab, set active tab to empty
        if(tabIds.length === 0){
          tabs.activeTab = '';
        }
        else{
          tabs.activeTab = tabIds[0];
        }
      }
  }
  //noop
  return tabs;
}

export { newTab, changeActiveTab, editTab, deleteTab }
