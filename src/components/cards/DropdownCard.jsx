import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fSafe, bool2s } from 'utils'; 
import { ButtonCore } from 'ui-components/buttons/buttons';
import Card from './Card';

export default class DropdownCard extends Component {

    static propTypes = {
      title:PropTypes.string.isRequired,
      disabled:PropTypes.bool,
      collapsed:PropTypes.bool,
      icon:PropTypes.element,
      defaultValue:PropTypes.string.isRequired,
      options:PropTypes.arrayOf(PropTypes.string).isRequired,
      lineIndices:PropTypes.arrayOf(PropTypes.number),
      onChange:PropTypes.func,
    }
  
    static defaultProps = {
      lineIndices: [],
    }
  
    constructor(props){
      super(props);
      this.state = {
        selected:this.props.defaultValue,
        dropdownVisible:false,
      }
  
      this.updateSelected = this.updateSelected.bind(this);
      this.updateDropdownVisibility = this.updateDropdownVisibility.bind(this);
    }
  
    updateSelected(value){
      this.setState({selected:value});
      fSafe(this.props.onChange,value);
    }
  
    updateDropdownVisibility(value){
      if(value) this.setState({dropdownVisible:value})
      this.setState({dropdownVisible: !this.state.dropdownVisible})
    }
  
    renderDropdown (){
      return (
        <ul>
        { this.props.options.map((value,i)=>{
          let line = this.props.lineIndices.includes(i);
          let selected = this.state.selected === value ? 'selected' : '';
          return(
            <React.Fragment key={i}>
            <li className={selected} onClick={()=>{
              this.updateSelected(value)
              this.updateDropdownVisibility(false)
            }}>
              {value}
            </li>
            {
              line ? <li className='line'/> : null
            }
          </React.Fragment>
          )})
        }
      </ul>
      )
    }
  
    render(){
      return (
        <React.Fragment>
        <Card { ...this.props } className='dropdown-card'>
          <div className='dropdown-selected' onClick={this.updateDropdownVisibility}>
              {this.state.selected}
            </div>
        </Card>
        {
          this.state.dropdownVisible ?
          <div className='card-dropdown-options-wrapper'>
            { this.renderDropdown() }
            <ButtonCore title='Cancel' onClick={()=>{this.updateDropdownVisibility(false)}}/>
          </div> : null
        }
        </React.Fragment>
      )
    }
  }