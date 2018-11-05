import { SketchParser, PrimativeParser } from '../../../../parser';

const uploadSketch = (assets = {}, action) => {

  let newPage = new SketchParser.AbstractPage(action.payload.data);
  let filetype = action.payload.filetype
  // Shouldn't be mutating "assets"
  if(!assets[filetype]){
    assets[filetype] = {};
  }

  assets[filetype][newPage.id] = newPage;
  return { ...assets };
}

const uploadImage = (state = {}, action) => {
  let newImage = new PrimativeParser.AbstractImage(action.payload.data);
  let filetype = action.payload.filetype;
  if (!state[filetype]) {
    return {
      ...state,
      [filetype]: {}
    }
  }
  return {
    ...state,
    [filetype]: {
      ...[state[filetype]],
      [newImage.id]: newImage
    }
  }
}

export { uploadSketch, uploadImage };
