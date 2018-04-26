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
  newSelection:'',
  currentPage:"",
  //write a function to init the keys
  controller:controller,
  selection:{

  },
  editState:'none'
}

const store_initial = {
  past: [],
  present: data, // (?) How do we initialize the present?
  future: [],
}

export { store_initial }
