import React, { Component } from 'react';
import connect from 'react-redux';

export default class HorizontalOptionGroup extends Component {
  constructor(props){
    super(props);
    let selected;
    if(this.props.options && this.props.options.length > 0){
      selected = this.props.options[0]
    }
    this.state = {
      selected:selected,
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(option){
    this.setState({selected:option});
    if(option.callback) option.callback();
  }
  render(){
    return (
      <div className='horizontal-option-group-wrapper'>
        {
          this.props.options.map((option,i)=>{
            return (
              <div
                className={`horizontal-option ${option.text === this.state.selected.text ? 'selected' : ''}`}
                onClick={()=>{this.handleChange(option)}}
                key={i}>
                {option.text}
              </div>
            )
          })
        }
      </div>
    )
  }
}
