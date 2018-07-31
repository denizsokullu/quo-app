import { dc } from '../helpers';
import { sketchParser,
         Page,
        } from '../../parser';


import { firebase } from '../../firebase';

function addPage(state,page){

    let newPage = new Page(page);
    let newAssets = dc(state.newAssets);
    newAssets[newPage.id] = newPage;
    return newAssets;

}

export function UPLOAD_IMAGE(state = {}, action){
  let images;
  if(images){
     images = dc(state.newAssets.images);
  }
  else{
    images = {};
  }
  images[action.payload.filename] = action.payload.imageData
  state.newAssets.images = images;
  return { ...state }
}

export function UPLOAD_SKETCH(state = {}, action){

    let assets = addPage(state,action.payload);
    //if the currentPage isn't set, set it to this page.
    let pages = Object.keys(assets);
    let currentPage = state.currentPage;

    if(state.currentPage === '' && pages.length ){

      currentPage = assets[pages[0]].id;

    }

    return {...state,
            newAssets:assets,
            currentPage:currentPage
           }
}
