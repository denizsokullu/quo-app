
export const setCurrentLinkId = (linkBuilder,action) => {
  return { ...linkBuilder, currentLinkId:action.payload }
}

export const updateLinkBuilderMode = (linkBuilder,action) => {
  if(action.payload === 'INIT'){
    linkBuilder = setCurrentLinkId('');
  }
  return { ...linkBuilder, mode:action.payload };
}
