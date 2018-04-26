import _ from 'underscore';
import React from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";

class PreviewComponentCore extends React.Component {
  constructor(props) {

    super(props);
    this.state = this.createInitialState(props);
    console.log(this.state);
    // this.declareTypes();
    // this.bindDOMActions();

  }

  createInitialState(props){
    return {
      // clicked:false,
      // layers:props.summary,
      // components:props.components,
      id:props.id,
    }
  }

  bindDOMActions(){
    this.onClick = this.onClick.bind(this);
  }

  declareTypes(){
    let components = this.state.components;

    //svg CoreComponent
    if(components.path){
      this.state.type = 'svg'
    }
    else if(components.textData){
      this.state.type = 'text'
    }

    else if(components._class == 'page' || (components.shapeType && components.layers) || components._class == 'group'){
      //group container(more ComponentRenderers)
      if(this.props.isParent){
        this.state.type = 'parent'
      }
      else if(components._class == 'group'){
        this.state.type = 'group'
      }
      //rectangle CoreComponent
      else{
        this.state.type = 'rect';
      }
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     components:nextProps.components,
  //     layers:nextProps.summary
  //   });
  // }

  // getPosition(){
  //   let frame = this.getStyle();
  //   return {
  //     x: parseInt(frame.left.slice(0,-2)),
  //     y: parseInt(frame.top.slice(0,-2))
  //   }
  // }
  //
  // getDimensions(){
  //   let frame = this.getStyle();
  //   return {
  //     height: parseInt(frame.height.slice(0,-2)),
  //     width: parseInt(frame.width.slice(0,-2))
  //   }
  // }

  getStyle() {
    // a preview component applies the style from edit states into a const variable
    return (styled.div`
      width:500px;
      height:500px;
      background-color: red;
      &:hover {
        background-color:blue;
      }
    `);

    // if(this.props.isParent){
    //   return;
    // }
    // if(this.isSelected()){
    //   return this.state.components.editStates[this.state.editState].style;
    // }
    // else{
    //   return this.state.components.editStates['none'].style;
    // }
  }

  // onFocus(){
  //   let oldState = this.state.clicked
  //   this.setState({clicked:!oldState});
  // }

  // onClick(e){
  //   if(!this.props.isParent && this.state.components._class != 'artboard'){
  //     e.stopPropagation();
  //     const { dispatch } = this.props;
  //     dispatch(COMPONENT_SELECT(this.state.id));
  //   }
  // }

  // handleDoubleClick(){
  //   console.log('yo')
  //   alert('hello');
  // }

  renderWrapper(content){
    let StyleWrapper = this.getStyle();
    return (
      <div className={`preview-component-container`}>
        <StyleWrapper>
          { content }
        </StyleWrapper>
      </div>
    )
  }
  render(){
    const content = (
      <p>
        HI
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
function mapStateToProps(state,ownProps) {
  if(state.present.currentPage !== ''){
      let data = state.present.newAssets[state.present.currentPage].components[ownProps.id];
      return {
                data:data,
             }
  }
  else{
    return {
      data:{}
    }
  }


}
//
const PreviewComponent = connect(mapStateToProps)(PreviewComponentCore);

export default PreviewComponent;
