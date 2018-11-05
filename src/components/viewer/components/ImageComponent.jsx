import React from 'react';
import CoreComponent from './CoreComponent';

// THIS WILL BE USED TO RENDER IMAGE
class ImageComponent extends React.Component {
  render() {
    const imgData = `${this.props.data}`;
    return (
      <img src={imgData}></img>
    )
  }
}

export default ImageComponent;
