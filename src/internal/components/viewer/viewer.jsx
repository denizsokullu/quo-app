import _ from 'underscore';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Draggable from 'react-draggable';
import ComponentRenderer from './componentRenderer';
import {COMPONENT_MOVE,KEY_UP,KEY_DOWN} from '../../redux';

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      keyDown: false,
      draggable: false
    };
    this.keyPressed = this.keyPressed.bind(this);
    this.keyReleased = this.keyReleased.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({data:nextProps.data});
  }

  keyReleased(e){
    if(e.which === 32){
      this.setState({draggable:false,keyDown:false},()=>{
        e.preventDefault();
        e.persist();
        const { dispatch } = this.props
        dispatch(KEY_UP(e));
      });
    }
    // e.preventDefault();
    // e.persist();
    // const { dispatch } = this.props
    // this.setState({keyDown:false},()=>{
    //   dispatch(KEY_UP(e));
    // })
  }

  keyPressed(e){
    if(!this.state.keyDown && e.which === 32){
      this.setState({draggable:true,keyDown:true},()=>{
        e.preventDefault();
        e.persist();
        const { dispatch } = this.props
        dispatch(KEY_DOWN(e));
      });
    }

    // e.preventDefault();
    // e.persist();
    // // console.log(this.state.keyDown)
    // if(!this.state.keyDown){
    //   const { dispatch } = this.props
    //   this.setState({keyDown:true},()=>{
    //     dispatch(KEY_DOWN(e));
    //   })
    // }

    // console.log('Pressed');

  }
  render() {
    let draggableClass = this.state.draggable ? 'draggable' : ''
    return (
      <Draggable
        disabled={!this.state.draggable}
      >
        <div className={`component-viewer ${draggableClass}`} tabIndex='0' onKeyDown={this.keyPressed} onKeyUp={this.keyReleased}>
          {
            _.keys(this.state.data).map(key => {
              return <ComponentRenderer
                style={{
                  height: '100%',
                  width: '100%'
                }}
                isParent={true}
                componentData={this.state.data[key]}
                key={key}
                dragSelf={true}/>
            })
          }
        </div>
      </Draggable>)
  }
}

function mapStateToProps(state) {
  return {data: state.present.assets.data}
}

export default connect(mapStateToProps)(Viewer);
