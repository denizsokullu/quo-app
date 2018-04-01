import _ from 'underscore';
import React from 'react';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';
import {COMPONENT_MOVE} from '../../redux';
import ClickFrame from './clickFrame'

//every core-component needs to be aware of the data passed in as props
//every core-component has their own syling methods.
//every core-component has no interaction with the store,
//                     instead data gets passed down from the renderer.
// Types of objects svg, rect, text, group(componentRenderer).
//
// svg, rect, text all receive new props from componentRenderers -> mainly data

class ComponentRenderer extends React.Component {
  constructor(props) {
    super(props);
    let data = props.componentData;
    this.state = {
      data: data,
      controller: props.controller,
      clicked:false
    };

    //svg CoreComponent
    if(data.path){
      this.state.type = 'svg'
    }
    else if(data.textData){
      this.state.type = 'text'
    }

    else if(data._class == 'page' || (data.shapeType && data.layers) || data._class == 'group'){
      //group container(more ComponentRenderers)
      if(this.props.isParent){
        this.state.type = 'parent'
      }
      else if(data._class == 'group'){
        this.state.type = 'group'
        this.state.dragChildren = true;
      }
      //rectangle CoreComponent
      else{
        this.state.type = 'rect';
        this.state.dragSelf = false;
      }
    }
    this.onClick = this.onClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onDragStart = this.onDragStart.bind(this);

  }
  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.componentData});
    this.setState({controller: nextProps.controller});
  }

  getPosition(){
    let frame = this.state.data.frame
    return {
      x: frame.x,
      y: frame.y
    }
  }
  getStyle() {
    return this.state.data.css;
  }

  onDragStart(e, data) {
    // console.log('Starting',this.state.selfDrag);
  }

  onDragStop(e, data) {
    // console.log(this.children._self.state.data.frame);
    const { dispatch } = this.children._self.props;
    const dispatchData = {component:this.children._self.state.data,data:data,e:e}
    dispatch(COMPONENT_MOVE(dispatchData));
  }


  //on mouse enter and leave will replace with a key press
  onMouseEnter(){
    if(!this.props.isParent){

    }
  }

  onMouseLeave(){
    if(!this.props.isParent){

    }
  }

  onClick(){
    let oldState = this.state.clicked
    this.setState({clicked:!oldState});
  }

  disableDragging(){
    // console.log('Disabling',this.state.type,this.state.data.layers);
    this.setState({selfDrag:false});
  }

  enableDragging(){
    // console.log('Enabling',this.state.type,this.state.data.layers);
  }

  render(){
    // console.log(this.props.enableParentDragging,this.props.disableParentDragging)
    let innerDOM = (<div
      className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.type}`}
      style={this.getStyle()}
      onMouseEnter={this.onMouseEnter}
      onMouseLeave={this.onMouseLeave}
      onClick={this.onClick}>
      {
        this.state.data.layers.map((layer, index) => {
          return (
            <ComponentRenderer
              componentData={layer}
              controller={this.state.controller}
              key={index}
              dispatch={this.props.dispatch}
              dragSelf={this.state.dragChildren}
            />
          )
        })
      }
      {this.state.clicked && !this.props.isParent ? <ClickFrame/> : null}
    </div>)

    //parent container element
    if(this.state.type === 'parent'){
      return innerDOM;
    }

    //group element that contains groups/primitive shapes
    else if (this.state.type === 'group'){
      return (<Draggable
        onStart={this.onDragStart}
        onStop={this.onDragStop}
        defaultPosition={this.getPosition()}
        disabled={this.state.controller.key['a']}>
        <div className={`component-container ${this.props.isParent ? 'parent' : 'child'} component-${this.state.type}`} style={this.getStyle()}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}>
          {
            this.state.data.layers.map((layer, index) => {
              return (
                <ComponentRenderer
                  componentData={layer}
                  controller={this.state.controller}
                  key={index}
                  dispatch={this.props.dispatch}
                  dragSelf={this.state.dragChildren}
                />)
            })
          }
          {this.state.clicked ? <ClickFrame/> : null}
        </div>
      </Draggable>)
    }

    //basic element
    else if(this.state.type === 'rect'){
      return (<Draggable onStart={this.onDragStart} onStop={this.onDragStop}  defaultPosition={this.getPosition()} disabled={!this.state.controller.key['a']}>
        {innerDOM}
      </Draggable>)
    }

    else if(this.state.type === 'text'){
    return(  <Draggable onStart={this.onDragStart} onStop={this.onDragStop}  defaultPosition={this.getPosition()} disabled={!this.state.controller.key['a']}>
      <div className='component-container child' style={this.getPosition()}>
        <TextComponent data={this.state.data}></TextComponent>
      </div>
    </Draggable>)
    }
    //svg
    else if (this.state.type === 'svg') {
      return(<Draggable onStart={this.onDragStart} onStop={this.onDragStop}  defaultPosition={this.getPosition()} disabled={!this.state.controller.key['a']}>
        <div className='component-container child' style={this.getPosition()}>
          <SvgComponent data={this.state.data}></SvgComponent>
        </div>
      </Draggable>)
    }

    //empty
    else{
      return null
    }

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
        parseFloat(points[0]) * this.state.data.frame.width,
        parseFloat(points[1]) * this.state.data.frame.height
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
  }
  getText(target) {
    return atob(target).split("NSAttributes")[1].split('Ó')[0].slice(7);
  }
  render(){
    return (<div>
      {this.getText(this.state.data.textData)}
    </div>)
  }
}

function mapStateToProps(state) {
  return {data: state.present.assets.data, controller:state.present.controller}
}

export default connect(mapStateToProps)(ComponentRenderer)
