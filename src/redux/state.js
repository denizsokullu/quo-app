// const data = {
//   newAssets:{
//
//   },
//   linkPreview:{
//     received:false,
//     component:null
//   },
//   newSelection:'',
//   selectionSiblings:[],
//   currentProject:'-LGParuUInchgusujCer',
//   currentPage:"",
//   viewerZoom:1,
//   //write a function to init the keys
//   controller:controller,
//   textEdit:'',
//   selection:{
//
//   },
//   editState:'none'
// }

const domain = {
  //Flat Files
  assets:{},
  //Edited Components
  components:{},
  projects:{},
  tabs:{
    activeTab:'',
    allTabs:[],
  }
}

const selection = {
  type:'',
  data:[],
  editState:'',
  details:{},
}

const appState = {
  user:{},
  appMode: 'EDIT',
  selection:selection,
}

const controller = {
    key:{
      // 'a':false,
      // 'b':false,
    }
  }

const uiState = {
  controller:controller,
}

const store_initial = {
  domain:domain,
  app:appState,
  ui:uiState,
};

const constants = {
  appModes:['EDIT','PREVIEW'],

}

export { store_initial, constants }
