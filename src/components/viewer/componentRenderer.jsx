import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { COMPONENT_MOVE,COMPONENT_SELECT, TEXT_EDIT_TRIGGER, TEXT_STRING_UPDATE } from '../../redux/actions';

import uuidv1 from 'uuid/v1';

import { translatePropData } from '../../parser/propTranslator';

import { findComponentTree } from '../../parser/helpers';

import { getState } from '../../redux/state';

import SelectionFrame from '../selectionFrame';

import TextArea from '../inputElements/dynamicTextArea';

//every core-component needs to be aware of the data passed in as props
//every core-component has their own syling methods.
//every core-component has no interaction with the store,
//                     instead data gets passed down from the renderer.
// Types of objects svg, rect, text, group(componentRenderer).
//
// svg, rect, text all receive new props from componentRenderers -> mainly data

class ComponentRendererCore extends React.Component {
  constructor(props) {
    super(props);

    // let data = props.summary;

    // this.id = data.id;

    this.state = {
      // data: data,
      controller: props.controller,
      clicked:false,

      // selection:props.selection,
      // id: data.id,
      // editState:props.editState,

      //new properties
      // layers:data,
      // components:props.components,
      id:props.id,
      // type:this.decideType(props.components),
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
    // this.onClick = this.onClick.bind(this);
    // this.onDoubleClick = this.onDoubleClick.bind(this);

  }

  decideType(data){
    return (
      data.path ? 'svg' :
      data._class === 'text' ? 'text' :
      data._class === 'image' ? 'image' :
      data._class === 'page' || (data.shapeType && data.layers) || data._class === 'group' ?
      this.props.isParent ? 'parent' :
      data._class === 'group' ? 'group' :
      'rect' : 'rect'
    )
  }

  // componentWillReceiveProps(nextProps) {
  //   if(this.state.type === 'image'){
  //     console.log(nextProps.imageData);
  //   }
  //   this.setState({
  //     id:nextProps.summary.id,
  //     components:nextProps.components,
  //     layers:nextProps.summary,
  //     selection:nextProps.selection,
  //     editState:nextProps.editState,
  //     currentPage:nextProps.currentPage,
  //     imageData:nextProps.imageData
  //   })
  // }

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

    if(this.props.isParent)return;



    // if(this.isSelected()){
    //   return this.state.components.editStates[this.state.editState].style;
    // }
    //
    // else{
    //   return this.state.components.editStates['none'].style;
    // }
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
      const { dispatch } = this.props;
      dispatch(COMPONENT_SELECT(this.state.id));

    }

    //only group components selectable,
    //if double clicked, it takes

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
      dispatch(COMPONENT_MOVE({...this.state.drag.offset,id:this.state.id}));
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

    let style = this.getStyle();

    //Add in drag offset

    if(!this.props.isParent){

      style = {...style,...this.calcDragOffset(style)}

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
        <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.props.component.class} ${selectedClass}`} id={this.state.id}
          style={style}
        >
          { content }
      </div>)
    }

  }

  changeDrag(b){
    this.setState({draggable:b});
  }

  render(){

    // let innerDOM = this.renderInnerDOM;
    let parentContent = this.props.component.children.map(id => {
      return (
        <ComponentRenderer
          id={id}
          key={id}
        />
      )
    });

    let nonParentContent;

    switch(this.props.component.class){
      case 'shapeGroup':
        return this.renderWrapper(<ShapeComponent component={this.props.component}></ShapeComponent>);
      default:

    }

    nonParentContent = this.props.component.children.map(id => {
      return (
        <ComponentRenderer
          id={id}
          key={id}
        />
      )
    })

    // }

    return ( this.props.isParent ? this.renderWrapper(parentContent) : this.renderWrapper(nonParentContent))

  }
}

class CoreComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: props.data
    };
    //add other stuff here
  }
  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data});
  }
}

class ImageComponent extends React.Component{
  render(){
    const imgData = `data:image/png;base64,${this.props.data}`;
    return(
      <img src={imgData}></img>
    )
  }
}

class ShapeComponent extends CoreComponent{

  constructor(props){
    super(props);
    this.code = [];
  }
  getTheLastPathAdded(){
    return this.code[this.code.length - 1];
  }
  createNewPath(){
    this.code.push('');
  }
  addToPath(str){
    this.code[this.code.length-1] += str;
  }
  isLine(edge){
    return !edge.p1.hasCurveFrom && !edge.p2.hasCurveTo
  }
  isCurve(edge){
    return edge.p1.hasCurveFrom || edge.p2.hasCurveTo
  }
  isSmoothCurve(edge){
    return edge.p2.curveMode === 2
  }
  getControlPoints(edge,frame){
    return [edge.p1.curveFrom,edge.p2.curveTo];
  }

  convertPoint(point,frame){
    let newPoint = {...point}
    newPoint.point = this.extractPoints(point.point,frame)
    newPoint.curveFrom = this.extractPoints(point.curveFrom,frame)
    newPoint.curveTo = this.extractPoints(point.curveTo,frame)
    return newPoint
  }

  createPointTuples(points,frame,isClosed){
    let pointTuples = [];
    points.map((point,index)=>{
      //Edge case for non closed shapes
      if(index === points.length - 1 && !isClosed){
        return;
      }

      let edge = {}
      edge.p1 = this.convertPoint(point,frame)

      //last point wraps around
      if(index === points.length - 1){
        edge.p2 = this.convertPoint(points[0],frame);
      }

      else{
        edge.p2 = this.convertPoint(points[index+1],frame)
      }

      pointTuples.push(edge);

    })
    return pointTuples;
  }
  createPathCode(data){
    let frame = data.frame
    let pointTuples = this.createPointTuples(data.points,data.frame,data.isClosed)
    let edges = [];

    pointTuples.map((edge,i) => {

      //create a starting point
      if(i == 0){
        //add M
        this.addToPath(this.createM(edge.p1.point));
      }

      //add a curve
      if(this.isCurve(edge)){
        let controlPoints = this.getControlPoints(edge);
        let endPoint = edge.p2.point
        this.addToPath(this.createC(controlPoints[0],controlPoints[1],endPoint));
        //if the second point is a mirrored bezier curve
        //add an s-curve
        if(this.isSmoothCurve(edge)){
          this.addToPath(this.createS(controlPoints[1],endPoint));
        }
      }

      //add a line
      else if(this.isLine(edge)){
        this.addToPath(this.createL(edge.p2.point));
      }

      //add a Z to close off
      if(i === pointTuples.length - 1){
        this.addToPath(this.createZ());
      }

    });

  }

  extractPoints(point,frame){
    return point.replace(/[{}]/g, '').replace(/\s/g, '').split(',').map(parseFloat).map((p,i)=>{
      if(i === 0) return parseFloat(parseFloat((p * frame.width) + frame.x).toFixed(4));
      if(i === 1) return parseFloat(parseFloat((p * frame.height) + frame.y).toFixed(4));
    });
  }

  p2s(points){
    return `${points[0]} ${points[1]}`;
  }
  createM(points){
    return `M ${this.p2s(points)} `
  }
  createL(points){
    return `L ${this.p2s(points)} `
  }
  createC(curveFrom,curveTo,points){
    return `C ${this.p2s(curveFrom)} ${this.p2s(curveTo)} ${this.p2s(points)} `
  }
  createS(curveFrom,endPoint){
    return `S ${this.p2s(curveFrom)} ${this.p2s(endPoint)} `
  }
  createZ(){
    return 'Z '
  }
  calculatePath(shape,index){
    this.createNewPath();
    this.createPathCode(shape);
    return this.getTheLastPathAdded();
  }

  getStylePropsFromParent(){

    let style = this.getCurStyle(this.props.components);
    return { fill:style.fill,border:style.border }
  }

  getCurStyle(obj){
    return obj.editStates[obj.editStates.current].style
  }
  render(){
    const paths = this.props.component.layers.map((shape,index)=>{
      const pathData = this.calculatePath(shape)
      return  <path d={pathData} key={index}/>
    });
    return(
      <svg style={{position:'absolute'}}>
        { paths }
      </svg>
    )
  }
}

class TextComponent extends CoreComponent{
  constructor(props){
    super(props);
    // let that = this;
    this.state.editMode = false;
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.newText = this.getText();
  }

  getColor(){
    let c = this.state.textData.color;
    return (
      `rgba(${c.r},${c.g},${c.b},${c.a})`
    )
  }

  getFontFamily(){
    return (
      `"${this.state.textData.fontName}", sans-serif`
    )
  }

  handleDoubleClick(){
    // const { dispatch } = this.props;
    // dispatch(TEXT_EDIT_TRIGGER(this.state.id));
    // dispatch(COMPONENT_TEXT_EDIT_MODE(''))
    this.setState({editMode:true});
    this.props.changeDrag(false);
    // console.log(this.state);
  }

  deselect(){
    this.setState({editMode:false},()=>{
      this.dispatchTextStringUpdate(this.newText)
      this.props.changeDrag(true);
    })
  }

  dispatchTextStringUpdate(string){
    const { dispatch } = this.props;
    dispatch(TEXT_STRING_UPDATE({textString:string,id:this.state.data.id}));
  }

  getText(){
    let editStates = this.state.data.editStates;
    return editStates[this.props.editState].textString
  }

  textUpdate(str){
    this.newText = str
  }

  selectThis(){
    const { dispatch } = this.props;
    dispatch(COMPONENT_SELECT(this.state.data.id));
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selection !== this.state.data.id && this.state.editMode){
      this.setState({editMode:false},()=>{
        this.dispatchTextStringUpdate(this.newText)
        this.props.changeDrag(true);
        this.selectThis();
      })
    }
    if(!this.state.editMode) this.setState({data:nextProps.data});

  }

  //things that change(width,height,string)

  renderTextElement(){
    if(this.state.editMode && this.props.selection === this.state.data.id){
      let editStates = this.state.data.editStates;
      let style = editStates[this.props.editState].style
      let string = editStates[this.props.editState].textString
      let w = style.width;
      let h = style.height;
      return (
        <span className='text-outer edit-mode'>
          <TextArea className='text-inner'
            width={w}
            height={h}
            value={string}
            deselect={this.deselect.bind(this)}
            textUpdate={this.textUpdate.bind(this)}
            style={{
                fontFamily:style.fontFamily,
                fontSize:style.fontSize,
              }
            }
          />
        </span>
      )
    }
    else{
      return(
        <span className='text-outer'
          onDoubleClick={this.handleDoubleClick}
        >
          <p className='text-inner'>
            {this.getText()}
          </p>
        </span>
      )
    }
  }


  render(){
    return ( this.renderTextElement() )
  }
}

function mapStateToProps(state,ownProps) {

  let domain = getState(state,'domain');
  let tabRoot = domain.tabs.allTabs[domain.tabs.activeTab]

  //return the tabRoot
  if(ownProps.isParent){
    return {
      component:tabRoot,
    }
  }

  //return the component
  else if(ownProps.id){
    let component = tabRoot.components[ownProps.id];
    return {
      component:component,
    }
  }

  // let components = state.present.newAssets[state.present.currentPage].components
  //
  // if(!ownProps.isParent){
  //   components = components[ownProps.summary.id];
  // }
  //
  // let props = {};
  //
  // if(state.present.newAssets.images){
  //   if(components._class === 'image'){
  //     let url = components.imageURL;
  //     props.imageData = state.present.newAssets.images[url];
  //   }
  // }
  //
  // return {
  //           ...props,
  //           controller:state.present.controller,
  //           components:components,
  //           selection:state.present.newSelection,
  //           editState:state.present.editState,
  //           currentPage:state.present.currentPage,
  //        }
}

function mapStateToPropsForTextComponent(state){
  return {
    selection:state.present.newSelection,
    editState:state.present.editState,
  }
}

TextComponent = connect(mapStateToPropsForTextComponent)(TextComponent);
const ComponentRenderer = connect(mapStateToProps)(ComponentRendererCore);

export default ComponentRenderer
