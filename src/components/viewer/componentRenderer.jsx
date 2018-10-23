import _ from 'lodash';
import React from 'react';
import { compose } from 'redux';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import actions from 'quo-redux/actions';

import uuidv1 from 'uuid/v1';

import { translatePropData } from '../../parser/propTranslator';

import { getState } from 'quo-redux/state';

import SelectionFrame from '../selectionFrame';

import TextArea from '../inputElements/dynamicTextArea';

import CoreComponent from './components/CoreComponent';
import ImageComponent from './components/ImageComponent';
import ShapeComponent from './components/ShapeComponent';
import TextComponent from './components/TextComponent';

class ComponentRendererCore extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      controller: props.controller,
      clicked:false,
      id:props.id,
      draggable:true,
      drag:{
        start:{
          x:0,
          y:0
        },
        offset:{
          x:0,
          y:0
        }
      }
    };

    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)


    this.getStyle();

  }

  // TODO: Update this to check if component.interactions.clicked == true
  isSelected(id){
    return false;
    // if(id){
    //   return this.state.selection === id;
    // }
    // return this.state.selection === this.state.id;
  }

  getPosition(){
    let frame = this.getStyle();
    return {
      x: parseInt(frame.left.slice(0,-2)),
      y: parseInt(frame.top.slice(0,-2))
    }
  }

  getDimensions(){
    let frame = this.getStyle();
    return {
      height: parseInt(frame.height.slice(0,-2)),
      width: parseInt(frame.width.slice(0,-2))
    }
  }

  getStyle() {

    if(this.props.isParent) return;
    console.log(this.props)
    let props = this.props.component.state.states[this.props.component.state.current].props
    let style = translatePropData('abstract','css',props)

    return style
  }

  generateKey(){
    return uuidv1();
  }

  onFocus(){
    let oldState = this.state.clicked
    this.setState({clicked:!oldState});
  }

  onClick(e){
    if(!this.props.isParent){
      // if(this.state.components._class === 'group'){
      //   e.stopPropagation();
      //   console.log('clicked on a grouped component')
      //   return
      // }
      e.stopPropagation();
      this.selectComponent();

    }

    //only group components selectable,
    //if double clicked, it takes

  }

  selectComponent(){
    const { dispatch } = this.props;
    dispatch(actions.COMPONENT_SELECT(this.props.component.id));
  }

  onMouseDownHandler(e){

    if(e.button !== 0) return

    const ref = ReactDOM.findDOMNode(this.refs.handle);
    const body = document.body;
    const box = ref.getBoundingClientRect();

    this.setState({
      drag:{
        start:{
          x:e.pageX,
          y:e.pageY
        },
        offset:this.state.drag.offset
      }
    });

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    e.preventDefault();
    e.stopPropagation();

  }

  onMouseUp(e){

    if(this.state.drag.offset.x !== 0 || this.state.drag.offset.y !== 0){
      const { dispatch } = this.props;
      dispatch(actions.COMPONENT_MOVE({...this.state.drag.offset,id:this.state.id}));
    }

    this.setState({
      drag:{
        ...this.state.drag,
        offset:{
          x:0,
          y:0
        }
      }
    })

    document.removeEventListener('mousemove',this.onMouseMove);
    document.removeEventListener('mouseup',this.onMouseUp);
    e.preventDefault();

  }

  onMouseMove(e) {

    const ref = ReactDOM.findDOMNode(this.refs.handle);
    const body = document.body;
    const box = ref.getBoundingClientRect();

    const style = this.getStyle();

    //including the scale of the viewer zoom

    const scale = box.width / parseInt(style.width.slice(0,-2));


    this.setState({
      drag:{
        offset:{
          x:(this.state.drag.offset.x + (e.pageX - this.state.drag.start.x)* 1/scale),
          y:(this.state.drag.offset.y + (e.pageY - this.state.drag.start.y)* 1/scale )
        },
        start:{
          x:e.pageX,
          y:e.pageY
        },
      }
    })

    e.preventDefault();
  }

  calcDragOffset(style){

    let left = (parseInt(style.left.slice(0,-2)) + this.state.drag.offset.x) + 'px';
    let top = (parseInt(style.top.slice(0,-2)) + this.state.drag.offset.y) + 'px';
    return {left:left,top:top}

  }

  isNestedComponent(){
    return (this.state.components._class === 'artboard' || this.state.components._class === 'group')
  }

  isSiblingSelected(){
    return _.filter(this.siblings,this.isSelected).length > 0;
  }

  renderWrapper(content){
    let style =  this.getStyle();
    //Add in drag offset
    if(!this.props.isParent){
      style = {...style, ...this.calcDragOffset(style)}

    }

    else if(this.props.isParent){
      style = {...this.props.style}
    }

    let selectedClass = this.isSelected() ? 'selected' : '';

    //selected component just works normally

    if(this.isSelected()){
      return (
        <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.props.component.class} ${selectedClass}`} id={this.state.id}
          style={style}
          onClick={this.onClick}
          ref='handle'
          onMouseDown={this.onMouseDownHandler.bind(this)}
        >
          { content }
      </div>)
    }

    //artboard can be selected with 1 click always

      // else if(this.state.component.class === 'artboard'){
      //   return (
      //     <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
      //       style={style}
      //       onClick={this.onClick}
      //       ref='handle'
      //       onMouseDown={this.onMouseDownHandler.bind(this)}
      //     >
      //       { content }
      //   </div>)
      // }

    //group

    //if the outermost group, can be selected with 1 click
    //if inner, can be selected with 2 clicks

    // else if(this.state.components._class === 'group' && this.props.selectable){
    //   if(this.props.selectionType === 1){
    //     return (
    //       <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
    //         style={style}
    //         onClick={this.onClick}
    //       >
    //         { content }
    //     </div>)
    //   }
    //   else if(this.props.selectionType === 2){
    //     return (
    //       <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
    //         style={style}
    //         onDoubleClick={this.onClick}
    //       >
    //         { content }
    //     </div>)
    //   }
    //
    // }

    //any other component that is currently selectable

    // else if(this.props.selectable){
    //   if(this.props.selectionType === 1){
    //     return (
    //       <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
    //         style={style}
    //         onClick={this.onClick}
    //       >
    //         { content }
    //     </div>)
    //   }
    //   else if(this.props.selectionType === 2){
    //     //solved sibling selection
    //     // console.log(this.isSiblingSelected(),this.state.selection,this.state.components.siblings);
    //     return (
    //       <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
    //         style={style}
    //         onDoubleClick={this.onClick}
    //         onClick={(e)=>{e.stopPropagation()}}
    //       >
    //         { content }
    //     </div>)
    //   }
    // }

    //component isnt selectable
    else{
      return (
        <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.props.component.class} ${selectedClass}`}
          id={this.state.id}
          style={style}
          onClick={this.onClick}
        >
          { content }
      </div>)
    }

  }

  changeDrag(b){
    this.setState({draggable:b});
  }

  render(){

    switch(this.props.component.class){
      case 'shapeGroup':
        return this.renderWrapper(<ShapeComponent component={ this.props.component }></ShapeComponent>);
        break;
      case 'text':
        return this.renderWrapper(<TextComponent component={this.props.component}></TextComponent>);
        break;
      default:

    }

    let parentContent = this.props.component.children.map(id => {
      return (
        <ComponentRenderer
          id={id}
          key={id}
        />
      )
    });

    let nonParentContent;

    nonParentContent = this.props.component.children.map(id => {
      return (
        <ComponentRenderer
          id={id}
          key={id}
        />
      )
    })

    return ( this.props.isParent ? this.renderWrapper(parentContent) : this.renderWrapper(nonParentContent))

  }
}

const mapStateToProps = (state,ownProps) => {

  let domain = getState(state,'domain');
  //tab root is the parent component
  let tabRoot = domain.tabs.allTabs[domain.tabs.activeTab]
  //return the tabRoot
  if(ownProps.isParent){
    return {
      component:tabRoot,
    }
  }

  //return the component
  else{
    let component = tabRoot.components[ownProps.id];
    return {
      component:component,
    }
  }

}



const makeEditComponent = (WrapperComponent) => {
  // add selection & dragging here
  return class EditComponent extends React.Component {

  }
}

const makePreviewComponent = (WrappedComponent, options) => {
  // add event listeners here
  return class PreviewComponent extends React.Component {
    stopPropagation = f => e => {
      e.stopPropagation();
      return f(e)
    }
    findStates(trigger, type){
      let states = _.omit(this.props.component.state.states, 'composite');
      return _.values(_.pickBy(states, state => state[type].includes(trigger)));
    }
    addLinkStates(event){
      const { dispatch } = this.props;
      let links = this.props.component.links.triggers[event];
      if(!links) return;
      links.forEach( id => {
        let linkId = this.props.component.links.targetStateIds[id];
        dispatch(actions.ADD_STATE_TO_COMPOSITE({id:id, state:{ id:linkId }}))
      })
    }
    removeLinkStates(event){
      const { dispatch } = this.props;
      let links = this.props.component.links.disables[event];
      if(!links) return;
      links.forEach( id => {
        let linkId = this.props.component.links.targetStateIds[id];
        dispatch(actions.REMOVE_STATE_FROM_COMPOSITE({id:id, state:{ id:linkId }}))
      })
    }
    addStates(id,states){
      const { dispatch } = this.props;
      states.forEach(s => {
        dispatch(actions.ADD_STATE_TO_COMPOSITE({id:id, state:s}))
      })
    }
    removeStates(id,states){
      const { dispatch } = this.props;
      states.forEach(s => {
        dispatch(actions.REMOVE_STATE_FROM_COMPOSITE({id:id, state:s}))
      })
    }
    handleStates(event){
      this.addStates(this.props.component.id, this.findStates(event,'ins'));
      this.removeStates(this.props.component.id, this.findStates(event,'outs'));
      this.addLinkStates(event);
      this.removeLinkStates(event);
    }
    onMouseDown(e){
      console.log('down');
      this.handleStates('onMouseDown');
      //apply onMouseDown states
      //fire actions to trigger any state changes in other components
    }
    onMouseUp(e){
      console.log('up')
      this.handleStates('onMouseUp');
    }
    onMouseEnter(e){
      console.log('enter')
      this.handleStates('onMouseEnter');
    }
    onMouseLeave(e){
      console.log('leave')
      this.handleStates('onMouseLeave');
    }
    onBlur(e){
      console.log('blurred')
      this.handleStates('onBlur');
    }
    onFocus(e){
      console.log('focused')
      this.handleStates('onFocus');
    }
    render(){
      if(this.props.component.components){
        return (
          <WrappedComponent {...this.props}/>
        )
      }
      let events = _.mapValues({
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
      }, f => this.stopPropagation(f.bind(this)));
      return (
        <div {...events} tabIndex={0}>
          <WrappedComponent {...this.props}/>
        </div>
      )
    }
  }
}

const ComponentRenderer = connect(mapStateToProps)(makePreviewComponent(connect(mapStateToProps)(ComponentRendererCore)));

// let test = makePreviewComponent(ComponentRendererExport);
// console.log(<ComponentRendererExport/>);

export default ComponentRenderer


// export default composedMakePreviewComponent(ComponentRenderer);
