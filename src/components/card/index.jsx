import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonCore } from '../buttons/buttons';

//disabled
//checkbox

class Card extends Component{
  constructor(props){
    super(props);
    this.state = {
      disabled:this.props.disabled ? this.props.disabled : false,
      collapsed:this.props.collapsed ? this.props.collapsed : false,
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.disabled) this.setState({disabled:nextProps.disabled})
    if(nextProps.collapsed) this.setState({collapsed:nextProps.collapsed})
  }

  render(){
    let disabled = this.state.disabled ? 'disabled-style' : ''
    let collapsed = this.state.collapsed ? 'collapsed-style' : ''
    return(
      <div className={`card ${disabled} ${collapsed}`}>
        <div className='card-header'>
          {this.props.title}
          {this.props.icon ? this.props.icon : null }
        </div>
        <div className='card-body'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

class VerticalListCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      disabled:this.props.disabled ? this.props.disabled : false,
      collapsed:this.props.collapsed ? this.props.collapsed : false,
    }
    this.onHeaderIconClick = this.onHeaderIconClick.bind(this);
    this.onOptionIconClick = this.onOptionIconClick.bind(this);
  }

  onHeaderIconClick(){
    if(this.props.onHeaderIconClick){
      this.props.onHeaderIconClick()
    }
  }

  onOptionIconClick(val){
    if(this.props.onOptionIconClick){
      this.props.onOptionIconClick(val)
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({disabled:nextProps.disabled})
    this.setState({collapsed:nextProps.collapsed})
  }

  render(){
    let disabled = this.state.disabled ? 'disabled-style' : ''
    let collapsed = this.state.collapsed ? 'collapsed-style' : ''

    return(
      <div className={`card vertical-list-card${disabled} ${collapsed}`}>
        <div className='card-header'>
          {this.props.title}
          {
            this.props.headerIcon
            ?
            <div onClick={this.onHeaderIconClick}>
              { this.props.headerIcon }
            </div>
             :
             null
           }
        </div>
        <div className='card-body'>
          <div className='card-vertical-list-wrapper'>
            <ul>
              {
                this.props.values.map((v,i)=>{
                  let selected = '';
                  if(v.id === this.props.selected){
                    selected = 'selected'
                  }
                  return (
                    <li className={`vertical-list-option ${selected}`}
                        onClick={()=>{this.props.onOptionClick(v)}} key={v.id}>
                      {v.name}
                      {this.props.optionIcon
                        ?
                        <div onClick={()=>{ this.onOptionIconClick(v)}}>
                          {this.props.optionIcon}
                        </div>
                        :
                        null
                      }
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

class DropdownCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      disabled:this.props.disabled ? this.props.disabled : false,
      collapsed:this.props.collapsed ? this.props.collapsed : false,
      selected:this.props.defaultValue,
      dropdownVisible:false,
    }

    this.updateSelected = this.updateSelected.bind(this);
    this.updateDropdownVisibility = this.updateDropdownVisibility.bind(this);

  }

  componentWillReceiveProps(nextProps){
    if(nextProps.disabled) this.setState({disabled:nextProps.disabled})
    if(nextProps.collapsed) this.setState({collapsed:nextProps.collapsed})
  }

  updateSelected(value){
    this.setState({selected:value});
    if(this.props.onChange){
      this.props.onChange(value)
    }
  }

  updateDropdownVisibility(value){
    if(value) this.setState({dropdownVisible:value})
    this.setState({dropdownVisible:!this.state.dropdownVisible})
  }

  render(){
    let disabled = this.state.disabled ? 'disabled-style' : ''
    let collapsed = this.state.collapsed ? 'collapsed-style' : ''
    return (
      <React.Fragment>
      <div className={`card dropdown-card ${disabled}`}>
        <div className='card-header'>
          {this.props.title}
          {this.props.icon ? this.props.icon : null }
        </div>
        <div className='card-body dropdown-card-body'>
          <div className='dropdown-selected' onClick={this.updateDropdownVisibility}>
            {this.state.selected}
          </div>
        </div>
      </div>
      {
        this.state.dropdownVisible ?
        <div className='card-dropdown-options-wrapper'>
          <ul>
            { this.props.options.map((value,i)=>{
              let line = this.props.lineIndices.includes(i);
              let selected = this.state.selected === value ? 'selected' : '';
              return(
                <React.Fragment key={i}>
                <li className={selected}onClick={()=>{
                  this.updateSelected(value)
                  this.updateDropdownVisibility(false)
                }}>
                  {value}
                </li>
                {
                  line ?
                  <li className='line'></li>
                   : null
                }
              </React.Fragment>
              )})
            }
          </ul>
          <ButtonCore title='Cancel' onClick={()=>{this.updateDropdownVisibility(false)}}/>
        </div> : null
      }
      </React.Fragment>
    )
  }
}

Card.propTypes = {
  title:PropTypes.string.isRequired,
  disabled:PropTypes.bool,
  collapsed:PropTypes.bool,
  icon:PropTypes.element,
}

VerticalListCard.propTypes = {
  //core props
  title:PropTypes.string.isRequired,
  disabled:PropTypes.bool,
  collapsed:PropTypes.bool,
  //data
  headerIcon:PropTypes.node,
  optionIcon:PropTypes.node,
  values:PropTypes.arrayOf(PropTypes.object).isRequired,
  selected:PropTypes.string.isRequired,
  //funcs
  onHeaderIconClick:PropTypes.func,
  onOptionClick:PropTypes.func.isRequired,
  onOptionIconClick:PropTypes.func,
}

DropdownCard.propTypes = {
  title:PropTypes.string.isRequired,
  disabled:PropTypes.bool,
  collapsed:PropTypes.bool,
  icon:PropTypes.element,
  defaultValue:PropTypes.string.isRequired,
  options:PropTypes.arrayOf(PropTypes.string).isRequired,
  lineIndices:PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange:PropTypes.func,
}

export { Card, VerticalListCard, DropdownCard }
