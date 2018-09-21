export const updateSelection = (selection,action) => {

  //default action is unselecting
  let newArray = [];
  //single selection
  if(typeof action.payload === 'string' && action.payload !== ''){
    newArray.push(action.payload);
  }
  //multiple selection
  else if(typeof action.payload === 'object'){
    newArray = action.payload
  }

  // let newSelectionArray = selection.data.slice().push(action.payload);
  return { ...selection, data:newArray}
}
