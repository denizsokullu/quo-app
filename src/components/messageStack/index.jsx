import React, { Component } from 'react';

import { connect } from 'react-redux';
import { REMOVE_MESSAGE } from '../../redux/actions';


class MessageStack extends Component{
  render(){
    return(
      <div className='message-stack-wrapper'>
        {
          this.props.messages.map( (messageData,i) => {
            return <Message message={messageData} key={i}/>
          })
        }
      </div>
    )
  }
}

class Message extends Component {
  constructor(props){
    super(props);
    this.state = {
      fade:''
    }
  }
  setSelfDestructTimer(){
    setTimeout(()=>{
      this.setState({fade:'fade-out'})
      setTimeout(()=>{
        const { dispatch } = this.props
        dispatch(REMOVE_MESSAGE({id:this.props.message.id}))
      },400)
    },this.props.message.duration)
  }
  componentDidMount(){
    this.setSelfDestructTimer();
  }
  render(){
    return(
      <div class={`ui-message ${this.props.message.type}-message ${this.state.fade}`}>
        { this.props.message.text }
      </div>
    )
  }
}

const mapState = (state) =>{
  return { messages:state.ui.messages.slice() };
}
Message = connect()(Message)
export default connect(mapState)(MessageStack)
