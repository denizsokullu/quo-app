export const updateLinkBuilderData = (linkBuilder,action) => {
  console.log({ ...linkBuilder, ...action.payload })
  return { ...linkBuilder, ...action.payload };
}
