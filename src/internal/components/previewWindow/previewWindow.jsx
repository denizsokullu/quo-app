import React, { Component } from 'react';
import Draggable from 'react-draggable';

export default class PreviewWindow extends Component {
  render() {
    return (
      <Draggable>
        <div className='preview-window-container'
          style={{
            width:this.props.width,
            height:this.props.height
          }}>
          <div className='window-bar'>
            <span className="window-button red"></span>
            <span className="window-button yellow"></span>
            <span className="window-button green"></span>
          </div>
          <div className='window'>
            { this.props.children }
          </div>
        </div>
      </Draggable>
    );
  }
}
