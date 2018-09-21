import { SketchParser } from '../../../../parser';

const uploadSketch = (assets = {}, action) => {

  let newPage = new SketchParser.AbstractPage(action.payload.data);
  let filetype = action.payload.filetype

  if(!assets[filetype]){
    assets[filetype] = {};
  }

  assets[filetype][newPage.id] = newPage;
  return { ...assets };
}

const uploadImage = (state = {}, action) => {
  return state;
}

export { uploadSketch, uploadImage };
