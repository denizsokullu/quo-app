import { getSelectionFirstID } from 'quo-redux/helpers';
import uuidv1 from 'uuid/v1';
import _ from 'lodash';

const createNewLink = (id) => {
  return { id };
}

const updateLinkProps = (links,action) => {
  return { ...links }
}

const updateLinkTrigger = (links,action) => {
  return { ...links }
}

export const setLinkSource = (links,action) => {
  const { domain, app } = action;

  let selectionID = getSelectionFirstID(undefined,action.app);

  if(!selectionID) return { ...links };

  let newLink = createNewLink(action.payload.linkId);
  newLink.source = selectionID;
  links[newLink.id] = newLink;

  //lazy way to return new object
  return _.cloneDeep(links);
}

export const setLinkTarget = (links,action) => {
  const { domain, app } = action;

  let selectionID = getSelectionFirstID(undefined,action.app);

  if(!selectionID || !action.payload || !action.payload.linkID ) return { ...links };

  let link = links[action.payload.linkID];
  link.target = selectionID;

  //lazy way to return new object
  return _.cloneDeep(links);
}
