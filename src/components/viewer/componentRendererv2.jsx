import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
// import Draggable from '../draggable/react-draggable';
import { COMPONENT_MOVE,COMPONENT_SELECT, TEXT_EDIT_TRIGGER, TEXT_STRING_UPDATE } from '../../redux/actions';

import uuidv1 from 'uuid/v1';

import { findComponentTree } from '../../parser/helpers';

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

    let data = props.summary;

    this.id = data.id;

    this.state = {
      // data: data,
      controller: props.controller,
      clicked:false,

      selection:props.selection,
      // id: data.id,
      editState:props.editState,

      //new properties
      layers:data,
      components:props.components,
      id:data.id,
      type:this.decideType(props.components),
      testid:data.id,
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

  componentWillReceiveProps(nextProps) {
    if(this.state.type === 'image'){
      console.log(nextProps.imageData);
    }
    this.setState({
      id:nextProps.summary.id,
      components:nextProps.components,
      layers:nextProps.summary,
      selection:nextProps.selection,
      editState:nextProps.editState,
      currentPage:nextProps.currentPage,
      imageData:nextProps.imageData
    })
  }

  // TODO: Update this to check if component.interactions.clicked == true
  isSelected(id){
    if(id){
      return this.state.selection === id;
    }
    return this.state.selection === this.state.id;
  }

  getPosition(){
    let frame = this.getStyle();
    return {
      x: parseInt(frame.left.slice(0,-2),10),
      y: parseInt(frame.top.slice(0,-2),10)
    }
  }

  getDimensions(){
    let frame = this.getStyle();
    return {
      height: parseInt(frame.height.slice(0,-2),10),
      width: parseInt(frame.width.slice(0,-2),10)
    }
  }

  getStyle() {

    if(this.props.isParent){
      return;
    }

    if(this.isSelected()){
      return this.state.components.editStates[this.state.editState].style;
    }

    else{
      return this.state.components.editStates['none'].style;
    }
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
      console.log(this.state.components.id)
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

    let selectedClass = this.isSelected() ? 'selected' : '';

    //selected component just works normally

    if(this.isSelected()){
      return (
        <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
          style={style}
          onClick={this.onClick}
          ref='handle'
          onMouseDown={this.onMouseDownHandler.bind(this)}
        >
          { content }
      </div>)
    }

    //artboard can be selected with 1 click always

    else if(this.state.components._class === 'artboard'){
      return (
        <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
          style={style}
          onClick={this.onClick}
          ref='handle'
          onMouseDown={this.onMouseDownHandler.bind(this)}
        >
          { content }
      </div>)
    }

    //group

    //if the outermost group, can be selected with 1 click
    //if inner, can be selected with 2 clicks

    else if(this.state.components._class === 'group' && this.props.selectable){
      if(this.props.selectionType === 1){
        return (
          <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
            style={style}
            onClick={this.onClick}
          >
            { content }
        </div>)
      }
      else if(this.props.selectionType === 2){
        return (
          <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
            style={style}
            onDoubleClick={this.onClick}
          >
            { content }
        </div>)
      }

    }

    //any other component that is currently selectable

    else if(this.props.selectable){
      if(this.props.selectionType === 1){
        return (
          <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
            style={style}
            onClick={this.onClick}
          >
            { content }
        </div>)
      }
      else if(this.props.selectionType === 2){
        //solved sibling selection
        // console.log(this.isSiblingSelected(),this.state.selection,this.state.components.siblings);
        return (
          <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} hover-active component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
            style={style}
            onDoubleClick={this.onClick}
            onClick={(e)=>{e.stopPropagation()}}
          >
            { content }
        </div>)
      }
    }

    //component isnt selectable
    else{
      return (
        <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
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

    let parentContent = _.keys(this.state.layers).map(key => {
      return (
        <ComponentRenderer
          isParent={false}
          summary={this.state.layers[key]}
          componentId={key}
          key={key}
        />
      )
    });

    let nonParentContent;

    if(this.state.components._class === 'artboard'){

      nonParentContent = _.keys(this.state.layers.components).map(key => {
        return (
          <ComponentRenderer
            isParent={false}
            selectable={true}
            selectionType={1}
            summary={this.state.layers.components[key]}
            componentId={key}
            key={key}
          />
        )
      });

    }

    else if(this.state.components._class === 'group'){

      nonParentContent = _.keys(this.state.layers.components).map(key => {
        return (
          <ComponentRenderer
            isParent={false}
            selectable={this.state.components.id === this.state.selection}
            selectionType={2}
            summary={this.state.layers.components[key]}
            componentId={key}
            key={key}
          />
        )
      });

    }

    else if(this.state.components._class === 'text'){

      nonParentContent = (
        <TextComponent data={this.state.components} changeDrag={this.changeDrag.bind(this)}></TextComponent>
      )

    }

    else if(this.state.layers.class === 'shape'){

      nonParentContent = (
        <ShapeComponent data={this.state.components}/>
      )

    }

    else if(this.state.components._class === 'image'){

      nonParentContent = (
        <ImageComponent data={this.state.imageData}/>
      )

    }

    else{

      nonParentContent = _.keys(this.state.layers.components).map(key => {
        return (
          <ComponentRenderer
            isParent={false}
            summary={this.state.layers.components[key]}
            componentId={key}
            key={key}
          />
        )
      })

    }



    return ( this.props.isParent ? this.renderWrapper(parentContent) : this.renderWrapper(nonParentContent))

    // let innerDOM = (<div
    //   className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.type}`}
    //   style={this.getStyle()}
    //   onMouseEnter={this.onMouseEnter}
    //   onMouseLeave={this.onMouseLeave}
    //   onClick={this.onClick}
    //   onDoubleClick={this.onDoubleClick}
    //                 >
    //   {
    //     this.state.data.layers.map((layer, index) => {
    //       return (
    //         <ComponentRenderer
    //           summary={layer}
    //           controller={this.state.controller}
    //           selection={this.state.selection}
    //           editState={this.state.editState}
    //           key={layer.id}
    //           dispatch={this.props.dispatch}
    //           dragSelf={this.state.dragChildren}
    //         />
    //       )
    //     })
    //   }
    //   {this.state.clicked && !this.props.isParent ? <ClickFrame/> : null}
    // </div>)
    //
    // //parent container element
    // if(this.state.type === 'parent'){
    //   return innerDOM;
    // }
    //
    // //group element that contains groups/primitive shapes
    // else if (this.state.type === 'group'){
    //   return (<Draggable
    //     onStart={this.onDragStart}
    //     onStop={this.onDragStop}
    //     onDrag={this.onDrag.bind(this)}
    //     defaultPosition={this.state.location}
    //     disabled={this.state.controller.key[32]}
    //     key={this.generateKey()}>
    //     <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.type}`} style={this.getStyle()}
    //       onMouseEnter={this.onMouseEnter}
    //       onMouseLeave={this.onMouseLeave}
    //       onClick={this.onClick}>
    //       {
    //         this.state.data.layers.map((layer, index) => {
    //           return (
    //             <ComponentRenderer
    //               summary={layer}
    //               controller={this.state.controller}
    //               selection={this.state.selection}
    //               editState={this.state.editState}
    //               key={index}
    //               dispatch={this.props.dispatch}
    //               dragSelf={this.state.dragChildren}
    //             />)
    //         })
    //       }
    //       {this.state.clicked ? <ClickFrame/> : null}
    //     </div>
    //   </Draggable>)
    // }
    //
    // //basic element
    // else if(this.state.type === 'rect'){
    //   return (
    //   <Draggable
    //     onStart={this.onDragStart} onStop={this.onDragStop}
    //     defaultPosition={this.state.location}
    //     onDrag={this.onDrag.bind(this)}
    //     disabled={this.state.controller.key[32]}
    //     key={this.generateKey()}>
    //     {innerDOM}
    //   </Draggable>)
    // }
    //
    // else if(this.state.type === 'text'){
    // return(  <Draggable onStart={this.onDragStart} onStop={this.onDragStop} onDrag={this.onDrag.bind(this)} defaultPosition={this.state.location} disabled={this.state.controller.key[32]}
    //   key={this.generateKey()}>
    //   <div className='component-container text-component child' style={{...this.getDimensions()}}
    //     // ...{left:this.getPosition().x,top:this.getPosition().y},
    //     onClick={this.onClick} onDoubleClick={this.handleDoubleClick}>
    //     <TextComponent data={this.state.data}></TextComponent>
    //     {this.state.clicked && !this.props.isParent ? <ClickFrame/> : null}
    //   </div>
    // </Draggable>)
    // }
    // //svg
    // else if (this.state.type === 'svg') {
    //   console.log({...this.getPosition(),...this.getDimensions()});
    //   return(<Draggable onStart={this.onDragStart} onStop={this.onDragStop} onDrag={this.onDrag.bind(this)} defaultPosition={this.state.location} disabled={this.state.controller.key[32]}
    //     key={this.generateKey()}>
    //     <div className='component-container child' style={this.getPosition()}>
    //       <SvgComponent data={this.state.data}></SvgComponent>
    //     </div>
    //   </Draggable>)
    // }
    //
    // //empty
    // else{
    //   return null
    // }

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
  createPathCode(data){
    let frame = data.frame;
    let edges = [];

    data.edges.map((edge,i) => {

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
      if(i === edges.length - 1){
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
  calculatePath(shape){
    //execute path algorithm
    this.createNewPath();
    shape.paths.map((path,index)=>{
      this.createPathCode(path)
    })
    //return last added path
    return ( <path d={this.getTheLastPathAdded()}/> )
  }
  getStylePropsFromParent(){

    let style = this.getCurStyle(this.props.data);
    return { fill:style.fill,border:style.border }
  }

  getCurStyle(obj){
    return obj.editStates[obj.editStates.current].style
  }
  render(){
    return(
      // <div style={{position:'relative'}}>
      <React.Fragment>
      {
        this.props.data.shapeData.map((shape,index)=>{
          //do this more compherensively doing fill only is retarded
          let style;
          if(shape.style.fill){
            style = this.getStylePropsFromParent();
          }
          else{
            style = {};
          }
          return (
            <svg style={{...shape.style, ...style, position:'absolute'}} key={index}>
              {
                this.calculatePath(shape)
              }
            </svg>
          )
        })
      }
    </React.Fragment>
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

  let components = state.present.newAssets[state.present.currentPage].components

  if(!ownProps.isParent){
    components = components[ownProps.summary.id];
  }

  let props = {};

  if(state.present.newAssets.images){
    if(components._class === 'image'){
      let url = components.imageURL;
      props.imageData = state.present.newAssets.images[url];
    }
  }

  return {
            ...props,
            controller:state.present.controller,
            components:components,
            selection:state.present.newSelection,
            editState:state.present.editState,
            currentPage:state.present.currentPage,
         }
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
