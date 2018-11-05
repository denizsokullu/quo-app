import _ from 'underscore';
import React from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";
import { Helpers } from '../../parser';

function px2int(str){
  return parseInt(str.slice(0,-2));
}

function obj2rgba(arr){
  return `rgba(${arr.r},${arr.g},${arr.b},${arr.a})`
}

class PreviewComponentInner extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = this.createInitialState(props);
  }

  createInitialState(props){
    return {
      hovered:false,
      pressed:false,
      focused:false
    }
  }

  bindDOMActions(){
    this.onClick = this.onClick.bind(this);
  }

  mouseDownHandler(e){
    this.setState({focused:false,pressed:true})
    // e.preventDefault();
    // e.stopPropagation();
  }

  mouseUpHandler(e){
    this.setState({focused:true,pressed:false})
    // e.preventDefault();
    // e.stopPropagation();
  }

  mouseEnterHandler(e){
    this.setState({hovered:true});
    // alert('ENTERED CHILD EL')
    // e.preventDefault();
    // e.stopPropagation();
  }

  mouseLeaveHandler(e){
    this.setState({hovered:false});
    // e.preventDefault();
    // e.stopPropagation();
  }

  resetInteraction(e){
    this.setState({focused:false,pressed:false})
    e.preventDefault();
    e.stopPropagation();
  }

  convertCSSRule(rule){

    const callback = (dashChar, char) => { return '-' + dashChar.toLowerCase() };

    const pattern = /[A-Z]/g;

    return rule.replace(pattern, callback);

  }

  generateStyleChunks(styles,watchList){
    let styleChunk = ``;
    let convertedCSSPropertiesTable = Object.keys(styles).map(property => {
      if(!watchList.includes(property)){
        let convertedProperty = this.convertCSSRule(property);
        styleChunk += `${convertedProperty}:${styles[property]};\n`
      }
    })
    return styleChunk;
  }
  generateComponent() {


    let states = this.props.component.editStates;

    let style = states[this.props.component.editStates.current].style


    // a preview component applies the style from edit states into a const variable

    //the component must be more versatile as there should be a couple Types

    //// TODO:


    //Make the preview render:
    //simple type rect
    //text
    //svg

    //Make the preview render children

    //Make th

    let Component;


    if(this.props.component._class === 'shape'){
      Component = (styled.svg`
        position:absolute;
        ${this.generateStyleChunks(states['none'].style,[])};
        &.hovered {
          ${this.generateStyleChunks(states['hover'].style,[])}
        }
        &.pressed{
          ${this.generateStyleChunks(states['pressed'].style,[])}
        }
        &.focused{
          ${this.generateStyleChunks(states['focused'].style,[])}
        }
      `)
    }
    else{
      Component = (styled.div`
        position:absolute;
        ${this.generateStyleChunks(states['none'].style,[])};
        &.hovered {
          ${this.generateStyleChunks(states['hover'].style,[])}
        }
        &.pressed{
          ${this.generateStyleChunks(states['pressed'].style,[])}
        }
        &.focused{
          ${this.generateStyleChunks(states['focused'].style,[])}
        }
      `)
    }



    return Component
  }

  generateTextComponent(){

        let states = this.props.component.editStates;

        let style = states[this.props.component.editStates.current].style


        // a preview component applies the style from edit states into a const variable

        //the component must be more versatile as there should be a couple Types

        //// TODO:


        //Make the preview render:
        //simple type rect
        //text
        //svg

        //Make the preview render children

        //Make th

        const Component = (styled.div`
          position:absolute;
          color:${obj2rgba(this.props.component.textData.color)};

          font-family:${this.props.component.textData.fontFamily};
          ${this.generateStyleChunks(states['none'].style,['font-size'])}
          &.hovered {
            ${this.generateStyleChunks(states['hover'].style,['font-size'])}
          }
          &.pressed{
            ${this.generateStyleChunks(states['pressed'].style,['font-size'])}
          }
          &.focused{
            ${this.generateStyleChunks(states['focused'].style,['font-size'])}
          }
          font-size:${this.props.component.textData.fontSize}px;
        `)

        return Component
  }

  renderWrapper(content){

    const PreviewComponent =
      this.props.component._class === 'text'
      ? this.generateTextComponent() :
      this.props.component._class === 'shape' ?
      this.generateComponent() :
      this.generateComponent()

    const focusedClass = this.state.focused ? 'focused' : ''
    const pressedClass = this.state.pressed ? 'pressed' : ''
    const hoveredClass = this.state.hovered ? 'hovered' : ''
    
    // currently creates a div only = make it so that the render
    // calls previewComponentCore for the inner components as well.
    // Also instead of changing the width of the element, the scaling should
    // be done by the container.

    return (
      // <React.Fragment>
      // <div className={`preview-component-container`} }>
        <PreviewComponent
          // onClick={this.resetInteraction.bind(this)}
          onMouseDown={this.mouseDownHandler.bind(this)}
          onMouseUp={this.mouseUpHandler.bind(this)}
          onMouseEnter={this.mouseEnterHandler.bind(this)}
          onMouseLeave={this.mouseLeaveHandler.bind(this)}
          className={`${hoveredClass} ${pressedClass} ${focusedClass}`}>
          {
            this.props.component.textData ? this.props.component.textData.text :
            this.props.component._class === 'shape' ? <ShapeComponent data={this.props.component}/> : null
          }
        </PreviewComponent>
      // </div>
      // </React.Fragment>
    )
  }
  render(){
    // const content = _.keys(this.props.componentTree).map((id)=>{
    //       return ( <PreviewComponentInnerConnected id={id} key={id}/> )
    // });
    return (this.renderWrapper())
  }
}

class ShapeComponent extends React.Component{

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
            // <svg style={{...shape.style, ...style, position:'absolute'}} key={index}>
            //   {
                this.calculatePath(shape)
            //   }
            // </svg>
          )
        })
      }
    </React.Fragment>
    )
  }
}



// Returns a size that fits into the docked container.
// Keeps aspect ratio for the element.
function computeDockedSize(w,h,containerSize){

  let c = containerSize
  let rInner = w/h;
  let rContainer = c.w / c.h;

  return rContainer > rInner ? { w: parseInt(w * c.h / h), h: parseInt(c.h) } : { w: parseInt(c.w), h: parseInt(h * c.w / w) }
}

function generateOuterComponent(states,containerSize) {

  let style = states[states.current].style
  let size = computeDockedSize(px2int(style.width),px2int(style.height),containerSize);
  let resizeRatio = {x:size.w/px2int(style.width),y:size.h/px2int(style.height)}

  // a preview component applies the style from edit states into a const variable

  //the component must be more versatile as there should be a couple Types

  //// TODO:

  const Component = (styled.div`
    width:${size.w}px;
    height:${size.h}px;
    .content{
      position:relative;
      transform:scale(${resizeRatio.x});
      transform-origin:0 0;
    }
    ${generateStyleChunks(states['none'].style,['left','top','height','width'])}
    &.hovered {
      ${generateStyleChunks(states['hover'].style,['left','top','height','width'])}
    }
    &.pressed{
      ${generateStyleChunks(states['pressed'].style,['left','top','height','width'])}
    }
    &.focused{
      ${generateStyleChunks(states['focused'].style,['left','top','height','width'])}
    }
  `)

  return Component
}

function convertCSSRule(rule){

  const callback = (dashChar, char) => { return '-' + dashChar.toLowerCase() };

  const pattern = /[A-Z]/g;

  return rule.replace(pattern, callback);

}

function generateStyleChunks(styles,watchList){
  let styleChunk = ``;
  let convertedCSSPropertiesTable = Object.keys(styles).map(property => {
    if(!watchList.includes(property)){
      let convertedProperty = convertCSSRule(property);
      styleChunk += `${convertedProperty}:${styles[property]};\n`
    }
  })
  return styleChunk;
}


class PreviewComponentCore extends React.Component {
  constructor(props) {

    super(props);
    this.state = this.createInitialState(props);

  }

  createInitialState(props){
    return {
      containerSize:props.dim ? props.dim : { w: 220, h: 126 },
      hovered:false,
      pressed:false,
      focused:false,
    }
  }

  // componentWillReceiveProps(nextProps){
  //   this.setState({component:nextProps.component});
  //   this.setState({componentTree:nextProps.componentTree});
  // }

  bindDOMActions(){
    this.onClick = this.onClick.bind(this);
  }

  mouseDownHandler(){
    this.setState({focused:false,pressed:true})
  }

  mouseUpHandler(){
    this.setState({focused:true,pressed:false})
  }

  mouseEnterHandler(){
    this.setState({hovered:true})
  }

  mouseLeaveHandler(){
    this.setState({hovered:false})
  }

  resetInteraction(){
    this.setState({focused:false,pressed:false})
  }


  convertCSSRule(rule){

    const callback = (dashChar, char) => { return '-' + dashChar.toLowerCase() };

    const pattern = /[A-Z]/g;

    return rule.replace(pattern, callback);

  }

  generateStyleChunks(styles,watchList){
    let styleChunk = ``;
    let convertedCSSPropertiesTable = Object.keys(styles).map(property => {
      if(!watchList.includes(property)){
        let convertedProperty = this.convertCSSRule(property);
        styleChunk += `${convertedProperty}:${styles[property]};\n`
      }
    })
    return styleChunk;
  }

  generateComponent(editStates) {

    let states = editStates;

    let style = states[editStates.current].style
    let size = this.computeDockedSize(px2int(style.width),px2int(style.height));
    let resizeRatio = {x:size.w/px2int(style.width),y:size.h/px2int(style.height)}

    // a preview component applies the style from edit states into a const variable

    //the component must be more versatile as there should be a couple Types

    //// TODO:

    const Component = (styled.div`
      width:${size.w}px;
      height:${size.h}px;
      .content{
        position:relative;
        transform:scale(${resizeRatio.x});
        transform-origin:0 0;
      }
      ${this.generateStyleChunks(states['none'].style,['left','top','height','width'])}
      &.hovered {
        ${this.generateStyleChunks(states['hover'].style,['left','top','height','width'])}
      }
      &.pressed{
        ${this.generateStyleChunks(states['pressed'].style,['left','top','height','width'])}
      }
      &.focused{
        ${this.generateStyleChunks(states['focused'].style,['left','top','height','width'])}
      }
    `)

    return Component
  }

  renderWrapper(content){

    const PreviewComponent = generateOuterComponent(this.props.component.editStates,this.state.containerSize);

    const focusedClass = this.state.focused ? 'focused' : ''
    const pressedClass = this.state.pressed ? 'pressed' : ''
    const hoveredClass = this.state.hovered ? 'hovered' : ''

    // currently creates a div only = make it so that the render
    // calls previewComponentCore for the inner components as well.
    // Also instead of changing the width of the element, the scaling should
    // be done by the container.

    console.log('\n\n\n\n');

    return (
      <div className={`preview-component-container`} onClick={this.resetInteraction.bind(this)}>
        <PreviewComponent
          // onMouseDown={this.mouseDownHandler.bind(this)}
          // onMouseUp={this.mouseUpHandler.bind(this)}
          // onMouseEnter={this.mouseEnterHandler.bind(this)}
          // onMouseLeave={this.mouseLeaveHandler.bind(this)}
          // className={`${hoveredClass} ${pressedClass} ${focusedClass}`}
          >
          <div className='content'>
            { this.props.previewLink
              ?
              _.keys(Helpers.findComponentTree(this.props.component.id,this.props.componentTree)).map((id)=>{
              return ( <PreviewComponentInnerConnected id={id} key={id} previewLink/>)})
              :
              _.keys(this.props.componentTree).map((id)=>{
                return ( <PreviewComponentInnerConnected id={id} key={id}/> )
              })
            }
          </div>
        </PreviewComponent>
      </div>
    )
  }
  render(){
    return this.renderWrapper();

  }
}

function mapStateToProps(state,ownProps){

    let component;
    let componentTree;
    if(ownProps.previewLink && state.present.previewLink.received){
      component =  state.present.previewLink.assets.components[ownProps.id];
      componentTree = Helpers.findComponentTree(component.id,state.present.previewLink.assets)
    }
    else{
      component =  state.present.newAssets[state.present.currentPage].components[ownProps.id];
      componentTree = Helpers.findComponentTree(component.id,state.present.newAssets[state.present.currentPage])
    }

    return {
      component,
      componentTree,
    }
}

const PreviewComponentInnerConnected = connect(mapStateToProps)(PreviewComponentInner);

export default PreviewComponentCore;
