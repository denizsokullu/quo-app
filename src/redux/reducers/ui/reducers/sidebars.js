const pickSidebar = (sidebars,action) => {
  return { ...sidebars[action.payload.target] }
}

const mergeSidebar = (sidebars,action,updatedSidebar) => {
  sidebars[action.payload.target] = updatedSidebar;
  return { ...sidebars };
}

export const updateTab = (sidebars,action) => {

  let updatedSidebar = pickSidebar(sidebars,action);

  updatedSidebar.selected = action.payload.selected;

  return mergeSidebar(sidebars,action,updatedSidebar)

}

export const resizeSidebar = (sidebars,action) => {

  let updatedSidebar = pickSidebar(sidebars,action);

  updatedSidebar.width = action.payload.width;

  return mergeSidebar(sidebars,action,updatedSidebar)

}
