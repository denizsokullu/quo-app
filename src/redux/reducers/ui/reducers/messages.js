import uuidv1 from 'uuid/v1';

function removeMessageFromStack(messages, message) {
  return messages.filter( (item, index) => message.id !== item.id);
}

function addMessageToStack(messages, message) {
  let newMessages = messages.slice();
  newMessages.push(message);
  return newMessages;
}

function createMessage(text,type,duration){
  return {
    id:uuidv1(),
    type:type,
    text:text,
    duration:duration,
  }
}

export const addMessage = (messages,action) => {
  return addMessageToStack(messages,createMessage(action.payload.text,action.payload.type,action.payload.duration));
}

export const removeMessage = (messages,action) => {
  return removeMessageFromStack(messages,action.payload.id);
}
