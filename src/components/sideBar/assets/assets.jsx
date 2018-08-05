import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayerCard } from '../../styleCard/styleCard';
import _ from 'underscore';

import HorizontalOptionGroup from '../../inputElements/horizontalOptionGroup';
import { ADD_MESSAGE } from '../../../redux/actions';

class AssetsTab extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentTab:'static'
    }
    this.updateTab = this.updateTab.bind(this)
  }
  updateTab(newTab){
    this.setState({currentTab:newTab})
  }

  render(){
    return (
      <div className='assets-tab-wrapper'>
        <HorizontalOptionGroup
          options={
            [
              {text:'Static',callback:()=>{this.updateTab('static')}},
              {text:'Reactive',callback:()=>{this.updateTab('reactive')}}
            ]
          }
        />
        {
          this.state.currentTab === 'static'
          ?
          <AssetsViewer assets={this.props.assets} components={this.props.components}/>
          :
          null
        }
      </div>
    )
  }
}

class AssetPreview extends Component {
  constructor(props){
    super(props);
    this.addAssetToEditor = this.addAssetToEditor.bind(this);
  }
  addAssetToEditor(){
    const { dispatch } = this.props;
    dispatch(ADD_MESSAGE({text:'Added component',type:'status',duration:2000}))
  }
  render(){
    return (
      <div className={`asset-preview-wrapper ${this.props.filetype}-asset`} onDoubleClick={this.addAssetToEditor}>
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
    //find all the artboards
    let artboards = this.props.assets[this.state.selected.id].layers;
    //search all the first depth components
    let firstDepthComponents = Object.keys(artboards).map(artboardId=>{
      return artboards[artboardId].components
    }).reduce((acc, val) => {return {...acc,...val}},[]);
    return (
        !_.isEmpty(firstDepthComponents) ?
          <div className='asset-preview-table'>
            {
              Object.keys(firstDepthComponents).map((o,i)=>{
                let component = firstDepthComponents[o]
                return <AssetPreview key={i} filetype='sketch' title={`${component.name}`}/>
              })
            }
          </div>
        :
         <div className='no-assets'>
           No artboards with assets found
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
            this.state.selected ? this.renderFirstDepthComponents() : null
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
AssetPreview = connect()(AssetPreview)
const mapStateToProps = (state) => {
  return {
    assets:state.domain.assets,
    components:state.domain.components
  }
}

export default connect(mapStateToProps)(AssetsTab);
