import React, { Component } from 'react';

import { connect } from 'react-redux';
import actions from '../../redux/actions';
import { getState } from '../../redux/state';


class MessageStack extends Component{
  render(){
    return(
      <div className='message-stack-wrapper'>
        {
          this.props.messages.map( (messageData,i) => {
            return <Message message={messageData} key={messageData.id}/>
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
      this.setState({fade:'fade-out'});
      setTimeout(()=>{
        const { dispatch } = this.props
        dispatch(actions.REMOVE_MESSAGE({id:this.props.message.id}))
      },400)
    }, this.props.message.duration)
  }
  
  componentWillMount(){
    this.setSelfDestructTimer();
  }

  render(){
    return(
      <div className={`ui-message ${this.props.message.type}-message ${this.state.fade}`}>
        { this.props.message.text }
      </div>
    )
  }

}

const mapState = (state) =>{
  return { messages: getState(state,'ui').messages };
}

Message = connect()(Message)

export default connect(mapState)(MessageStack)
