import React from 'react';

export default class TextArea extends React.Component {
  componentDidMount(){
    this.refs.textarea.focus();
  }
  render(){
    return(
      <textarea ref='textarea'
        style={{...this.props.style,width:this.props.width,height:this.props.height}}

        onClick={
          (e)=>{
            console.log('clicked');
            e.stopPropagation();
          }
        }
        onMouseDown={
          (e)=>{
            e.stopPropagation();
          }
        }>
        {this.props.children}
      </textarea>
    )
  }
}
