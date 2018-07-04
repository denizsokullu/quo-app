//
const controller = {
    key:{
      // 'a':false,
      // 'b':false,
    }
  }

const data = {
  assets:{
    data:{

    }
  },
  newAssets:{

  },
  linkPreview:{
    received:false,
    component:null
  },
  newSelection:'',
  currentProject:'-LGParuUInchgusujCer',
  currentPage:"",
  viewerZoom:1,
  //write a function to init the keys
  controller:controller,
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
