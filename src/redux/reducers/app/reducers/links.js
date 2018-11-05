export const updateLinkBuilderData = (linkBuilder,action) => {
  if(action.payload.mode && action.payload.mode === 'INIT'){
    linkBuilder.source = '';
    linkBuilder.target = '';
    linkBuilder.linkId = '';
    linkBuilder.enables = [];
    linkBuilder.disables = [];
  }
  return { ...linkBuilder, ...action.payload };
}
