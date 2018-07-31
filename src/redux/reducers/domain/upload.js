import { Page } from '../../../parser';

const uploadSketch = (assets = {}, action) => {
  let newPage = new Page(action.payload);
  assets[newPage.id] = newPage;
  return assets;
}

const uploadImage = (state = {}, action) => {
  return state;
}

export { uploadSketch, uploadImage };
