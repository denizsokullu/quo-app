import React from 'react';
import CoreComponent from './CoreComponent';

class ImageComponent extends React.Component{
  render(){
    const imgData = `data:image/png;base64,${this.props.data}`;
    return(
      <img src={imgData}></img>
    )
  }
}

export default ImageComponent
