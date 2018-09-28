import React from 'react';

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

export default CoreComponent
