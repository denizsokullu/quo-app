import { dc } from '../helpers';
import { sketchParser,
         sketchParserNew,
         Page,
         Artboard,
         Group,
         Component } from '../../parser';

function addPage(state,page){

    let newPage = new Page(page);
    let newAssets = dc(state.newAssets);
    newAssets[newPage.id] = newPage;
    return newAssets;

}

export function UPLOAD_SKETCH(state = {}, action){

    let newNewAssets = addPage(state,action.payload);

    let newData = {...state.assets.data}
    let newComponent = sketchParser(action.payload)
    newData[newComponent.id] = newComponent
    let newAssets = {data:newData};

    //if the currentPage isn't set, set it to this page.
    let pages = Object.keys(newNewAssets);
    let newCurrentPage = state.currentPage;
    if(state.currentPage === '' && pages.length ){

      newCurrentPage = newNewAssets[pages[0]].id;

    }

    return {...state,
            assets:newAssets,
            newAssets:newNewAssets,
            currentPage:newCurrentPage
           }
}
