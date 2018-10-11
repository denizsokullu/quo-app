// export const DATABASE_ACTION = (type,payload) => ({
//   type:'DATABASE_ACTION',
//   payload: {type:type,payload:payload}
// })
//
// export const RETRIEVE_COMPONENT = (projectId,pageId,componentId) => {
//   return (dispatch) => {
//       firebase.database.ref('/mainProject')
//       // .child(projectId) // access the certain project
//       .child(pageId) // access the page the component is on
//       // .child('components') // access the object of components
//       // .child(componentId) // access the specific component
//       .once('value',(data)=>{
//         //if the component is there
//         let component = data.val();
//         if( component === null ) dispatch(DATABASE_ACTION('RETRIEVE_COMPONENT_FINISH',{status:false}));
//         else dispatch(DATABASE_ACTION('RETRIEVE_COMPONENT_FINISH',{status:true,payload:component}));
//       })
//       // .then(
//       //   (data)=>{
//       //     //if the component is there
//       //     let component = data.val();
//       //     if( component === null ) dispatch(DATABASE_ACTION('RETRIEVE_COMPONENT_FINISH',{status:false}));
//       //     else dispatch(DATABASE_ACTION('RETRIEVE_COMPONENT_FINISH',{status:true,payload:component}));
//       //   }
//       // )
//   }
// }
//
// export const RETRIEVE_MAIN_PROJECT = () => {
//   return (dispatch) => {
//     firebase.database.ref('/mainProject').once('value')
//     .then((data)=>{
//       //if the component is there
//       let project = data.val();
//       if( project === null ) dispatch(DATABASE_ACTION('RETRIEVE_MAIN_PROJECT_FINISH',{status:false}));
//       else dispatch(DATABASE_ACTION('RETRIEVE_MAIN_PROJECT_FINISH',{status:true,project:project}));
//     })
//   }
// }
//
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
//
// export const RETRIEVE_PROJECT_FINISH= (status,payload) => (
//   if(status === 'success'){
//     return {
//       type:'DATABASE_ACTION',
//       payload: {type:'',payload}
//     }
//   }
// )
