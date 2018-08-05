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
    allTabs:{},
    tabCount:0
  }
}

const selection = {
  type:'',
  data:[],
  editState:'',
  details:{},
}

const app = {
  user:{},
  appMode: 'EDIT',
  selection,
}

const controller = {
    key:{
      // 'a':false,
      // 'b':false,
    }
  }

const sidebars = {
  left:{
    selected:'assets',
    tabs:['assets','layers','globalLinks'],
    width:230,
  },
  right:{
    selected:'styles',
    tabs:['styles','links','interactions'],
  }
}

const messages = [];

const ui = {
  controller,
  sidebars,
  messages,
}

const store_initial = {
  domain,
  app,
  ui,
};

const constants = {
  appModes:['EDIT','PREVIEW'],

}

export { store_initial, constants }
