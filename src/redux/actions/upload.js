import { ADD_MESSAGE } from './messageStack';

export const UPLOAD_SKETCH_ACTION = (uploadData) => ({
  type: 'UPLOAD_SKETCH',
  payload: uploadData
});

const UPLOAD_SKETCH  = (uploadData) => (dispatch) => {
  dispatch(UPLOAD_SKETCH_ACTION(uploadData));
  dispatch(ADD_MESSAGE({type:'status',duration:1500,text:'Sketch page uploaded'}));
}

export const UPLOAD_IMAGE = uploadData => ({
  type: 'UPLOAD_IMAGE',
  payload: uploadData
});
