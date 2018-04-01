import React from 'react';
import { LayerCard } from '../styleCard'
import TextInput from '../../inputElements/textInput/textInput';

import CloseIcon from 'material-ui-icons/Close'


class ContentPagesCard extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      pages: [
        'page1',
        'page2',
        'page3'
      ]
    }
  }

  removePage(){

  }

  render(){
    return(
      <LayerCard title='Content Pages'>
        {this.state.pages.map((page)=>{
          return <Page text={page}/>
        })}
      </LayerCard>
    )
  }
}

class LayersCard extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      pages: [
        'page1',
        'page2',
        'page3'
      ]
    }
  }

  removePage(){

  }

  render(){
    return(
      <LayerCard title='Content Pages'>
        {this.state.pages.map((page)=>{
          return <Page text={page}/>
        })}
      </LayerCard>
    )
  }
}

class Page extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      text:this.props.text
    }
    this.onChange = this.onChange.bind(this);
  }
  onChange(newText){
    this.setState({text:newText});
  }
  render(){
    return (
      <div className='page-name'>
        <TextInput text={this.props.text} onChange={this.onChange} noTitle />
        <span onClick={this.props.removePage}>
          <CloseIcon/>
        </span>
      </div>
    )
  }



}

export { ContentPagesCard, LayersCard }
