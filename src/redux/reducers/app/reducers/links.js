export const updateLinkBuilderData = (linkBuilder,action) => {
  return { ...linkBuilder, ...action.payload };
}
