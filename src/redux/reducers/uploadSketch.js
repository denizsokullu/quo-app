import { dc } from '../helpers';
import { sketchParser,
         // sketchParserNew,
         Page,
         // Artboard,
         // Group,
         // Component
        } from '../../parser';


import { firebase } from '../../firebase';

function addPage(state,page){

    let newPage = new Page(page);
    let newAssets = dc(state.newAssets);
    newAssets[newPage.id] = newPage;
    return newAssets;

}

export function UPLOAD_SKETCH(state = {}, action){

    console.log(action.payload)
    let assets = addPage(state,action.payload);
    //if the currentPage isn't set, set it to this page.
    let pages = Object.keys(assets);
    let currentPage = state.currentPage;

    console.log(assets);

    if(state.currentPage === '' && pages.length ){

      currentPage = assets[pages[0]].id;

    }

    return {...state,
            newAssets:assets,
            currentPage:currentPage
           }
}
