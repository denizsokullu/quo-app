import uuidv1 from 'uuid/v1';

export default class ComponentState {
  constructor(title,ins,outs,props){
    this.title = title;
    this.id = uuidv1();
    this.props = props;
    this.ins = ins;
    this.outs = outs;
  }
}
