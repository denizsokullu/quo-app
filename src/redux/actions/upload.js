import messageActions from './messageStack';

const UPLOAD_SKETCH_ACTION = (uploadData) => ({
  type: 'UPLOAD_SKETCH',
  payload: uploadData
});

const UPLOAD_SKETCH  = (uploadData) => (dispatch) => {
  dispatch(UPLOAD_SKETCH_ACTION(uploadData));
  dispatch(messageActions.ADD_MESSAGE({type:'status',duration:1500,text:'Sketch page uploaded'}));
}

const UPLOAD_IMAGE = uploadData => ({
  type: 'UPLOAD_IMAGE',
  payload: uploadData
});

export default {
  UPLOAD_SKETCH,
  UPLOAD_IMAGE
}
