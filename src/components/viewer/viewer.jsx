import _ from 'lodash';
import ReactDOM from 'react-dom';
import React from 'react';
import {connect} from 'react-redux';
import actions from 'quo-redux/actions';
import { getState } from 'quo-redux/state';

import { dimensions } from '../constants/constants';
import SelectionFrame from '../selectionFrame';

import EditComponent from './EditComponent';
import PreviewComponent from './PreviewComponent';


//fix this to incorporate changing sidebar sizes
const viewerDimensions = {
  w: window.innerWidth - (dimensions.sidebar.w + 260),
  h: window.innerHeight - dimensions.nav.h
}

const viewerRatio = viewerDimensions.w / viewerDimensions.h
const viewerHeight = 3000

const viewerSize = {
  w: parseInt(viewerHeight * viewerRatio,10),
  h: viewerHeight,
}

const mainArtboardSize = { w:1500, h:1050 }

const zoomBorderThreshold = 100;

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyDown: false,
      draggable: this.props.controller[32],
      draggableClick: false,
      selection: this.props.selection,
      // newData:this.props.newData,
      // newSelection:this.props.newSelection,
      viewerPos:{x:-(viewerSize.w/2),y:-(viewerSize.h/2)},
      origin:{x:0,y:0},
      viewerSize:viewerSize,
      scale:1.0,
      threshold:{
        x:{
          min:0,
          max:0
        },
        y:{
          min:0,
          max:0
        }
      }
    };

    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handlePinch = this.handlePinch.bind(this);

  }

  mouseDown(){
    if(this.state.draggable){
      this.setState({draggableClick:true});
    }
  }

  mouseUp(){
    if(!this.state.draggable){
      const dispatch = this.props;
      dispatch(actions.COMPONENT_SELECT(""));
    }
    // this.setState({draggableClick:false});
  }

  onClick(){
    if(!this.state.draggable){
      const { dispatch } = this.props;
      dispatch(actions.COMPONENT_SELECT(""));
    }
  }

  onWheel(e){

    e.preventDefault();

    let posOfViewer = this.viewer.getBoundingClientRect();

    let posOfViewerBg = this.viewerBg.getBoundingClientRect();

    let boundingRect = {
      left:posOfViewerBg.x - posOfViewer.x,
      right:(posOfViewerBg.width - this.viewer.offsetWidth) + this.state.viewerPos.x,
      bottom:(posOfViewerBg.height - this.viewer.offsetHeight) + this.state.viewerPos.y,
      top:posOfViewerBg.y - posOfViewer.y,
    }


    if (e.ctrlKey) {

      let newScale = this.state.scale - e.deltaY * 0.01;

      let newSize = {
        w: parseInt(viewerSize.w * newScale,10),
        h: parseInt(viewerSize.h * newScale,10),
      }

      //Check if box is getting smaller than the viewing window
      if(newSize.w + this.state.viewerPos.x <= this.viewer.offsetWidth ||
         newSize.h + this.state.viewerPos.y <= this.viewer.offsetHeight){
        return;
      }

      let originX, originY;

      if(boundingRect.left >= -zoomBorderThreshold && e.deltaY > 0){
        originX = 0
        return;
      }
      else if(boundingRect.right <= zoomBorderThreshold && e.deltaY > 0){
        originX = posOfViewerBg.width
        return;
      }
      else if(boundingRect.left >= -zoomBorderThreshold && boundingRect.right <= zoomBorderThreshold && e.deltaY > 0){
        return;
      }
      else{
        originX = e.clientX - posOfViewer.x  - this.state.viewerPos.x
      }

      if(boundingRect.top >= -zoomBorderThreshold && e.deltaY > 0){
        originY = 0;
        return;
      }
      else if(boundingRect.bottom <= zoomBorderThreshold && e.deltaY > 0){
        originY = posOfViewerBg.height
        return;
      }
      else if(boundingRect.bottom <= zoomBorderThreshold && boundingRect.top >= -zoomBorderThreshold && e.deltaY > 0){
        return;
      }
      else{
        originY = e.clientY - posOfViewer.y - this.state.viewerPos.y
      }


      this.setState({origin:{
        x:originX,
        y:originY}
      })

      //Check if it's zooming in too much
      if(newScale > 5){
        return;
      }

      this.setState({ viewerSize:newSize,scale:newScale });

    }

    else{

      let threshold = this.getThresholdForPanning();

      let newPos = this.calcPanningOffsets(threshold,e)

      this.setState({viewerPos:newPos});

    }

  }

  getThresholdForPanning(){

    let threshold = {
      x:{},
      y:{}
    }

    threshold.x.min = (this.state.origin.x * this.state.scale) - this.state.origin.x
    threshold.y.min = (this.state.origin.y * this.state.scale) - this.state.origin.y

    threshold.x.max = threshold.x.min - this.state.viewerSize.w + this.viewer.offsetWidth

    threshold.y.max = threshold.y.min -this.state.viewerSize.h + this.viewer.offsetHeight

    this.setState({threshold:threshold})

    return threshold;
  }

  calcPanningOffsets(threshold,e){

    let newPos = {}

    newPos.x = Math.max(threshold.x.max ,Math.min(threshold.x.min,this.state.viewerPos.x - e.deltaX));

    newPos.y = Math.max(threshold.y.max ,Math.min(threshold.y.min,this.state.viewerPos.y - e.deltaY));

    return newPos
  }

  handlePinch(){
  }

  renderComponents(){
    const ComponentRenderClass = this.props.appMode === 'EDIT' ? EditComponent : PreviewComponent
    return (
      <ComponentRenderClass
        style={{
            left:'750px',
            top:'525px',
        }}
        isParent
        tab={this.props.activeTab}
      />
    )
  }

  renderViewerWrapper(){
    return (
      <div
        className='viewer-wrapper scroll-disabled'
        onWheel={this.onWheel.bind(this)}
        ref={ c => this.viewer = c}>
        {
          this.props.activeTab !== '' ? this.renderViewer() : null
        }
      </div>
    )
  }

  renderViewer(){
    let draggableClass = this.state.draggable ? 'draggable' : ''
    let bgClass = this.props.appMode === 'EDIT' ? 'edit-mode' : 'preview-mode'
    const pos = this.state.viewerPos
    return (
      <React.Fragment>
        {/* Scrollbars */}
        <div className='viewer-scrollbar x-axis' style={{
          left:`${this.state.viewerPos.x / (this.state.threshold.x.max - this.state.threshold.x.min) * (viewerDimensions.w - 40)}px`
        }}></div>
        <div className='viewer-scrollbar y-axis' style={{
          top:`${this.state.viewerPos.y / (this.state.threshold.y.max - this.state.threshold.y.min) * (viewerDimensions.h - 40)}px`
        }}></div>

        {/* Background of the Viewer */}
        <div
          className={`component-viewer-bg ${bgClass}`}
          ref={ c => this.viewerBg = c}
          onClick={this.onClick}
          style={{
            left:`${pos.x}px`,
            top:`${pos.y}px`,
            width:`${viewerSize.w}px`,
            height:`${viewerSize.h}px`,
            transform:`scale(${this.state.scale}) translate3d(0,0,0)`, transformOrigin:`${this.state.origin.x}px ${this.state.origin.y}px`
          }}>
          {/* Main  */}
          <div
            className={`component-viewer ${draggableClass}`}
            tabIndex='0'
            // onMouseDown={this.mouseDown}
            // onMouseUp={this.mouseUp}
            style={{
              left:`${(viewerSize.w/2) - (mainArtboardSize.w/2)}px`,
              top:`${(viewerSize.h/2) - (mainArtboardSize.h/2)}px`,
              width:`${mainArtboardSize.w}px`,
              height:`${mainArtboardSize.h}px`,
            }}>
            {
              this.renderComponents()
            }
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    // let draggableClass = this.state.draggable ? 'draggable' : ''
    const pos = this.state.viewerPos
    return (
      <React.Fragment>
      <SelectionFrame scale={this.state.scale}/>
      {
        this.renderViewerWrapper()
      }
      </React.Fragment>

      )
  }
}

//The viewer views the current window

function mapStateToProps(state) {

  let domain = getState(state,'domain');
  let app = getState(state,'app');
  let ui = getState(state,'ui')

  //if there are no tabs created, don't display anything
  let activeTab = domain.tabs.activeTab
  if(_.isEmpty(domain.tabs.allTabs)) {
    return {
      controller:ui.controller,
      activeTab:activeTab,
    }
  }

  //if there is an active tab, collect the data from the tab



  return {
    controller:ui.controller,
    activeTab:activeTab,
    appMode: app.appMode,
  }
}

export default connect(mapStateToProps)(Viewer);
