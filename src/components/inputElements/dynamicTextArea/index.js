import React from 'react';

export default class TextArea extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value:this.props.value
    }
    this.handleSpecialKeyPresses = this.handleSpecialKeyPresses.bind(this)
  }

  componentDidMount(){
    this.refs.textarea.focus();
  }

  componentWillReceiveProps(nextProps){
    this.setState({value:nextProps.value});
  }

  onChange(e){
    this.setState({value:e.target.value})
    this.props.textUpdate(e.target.value);
  }

  handleSpecialKeyPresses(e){
    if(e.which === 27){
      this.props.deselect();
    }
    e.stopPropagation();
  }

  render(){
    return(
      <textarea
        ref='textarea'
        spellCheck="false"
        style={{...this.props.style,width:this.props.width,height:this.props.height}}
        onClick={
          (e)=>{
            e.stopPropagation();
          }
        }
        onMouseDown={
          (e)=>{
            e.stopPropagation();
          }
        }

        onKeyDown={this.handleSpecialKeyPresses}
        onKeyPress={this.handleSpecialKeyPresses}
        onKeyUp={this.handleSpecialKeyPresses}

        onChange={this.onChange.bind(this)}
        value={this.state.value}/>
    )
  }
}
