import React, { Component } from 'react';


//Currently only works horizontally and the dragger is along the right end.
export default class Resizable extends Component {
  constructor(props){
    super(props);
    this.state = {
      init: { x:'0px', y:'0px' },
      delta: { x:0, y:0 },
      mouseDown: false,
      dimensions: { w: this.props.width, h:this.props.height }
    }
    this.handleMouseState = this.handleMouseState.bind(this);
  }

  componentDidMount () {
    document.addEventListener ('mousemove', e => this.handleMouseMove.bind(this)(e) );
    document.addEventListener ('mouseup', e => this.setState({mouseDown:false}) );
  }

  handleMouseMove(event){
    if(this.state.mouseDown){
      this.setState(
        { delta:
          {
              x: event.clientX - this.state.init.x,
              y: event.clientY - this.state.init.y,
          }
        }
        , ()=>{
          if(
            (parseInt(this.props.minWidth,10) && this.getInteger(this.state.dimensions.w) + this.state.delta.x <= parseInt(this.props.minWidth,10)) ||
            (parseInt(this.props.minHeight,10) && this.getInteger(this.state.dimensions.h) + this.state.delta.x <= parseInt(this.props.minHeight,10))
          ){
            return
          }
          this.setState(
            { dimensions:
              { w: this.convertValue(this.state.dimensions.w,this.state.delta.x),
                h: this.convertValue(this.state.dimensions.h,this.state.delta.y)
              }
            }
          )
        }
      )
      this.setState(
        { init: { x: event.clientX, y: event.clientY } }
      )
    }
  }

  handleMouseState(event,action){
    if ( action === 'up'){
      this.setState({mouseDown:false});
    }
    else if ( action === 'down'){
      this.setState({mouseDown:true});
      this.setState({init:{x:event.clientX,y:event.clientY}})
    }
  }

  getInteger(value){
    if(value.endsWith('px')){
      return parseInt(value.slice(0,-2))
    }
    else{
      return value;
    }
  }

  convertValue(value,delta){
    if(value.endsWith('px')){
      return `${this.getInteger(value) + delta}px`
    }
    else{
      return value;
    }
  }

  render(){
    const d = this.state.dimensions;
    return(
      <div
        className='sidebar-wrapper sidebar-resizable'
        style={{width:d.w}}
      >
        <div className='dragger-wrapper'>
          <div
            className='resizable-dragger right'
            onMouseDown={(event)=>(this.handleMouseState(event,'down'))}
            onMouseUp={()=>{this.props.onResize(d.w)}}
          ></div>
        </div>
        { this.props.children }
      </div>
    )
  }
}
