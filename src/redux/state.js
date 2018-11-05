const domain = {
  //Flat Files
  assets:{
    sketch:{},
    image: {}
  },
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

const linkBuilder = {
  mode:'INIT', // possible modes INIT, SOURCE_SELECTED, TARGET_SELECTED
  linkId: '',
  source: '',
  target: '',
  enables: [],
  disables: [],
  linkState: undefined,
}

const app = {
  user:{},
  appMode: 'EDIT',
  linkBuilder,
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

const stateManager = {
  selectedState:'',
}

const ui = {
  controller,
  sidebars,
  messages,
  stateManager,
}

const storeInitial = {
  domain,
  app,
  ui,
};

const getState = (state,target) => {
  //later on, the main root(domain, app, ui) might be pushed
  //deeper in the tree, having to update mapStateToProps on
  //the components might be annoying so use this method instead.
  return state[target]
}

const constants = {
  appModes:['EDIT','PREVIEW'],

}

export { storeInitial, constants, getState }
