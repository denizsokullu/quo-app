import React from 'react';
import PropCardWrapper from '../PropCardWrapper';
import TextInput from 'ui-components/inputElements/textInput/textInput';

class Position extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      x:nextProps.x,
      y:nextProps.y
    })
  }

  updateX(val,title,isFinal){
    //set the state and update
    this.setState({x:parseInt(val)},()=>{
      if (isFinal) this.props.update({x:this.state.x})
    });
  }

  updateY(val,title,isFinal){
    this.setState({y:parseInt(val)},()=>{
      if (isFinal) this.props.update({y:this.state.y})
    });
  }

  render(){
    return(
      this.props.x && this.props.y ?
      <PropCardWrapper title='Position'>
        <TextInput title='X' text={this.state.x} type='number' after="" onChange={this.updateX.bind(this)}/>
        <TextInput title='Y' text={this.state.y} type='number' after="" onChange={this.updateY.bind(this)}/>
      </PropCardWrapper>
      :
      null

    )
  }
}

export default Position
