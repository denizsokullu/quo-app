import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

import SnapshotComponent from './SnapshotComponent';
import { convertSnapshotToImage } from './utils';

export default class SnapshotContainer extends Component {

  static propTypes = {
    source: PropTypes.shape({
      location: PropTypes.string,
      filetype: PropTypes.string,
      page: PropTypes.string,
    }).isRequired,
    component: PropTypes.object.isRequired,
  } 

  constructor(props){ 
    super(props);
    this.state = {}
  }

  getContainerDimensions = () => {
    let dims =  ReactDOM.findDOMNode(this).parentNode.getBoundingClientRect();
    return {
      w: dims.width,
      h: dims.height
    }
  }

  getComponentDimensions = () => {
    return {
      w: this.props.component.state.states.composite.props.width,
      h: this.props.component.state.states.composite.props.height
    } 
  }

  componentDidMount = () => {

    let data  = {
      id: this.props.component.id,
      cDimensions : this.getContainerDimensions(),
      eDimensions : this.getComponentDimensions(),
    }
    
    let image = convertSnapshotToImage(data);
    let fullImage = convertSnapshotToImage({...data, full:true});

    this.setState({snapshotImage: image});

    this.props.onRender(fullImage);

  }

  render = () => {
    let alt = `Snapshot of the component ${this.props.component.name}.`
    return (
      <React.Fragment>
        {
          this.state.snapshotImage
          ?
            <img src={this.state.snapshotImage} alt={alt}/>
          :
            <div style={{display:'none'}}>
              <SnapshotComponent
                source = {this.props.source}
                id = {this.props.component.id}
                isParent
              />
            </div>
        }
      </React.Fragment>
    )
  }
}