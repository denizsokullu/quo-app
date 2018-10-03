import React, { Component } from 'react';
import connect from 'react-redux';

export default class HorizontalOptionGroup extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected:undefined,
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(option,i){
    this.setState({selected:i});
    if(option.callback) option.callback();
  }
  render(){
    let selectedOptions = this.props.selectedOptions ? this.props.selectedOptions : [];
    console.log('selectedOptions',selectedOptions);
    return (
      <div className='horizontal-option-group-wrapper'>
        {
          this.props.options.map((option,i)=>{
            let isSelected = selectedOptions.includes(option.text) || (!this.state.selected && i === 0) || this.state.selected === i
            return (
              <div
                className={`horizontal-option ${ isSelected ? 'selected' : ''}`}
                onClick={()=>{this.handleChange(option,i)}}
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
