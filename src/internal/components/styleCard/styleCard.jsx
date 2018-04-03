import React from 'react';
import Checkbox from 'material-ui/Checkbox';

import AddBoxIcon from 'material-ui-icons/AddBox';

import { Page, Layers } from './layers/layers';

class StyleCard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      title:this.props.title,
      enabled:true
    }
    this.onCheckChange = this.onCheckChange.bind(this);
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  onCheckChange(e,checked){
    this.setState({enabled:checked});
  }

  render(){
    let isHalf = this.props.half ? 'half-width' : ''
    let isDisabled = this.state.enabled ? '' : 'disabled-style'
    let id = this.props.title.toLowerCase().split(' ').join('-');
    return(
      <div className={`style-card ${isHalf} ${isDisabled}`} id={`card-${id}`}>
        <div className='style-card-header'>
          {this.state.title}
          <Checkbox
            checked= {this.state.enabled}
            value= {this.props.title}
            onChange={this.onCheckChange}
            classes={{default:'check-default',}}/>
        </div>
        <div className='style-card-body'>{this.props.children}</div>
      </div>
    )
  }
}

class ContentPagesCard extends React.Component{
  constructor(props){
    super(props);
    this.title = 'Content Pages'
    this.state ={
      pages: [
        'page1',
        'page2',
        'page3',
        'page2'
      ]
    }
  }
  render(){
    let id = this.title.toLowerCase().split(' ').join('-');
    return(
      <div className={`layer-card content-pages`} id={`card-${id}`}>
        <div className='style-card-header layer-card-header'>
          <span className='left-side-header'>
            <span>{this.title}</span>
            <span className={`page-count ${this.state.pages.length >= 10 ? 'small' : 'large'}`}>
              {this.state.pages.length}
            </span></span>
          <span className='add-page'>
            <AddBoxIcon/>
          </span>
        </div>
        <div className='style-card-body layer-card-body'>
          {this.state.pages.map((page)=>{
            return <Page text={page}/>
          })}
        </div>
      </div>
    )
  }
}

class LayersCard extends React.Component{
  constructor(props){
    super(props);
    this.title = 'Element Layers'
    this.state ={
      pages: [
        'page1',
        'page2',
        'page3',
        'page2'
      ]
    }
  }
  render(){
    let id = this.title.toLowerCase().split(' ').join('-');
    return(
      <div className={`layer-card content-pages`} id={`card-${id}`}>
        <div className='style-card-header layer-card-header'>
          {this.title}
        </div>
        <div className='style-card-body layer-card-body'>
          <Layers/>
        </div>
      </div>
    )
  }
}

export { StyleCard, ContentPagesCard, LayersCard }
