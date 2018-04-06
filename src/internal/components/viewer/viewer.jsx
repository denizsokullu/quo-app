import _ from 'underscore';
import React from 'react';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';
import {bindActionCreators} from 'redux';
import ComponentRenderer from './componentRenderer';
import {COMPONENT_MOVE,KEY_UP,KEY_DOWN} from '../../redux';

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      keyDown: false
    };
    console.log(this.state);
    this.keyPressed = this.keyPressed.bind(this);
    this.keyReleased = this.keyReleased.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    console.log('receiving props')
    console.log(nextProps.data);
    this.setState({data:nextProps.data});
  }

  keyReleased(e){
    // console.log(e);
    // e.preventDefault();
    // e.persist();
    // const { dispatch } = this.props
    // this.setState({keyDown:false},()=>{
    //   dispatch(KEY_UP(e));
    // })
  }

  keyPressed(e){
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
    return (<div className="component-viewer" tabIndex='0' onKeyDown={this.keyPressed} onKeyUp={this.keyReleased}>
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
    </div>)
  }
}

function mapStateToProps(state) {
  return {data: state.present.assets.data}
}

export default connect(mapStateToProps)(Viewer);
