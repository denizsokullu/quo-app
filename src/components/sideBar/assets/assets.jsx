import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerCard } from '../../styleCard/styleCard';
import _ from 'underscore';

import HorizontalOptionGroup from '../../inputElements/horizontalOptionGroup';

class AssetsTab extends Component {
  constructor(props){
    super(props);
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps)
  }
  render(){
    return (
      <div className='assets-tab-wrapper'>
        <HorizontalOptionGroup
          options={
            [
              {text:'Static',callback:()=>{console.log('clicked static')}},
              {text:'Reactive',callback:()=>{console.log('clicked reactive')}}
            ]
          }
        />
        <AssetsViewer assets={this.props.assets} components={this.props.components}/>
      </div>
    )
  }
}

// class AssetRepresentation extends Component {
//   render(){
//     return (
//
//     )
//   }
// }

class AssetPreview extends Component {
  render(){
    return (
      <div className={`asset-preview-wrapper ${this.props.filetype}-asset`}>
        <div className='asset-preview-title'>{this.props.title}</div>
        <div className='asset-preview-image'></div>
      </div>
    )
  }
}

class AssetsViewer extends Component {
  constructor(props){
    super(props);
    let pages = this.assignPages(props.assets);
    let selected = undefined;
    if(pages.length > 0){
      selected = pages[0];
    }
    this.state = {
      pages:pages,
      selected:selected,
      fakeAssets:new Array(30).fill(0),
    }
    this.onPageChange = this.onPageChange.bind(this);
  }

  assignPages(pages){
    return Object.keys(pages).map( page =>{
      return { id:pages[page].id, name:pages[page].name }
    })
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.assets)
    if(!_.isEmpty(nextProps.assets)){
      let pages = this.assignPages(nextProps.assets);
      if(!this.state.selected) this.setState({selected:pages[0]})
      this.setState({pages:pages})
    }
  }

  onPageChange(page){
    this.setState({selected:page});
  }

  renderFirstDepthComponents(){
    //get the artboards,
    //turn the artboards into component arrays, flatten the component arrays.
    // this.props.assets[this.state.selected.id].map()
    return (
      <div className='asset-preview-table'>
        {
          this.state.fakeAssets.map((l,i)=>{
            return <AssetPreview filetype='sketch' title={'Sketch Object'+i}/>
          })
        }
      </div>
    )
  }

  render(){
    return (
      <div className='assets-library-wrapper'>
        <div className='card-header'>
          Sketch Pages
        </div>
        <div className='card-body'>
          {
            this.state.pages.map(page=>{
              return(
                <div className={`page ${page.id === this.state.selected.id ? 'selected' : ''}`} onClick={()=>{this.onPageChange(page)}}>{page.name}</div>
              )
            })
          }
        </div>
        <div className='assets-preview-wrapper'>
          {
            this.renderFirstDepthComponents()
          }
        </div>
      </div>
    )
  }
}

// class Pages extends React.Component{
//   render(){
//     let id = this.title.toLowerCase().split(' ').join('-');
//     return(
//       <div className={`layer-card`} id={`card-${id}`}>
//         <div className='style-card-header layer-card-header'>
//           {this.props.title}
//         </div>
//         <div className='style-card-body layer-card-body'>
//           {}
//         </div>
//       </div>
//     )
//   }
// }

const mapStateToProps = (state) => {
  return {
    assets:state.domain.assets,
    components:state.domain.components
  }
}

export default connect(mapStateToProps)(AssetsTab);
