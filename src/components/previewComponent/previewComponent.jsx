import _ from 'underscore';
import React from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";

function px2int(str){
  return parseInt(str.slice(0,-2));
}

class PreviewComponentCore extends React.Component {
  constructor(props) {

    super(props);
    this.state = this.createInitialState(props);

  }

  createInitialState(props){
    return {
      containerSize:{ w: 220, h: 150 },
      id:props.id,
      component:props.component,
      hovered:false,
      pressed:false,
      focused:false
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({component:nextProps.component})
    console.log('change happened')
  }

  bindDOMActions(){
    this.onClick = this.onClick.bind(this);
  }

  declareTypes(){
    let components = this.state.components;

    //svg CoreComponent
    if(components.path){
      this.setState({type:'svg'});
    }
    else if(components.textData){
      this.setState({type:'text'});
    }

    else if(components._class === 'page' || (components.shapeType && components.layers) || components._class === 'group'){

      //group container(more ComponentRenderers)
      if(this.props.isParent){
        this.setState({type:'parent'});
      }
      else if(components._class === 'group'){
        this.setState({type:'group'});
      }
      //rectangle CoreComponent
      else{
        this.setState({type:'rect'});
      }
    }
  }


  // Returns a size that fits into the docked container.
  // Keeps aspect ratio for the element.
  computeDockedSize(w,h){

    let c = {w:this.state.containerSize.w,h:this.state.containerSize.h}
    let rInner = w/h;
    let rContainer = c.w / c.h;

    return rContainer > rInner ? { w: parseInt(w * c.h / h), h: parseInt(c.h) } : { w: parseInt(c.w), h: parseInt(h * c.w / w) }
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

  generateBoundaries(){

  }

  generateComponent() {


    let states = this.state.component.editStates;

    let style = states[this.state.component.editStates.current].style
    let size = this.computeDockedSize(px2int(style.width),px2int(style.height));

    // a preview component applies the style from edit states into a const variable

    const Component = (styled.div`
      width:${size.w}px;
      height:${size.h}px;
      ${this.generateStyleChunks(states['none'].style,['width','height'])}
      &.hovered {
        ${this.generateStyleChunks(states['hover'].style,['width','height'])}
      }
      &.pressed{
        ${this.generateStyleChunks(states['pressed'].style,['width','height'])}
      }
      &.focused{
        ${this.generateStyleChunks(states['focused'].style,['width','height'])}
      }
    `)

    return Component
  }

  renderWrapper(content){

    const PreviewComponent = this.generateComponent();

    const focusedClass = this.state.focused ? 'focused' : ''
    const pressedClass = this.state.pressed ? 'pressed' : ''
    const hoveredClass = this.state.hovered ? 'hovered' : ''

    // currently creates a div only = make it so that the render
    // calls previewComponentCore for the inner components as well.
    // Also instead of changing the width of the element, the scaling should
    // be done by the container.

    return (
      <React.Fragment>
      <div className={`preview-component-container`} onClick={this.resetInteraction.bind(this)}>
        <PreviewComponent
          onMouseDown={this.mouseDownHandler.bind(this)}
          onMouseUp={this.mouseUpHandler.bind(this)}
          onMouseEnter={this.mouseEnterHandler.bind(this)}
          onMouseLeave={this.mouseLeaveHandler.bind(this)}
          className={`${hoveredClass} ${pressedClass} ${focusedClass}`}>
        </PreviewComponent>
      </div>
      </React.Fragment>
    )
  }
  render(){
    const content = (
      <p>

      </p>
    )
    return (this.renderWrapper(content));

    // let innerDOM = this.renderInnerDOM;

    // let parentContent = _.keys(this.state.layers).map(key => {
    //   return (
    //     <ComponentRenderer
    //       isParent={false}
    //       summary={this.state.layers[key]}
    //       key={key}
    //     />
    //   )
    // });
    //
    // let nonParentContent = _.keys(this.state.layers.components).map(key => {
    //   return (
    //     <ComponentRenderer
    //       isParent={false}
    //       summary={this.state.layers.components[key]}
    //       key={key}
    //     />
    //   )
    // })

    // if(this.state.components._class === 'text'){
    //
    //   nonParentContent = (
    //     <TextComponent data={this.state.components}></TextComponent>
    //   )
    //
    // }

    // return ( this.props.isParent ? this.renderWrapper(parentContent) : this.renderWrapper(nonParentContent))

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

// class CoreComponent extends React.Component{
//   constructor(props){
//     super(props);
//     this.state = {
//       data: props.data
//     };
//     //add other stuff here
//   }
//   componentWillReceiveProps(nextProps) {
//     this.setState({data: nextProps.data});
//   }
// }
//
// class SvgComponent extends CoreComponent{
//   style(positionOnly = false) {
//     return this.state.data.css;
//   }
//   points(){
//     let data = this.state.data.path;
//     let frame = this.state.data.frame
//     return data.points.map(point => {
//       let points = point.point.replace(/[{}]/g, '').replace(/\s/g, '').split(',');
//       return [
//         parseFloat(points[0]) * this.state.data.frame.width,
//         parseFloat(points[1]) * this.state.data.frame.height
//       ].join(',');
//     })
//   }
//   render(){
//     return (
//       <svg style={this.style(true)}>
//         <polygon style={this.style()} points={this.points().join(' ')}></polygon>
//       </svg>
//     )
//   }
// }
//
// class TextComponent extends CoreComponent{
//   constructor(props){
//     super(props);
//     // let that = this;
//     this.state.textData = this.state.data.textData
//     this.handleDoubleClick = this.handleDoubleClick.bind(this);
//   }
//   getColor(){
//     let c = this.state.textData.color;
//     return (
//       `rgba(${c.r},${c.g},${c.b},${c.a})`
//     )
//   }
//   getFontFamily(){
//     return (
//       `"${this.state.textData.fontName}", sans-serif`
//     )
//   }
//
//   handleDoubleClick(){
//     console.log('yo')
//     alert('hello');
//   }
//
//   handleClick(){
//     alert('hello');
//   }
//
//   render(){
//     return (this.state.textData ?
//         <span className='text-outer'
//           onDoubleClick={this.handleDoubleClick}
//         >
//           <span className='text-inner'
//             style={
//               {
//                 fontSize:this.state.textData.fontSize, color:this.getColor(),
//                 fontFamily:this.getFontFamily()
//               }}>
//             {this.state.textData.text}
//           </span>
//         </span>
//     :
//     <p></p>
//     )
//   }
// }
//
// function mapStateToProps(state,ownProps) {
//   if(state.present.currentPage !== ''){
//       let data = state.present.newAssets[state.present.currentPage].components[ownProps.id];
//       return {
//                 data:data,
//              }
//   }
//   else{
//     return {
//       data:{}
//     }
//   }
//
//
// }
// //
// const PreviewComponent = connect(mapStateToProps)(PreviewComponentCore);

export default PreviewComponentCore;
