import React, { Component } from 'react';
import connect from 'react-redux';
import PropTypes from 'prop-types';

export default class HorizontalOptionGroup extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(option){
    if(option.callback) option.callback();
  }
  render(){
    return (
      this.props.options.length > 0 ? <div className='horizontal-option-group-wrapper'>
        {
          this.props.options.map((option,i)=>{
            return (
              <div
                className={`horizontal-option ${ option.selected ? 'selected' : ''}`}
                onClick={()=>{this.handleChange(option)}}
                key={i}>
                {option.text}
              </div>
            )
          })
        }
      </div> : null
    )
  }
}

HorizontalOptionGroup.defaultProps = {
  options: []
};

HorizontalOptionGroup.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    selected: PropTypes.bool,
  }))
}
