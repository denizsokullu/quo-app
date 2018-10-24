import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fSafe, bool2s } from 'utils'; 
import { ButtonCore } from 'ui-components/buttons/buttons';
import Card from './Card';
import _ from 'lodash';

export default class DropdownCard extends Component {

    static propTypes = {
      title:PropTypes.string.isRequired,
      disabled:PropTypes.bool,
      collapsed:PropTypes.bool,
      icon:PropTypes.element,
      defaultValue:PropTypes.string.isRequired,
      options: PropTypes.objectOf(PropTypes.string),
      onChange:PropTypes.func,
    }
  
    constructor(props){
      super(props);
      this.state = {
        selected: this.props.defaultValue,
        dropdownVisible: false,
      }
    }
  
    updateSelected = (id) => {
      this.setState({selected: id});
      fSafe(this.props.onChange, id);
    }
  
    updateDropdownVisibility = (value) => {
      if(value) this.setState({dropdownVisible:value})
      this.setState({dropdownVisible: !this.state.dropdownVisible})
    }
  
    renderDropdown (){
      return (
        <ul>
        { _.keys(this.props.options).map(((id)=>{
          let selected = this.state.selected === id ? 'selected' : '';
          return(
            <li className={selected} key={id} onClick={()=>{
              this.updateSelected(id)
              this.updateDropdownVisibility(false)
            }}>
              {this.props.options[id]}
            </li>
          )}))
        }
      </ul>
      )
    }
  
    render(){
      return (
        <React.Fragment>
        <Card { ...this.props } className='dropdown-card'>
          <div className='dropdown-selected' onClick={this.updateDropdownVisibility}>
              {this.props.options[this.state.selected]}
            </div>
        </Card>
        {
          this.state.dropdownVisible ?
          <div className='card-dropdown-options-wrapper'>
            { this.renderDropdown() }
            <ButtonCore title='Cancel' onClick={() => {this.updateDropdownVisibility(false)}}/>
          </div> : null
        }
        </React.Fragment>
      )
    }
  }