import { firebase } from '../firebase';

export const NEW_TAB = (data) => ({
  type: 'NEW_TAB',
  payload: data
})

export const DELETE_TAB = () => ({
  type: 'DELETE_TAB'
})

export const UPDATE_SIDEBAR_TAB = (payload) => ({
  type:'UPDATE_SIDEBAR_TAB',
  payload:payload,
})

export const RESIZE_SIDEBAR = (payload) => ({
  type:'RESIZE_SIDEBAR',
  payload:payload,
})

export const UPLOAD_SKETCH = uploadData => ({
  type: 'UPLOAD_SKETCH',
  payload: uploadData
});

export const UPLOAD_IMAGE = uploadData => ({
  type: 'UPLOAD_IMAGE',
  payload: uploadData
});

export const VIEWER_RESIZE = zoomAmount => ({
  type: 'VIEWER_RESIZE',
  payload: zoomAmount
});

export const COMPONENT_MOVE = component => ({
  type: 'COMPONENT_MOVE',
  payload: component
});

export const TEXT_STRING_UPDATE = payload => ({
  type: 'TEXT_STRING_UPDATE',
  payload: payload
});

export const COMPONENT_RESIZE = component => ({
  type: 'COMPONENT_RESIZE',
  payload: component
});

export const KEY_DOWN = keyData => ({
  type:'KEY_DOWN',
  payload: keyData
})

export const COMPONENT_SELECT = (component) => ({
  type:'COMPONENT_SELECT',
  payload: component
})

// export const COMPONENT_SELECT = (component) => ({
//   type:'RETRIEVE_COMPONENT',
//   payload: component
// })

// export const COMPONENT_SELECT = (component,currentPage) => {
//   console.log(currentPage)
//   return (dispatch) => {
//       dispatch(COMPONENT_SELECT(component)).then(()=>{
//         if(component && currentPage) {
//
//         }
//       });
//   }
// }

export const COMPONENT_STYLE_CHANGE = (type,payload) => ({
  type:'COMPONENT_STYLE_CHANGE',
  payload: {type:type,payload:payload}
})

export const DATABASE_ACTION = (type,payload) => ({
  type:'DATABASE_ACTION',
  payload: {type:type,payload:payload}
})


export const TEXT_EDIT_TRIGGER = (payload) => ({
  type:'TEXT_EDIT_TRIGGER',
  payload:payload
})

export const RETRIEVE_COMPONENT = (projectId,pageId,componentId) => {
  return (dispatch) => {
      firebase.database.ref('/mainProject')
      // .child(projectId) // access the certain project
      .child(pageId) // access the page the component is on
      // .child('components') // access the object of components
      // .child(componentId) // access the specific component
      .once('value',(data)=>{
        //if the component is there
        let component = data.val();
        if( component === null ) dispatch(DATABASE_ACTION('RETRIEVE_COMPONENT_FINISH',{status:false}));
        else dispatch(DATABASE_ACTION('RETRIEVE_COMPONENT_FINISH',{status:true,payload:component}));
      })
      // .then(
      //   (data)=>{
      //     //if the component is there
      //     let component = data.val();
      //     if( component === null ) dispatch(DATABASE_ACTION('RETRIEVE_COMPONENT_FINISH',{status:false}));
      //     else dispatch(DATABASE_ACTION('RETRIEVE_COMPONENT_FINISH',{status:true,payload:component}));
      //   }
      // )
  }
}

export const RETRIEVE_MAIN_PROJECT = () => {
  return (dispatch) => {
    firebase.database.ref('/mainProject').once('value')
    .then((data)=>{
      //if the component is there
      let project = data.val();
      if( project === null ) dispatch(DATABASE_ACTION('RETRIEVE_MAIN_PROJECT_FINISH',{status:false}));
      else dispatch(DATABASE_ACTION('RETRIEVE_MAIN_PROJECT_FINISH',{status:true,project:project}));
    })
  }
}

// export const RETRIEVE_PROJECT = ( projectId ) => {
//   return (dispatch) => {
//       firebase.database.ref('/projects').child(projectId).once('value').then(
//         (data)=>{
//           if(data !== null){
//             dispatch(DATABASE_ACTION('CLEAR_VIEWER',{}));
//           }
//         }
//       )
//   }
// }

// export const RETRIEVE_PROJECT_FINISH= (status,payload) => (
//   if(status === 'success'){
//     return {
//       type:'DATABASE_ACTION',
//       payload: {type:'',payload}
//     }
//   }
// )

export const KEY_UP = keyData => ({
  type:'KEY_UP',
  payload: keyData
})

export const EDIT_STATE_CHANGE = newEditState => ({
  type:'EDIT_STATE_CHANGE',
  payload:newEditState
})
