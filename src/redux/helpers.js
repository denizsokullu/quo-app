const dc = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const combineReducersLoop = (actions) => {
  return (state = {}, action) => {

    //return if no action types are passed in
    if( !actions ) return state;

    //loop through the action handlers
    //and find the one we need
    for(let type in actions){
      if(type === action.type){
        if(typeof actions[type] !== 'function'){
          throw new Error(`Action handler for ${type} is not a function.`);
        }
        return actions[type](state,action);
      }
    }

    //if the action doesn't match existing handlers, return
    //initial state.
    return state;

  }
}

export { dc, combineReducersLoop }
