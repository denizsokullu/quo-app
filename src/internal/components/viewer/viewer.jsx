import _ from 'underscore';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Draggable from 'react-draggable';
// import ComponentRenderer from './componentRenderer';
import ComponentRenderer from './componentRendererv2';
import {COMPONENT_MOVE,KEY_UP,KEY_DOWN,COMPONENT_SELECT} from '../../redux/actions';

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.newData)
    this.state = {
      data: this.props.data,
      keyDown: false,
      draggable: this.props.controller[32],
      draggableClick: false,
      selection: this.props.selection,
      zoom:1,
      //New state properties
      newData:this.props.newData,
      newSelection:this.props.newSelection,
    };

    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onWheel = this.onWheel.bind(this);

  }
  componentWillReceiveProps(nextProps) {

    //Old code
    this.setState({data:nextProps.data,selection:nextProps.selection});
    this.setState({draggable:nextProps.controller.key[32]});


    // console.log(nextProps.newData);
    //New code
    this.setState({newData:nextProps.newData, newSelection:nextProps.newSelection});
  }

  mouseDown(){
    if(this.state.draggable){
      this.setState({draggableClick:true});
    }
  }

  mouseUp(){
    if(!this.state.draggable){
      const dispatch = this.props;
      dispatch(COMPONENT_SELECT(""));
    }
    this.setState({draggableClick:false});
  }

  onClick(){
    if(!this.state.draggable){
      const { dispatch } = this.props;
      dispatch(COMPONENT_SELECT(""));
    }
  }

  onWheel(e){
    e.preventDefault();
    if (e.ctrlKey) {
      let zoom = Math.pow(Math.abs(e.deltaY),1.2);
      if(e.deltaY < 0){
        zoom = -zoom;
      }
      // console.log(zoom,e.deltaY);
      // this.setState({zoom:Math.max(this.state.zoom-(zoom/90),0.01)});
    }
    else{
      this.viewer.scrollLeft += e.deltaX;
      this.viewer.scrollTop += e.deltaY;
    }
  }

  render() {
    let draggableClass = this.state.draggable ? 'draggable' : ''
    return (
      <div className='viewer-wrapper' onWheel={this.onWheel} ref = {c => this.viewer = c} style={{transform:`scale(${this.state.zoom})`}} onClick={this.onClick}>
        <Draggable
          disabled={!this.state.draggable}
        >
          <div className={`component-viewer ${draggableClass}`} tabIndex='0' onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}>
            {
              this.state.newData ?
                <ComponentRenderer
                  style={{
                      height:'100%',
                      width: '100%'
                  }}
                  isParent={true}
                  summary={this.state.newData.layers}
                />
              : null
            }
          </div>
        </Draggable>
      </div>
      )
  }
}

function mapStateToProps(state) {
  return {
    data: state.present.assets.data,
    controller:state.present.controller,
    selection:state.present.selection,
    newData: state.present.newAssets[state.present.currentPage],
    newSelection: state.present.newSelection
  }
}

export default connect(mapStateToProps)(Viewer);
