//
const controller = {
    key:{
      // 'a':false,
      // 'b':false,
    }
  }

const data = {
  newAssets:{
    
  },
  linkPreview:{
    received:false,
    component:null
  },
  newSelection:'',
  selectionSiblings:[],
  currentProject:'-LGParuUInchgusujCer',
  currentPage:"",
  viewerZoom:1,
  //write a function to init the keys
  controller:controller,
  textEdit:'',
  selection:{

  },
  editState:'none'
}

const store_initial = {
  // main:{
    past: [],
    present: data, // (?) How do we initialize the present?
    future: [],
  // },
  routing: {},
}

export { store_initial }
