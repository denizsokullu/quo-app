import uuidv1 from 'uuid/v1';

export default class ComponentState {
  constructor(title, ins = [], outs = [], props = {}, order = 0, id){
    this.title = title;
    this.id = id || uuidv1();
    this.props = props;
    this.ins = ins;
    this.outs = outs;
    this.order = order;
  }
}
