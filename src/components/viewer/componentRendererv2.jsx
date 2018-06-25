import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
// import Draggable from '../draggable/react-draggable';
import { COMPONENT_MOVE,COMPONENT_SELECT } from '../../redux/actions';

import uuidv1 from 'uuid/v1';

import SelectionFrame from '../selectionFrame';

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
      testid:data.id,
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

    let components = this.state.components;

    //svg CoreComponent
    if(components.path){
      this.setState({type :'svg'});
    }
    else if(components.textData){
      this.setState({type :'text'});
    }

    else if(components._class === 'page' || (components.shapeType && components.layers) || components._class === 'group'){
      //group container(more ComponentRenderers)
      if(this.props.isParent){
        this.setState({type :'parent'});
      }
      else if(components._class === 'group'){
        this.setState({type :'group'});
        this.setState({dragChildren :true});
      }
      //rectangle CoreComponent
      else{
        this.setState({type :'rect'});
        this.setState({dragSelf :'true'});
      }
    }

    // this.state.location = this.getPosition();
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    // this.onMouseEnter = this.onMouseEnter.bind(this);
    // this.onMouseLeave = this.onMouseLeave.bind(this);
    // this.onDragStart = this.onDragStart.bind(this);
    // this.onDragStop = this.onDragStop.bind(this);
    // this.onFocus = this.onFocus.bind(this);

    // this.onClick = this.onClick.bind(this);
    // this.onDoubleClick = this.onDoubleClick.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    // this.setState({data: nextProps.summary},()=>{
    //   // this.setState({location:this.getPosition()});
    // });
    // this.setState({controller: nextProps.controller,
    //                editState:nextProps.editState
    //              });
    //
    // // if(nextProps.selection.id != this.state.id){
    // //   this.setState({clicked:false})
    // // }
    // console.log(this.state);
    // console.log(nextProps,this.state.components);
    // // if(nextProps.components[this.state.id].interactions.clicked){
    // //   alert('clicked on', this.state.id);
    // // }
    //
    this.setState({
      id:nextProps.summary.id,
      components:nextProps.components,
      layers:nextProps.summary,
      selection:nextProps.selection,
      editState:nextProps.editState
    })
    //new properties
    // this.setState({
    //   components:nextProps.components,
    //   layers:nextProps.summary
    // },()=>{
    // });
  }

  componentWillUpdate(nextProps,nextState){
    // console.log(nextProps,nextState);
  }

  // TODO: Update this to check if component.interactions.clicked == true
  isSelected(){
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
    if(!this.props.isParent && this.state.components._class !== 'artboard'){

      e.stopPropagation();
      const { dispatch } = this.props;
      dispatch(COMPONENT_SELECT(this.state.id));
    }

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

  handleDoubleClick(){
    // console.log('yo')
  }

  calcDragOffset(style){

    let left = (parseInt(style.left.slice(0,-2)) + this.state.drag.offset.x) + 'px';
    let top = (parseInt(style.top.slice(0,-2)) + this.state.drag.offset.y) + 'px';
    return {left:left,top:top}

  }

  renderWrapper(content){

    let style = this.getStyle();

    //Add in drag offset

    if(!this.props.isParent){

      style = {...style,...this.calcDragOffset(style)}

    }

    let selectedClass = this.isSelected() ? 'selected' : '';

    return (
      <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.components._class} ${selectedClass}`} id={this.state.id}
        style={style}
        onClick={this.onClick}
        ref='handle'
        onMouseDown={this.onMouseDownHandler.bind(this)}
      >
        { content }
        {/* {!this.props.isParent && this.state.components.interactions.clicked  ? <SelectionFrame/> : null} */}
    </div>)
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

    let nonParentContent = _.keys(this.state.layers.components).map(key => {
      return (
        <ComponentRenderer
          isParent={false}
          summary={this.state.layers.components[key]}
          componentId={key}
          key={key}
        />
      )
    })

    if(this.state.components._class === 'text'){

      nonParentContent = (
        <TextComponent data={this.state.components}></TextComponent>
      )

    }

    return ( this.props.isParent ? this.renderWrapper(parentContent) : this.renderWrapper(nonParentContent))

    // console.log(this.props.enableParentDragging,this.props.disableParentDragging)
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

class SvgComponent extends CoreComponent{
  style(positionOnly = false) {
    return this.state.data.css;
  }
  points(){
    let data = this.state.data.path;
    let frame = this.state.data.frame
    return data.points.map(point => {
      let points = point.point.replace(/[{}]/g, '').replace(/\s/g, '').split(',');
      return [
        parseFloat(points[0]) * frame.width,
        parseFloat(points[1]) * frame.height
      ].join(',');
    })
  }
  render(){
    return (
      <svg style={this.style(true)}>
        <polygon style={this.style()} points={this.points().join(' ')}></polygon>
      </svg>
    )
  }
}

class TextComponent extends CoreComponent{
  constructor(props){
    super(props);
    // let that = this;
    this.state.textData = this.state.data.textData
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
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
    console.log('yo')
    alert('hello');
  }

  handleClick(){
    alert('hello');
  }

  render(){
    return (this.state.textData ?
        <span className='text-outer'
          onDoubleClick={this.handleDoubleClick}
        >
          <span className='text-inner'
            style={
              {
                fontSize:this.state.textData.fontSize, color:this.getColor(),
                fontFamily:this.getFontFamily()
              }}>
            {this.state.textData.text}
          </span>
        </span>
    :
    <p></p>
    )
  }
}

function mapStateToProps(state,ownProps) {

  let components = state.present.newAssets[state.present.currentPage].components


  if(!ownProps.isParent){
    components = components[ownProps.summary.id];
  }

  return {
            controller:state.present.controller,
            components:components,
            selection:state.present.newSelection,
            editState:state.present.editState,
         }
}

const ComponentRenderer = connect(mapStateToProps)(ComponentRendererCore);

export default ComponentRenderer
