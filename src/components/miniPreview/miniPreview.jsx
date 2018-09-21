import React from 'react';

import {connect} from 'react-redux';

import PreviewComponent from '../previewComponent/previewComponent';

//dock back(flip this)
// import TabIcon from 'material-ui-icons/Tab';

//dock out
import PictureInPictureAltIcon from 'material-ui-icons/PictureInPictureAlt';

//minimize
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

//maximize
import ExpandLessIcon from 'material-ui-icons/ExpandLess';

//Share
import ReplyIcon from 'material-ui-icons/Reply';

import { push } from 'react-router-redux'

import { Helpers } from '../../parser';


class MiniPreview extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isMinimized: false,
      docked:true,
      component:props.selection,
      currentProject:props.currentProject,
      currentPage:props.currentPage
    };
    this.handleMinimizeClick = this.handleMinimizeClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({component:nextProps.selection,
                   currentProject:nextProps.currentProject,
                   currentPage:nextProps.currentPage});
  }

  handleMinimizeClick() {
    this.setState(prevState => ({
      isMinimized: !prevState.isMinimized
    }));
  }
  renderPreviewComponent(){
    return (
      <PreviewComponent
        id={this.state.component}
        component={this.state.component}
        componentTree={this.props.componentTree}
      />)
  }

  openInNewTab(url) {
    window.open(url, "_blank");
  }

  render() {
    let prefix = 'mini-prev';
    let minimized = this.state.isMinimized ? 'minimized' : '';
    return (
      <div className={`${prefix}-wrapper`}>
        <div className={`${prefix}-container ${minimized}`}>
          <div className={`${prefix}-header`}>
            preview
            <span className='middle-icon' onClick={this.handleMinimizeClick}>
              {this.state.isMinimized ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
            </span>
            <span className='right-side-icons'>
              <span className='flip'>
                <ReplyIcon onClick={()=>{this.openInNewTab(`http://localhost:3000/p/39F50ACC-9E48-4F8E-976C-9C33F2D4B850/46367B6D-A7F5-4B0D-A456-03F90024D9F3`)}}/>
              </span>

              <PictureInPictureAltIcon/>
            </span>
          </div>
          <div className={`${prefix}-body`}>
            {this.renderPreviewComponent()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){

    let component = state.present.newAssets[state.present.currentPage].components[state.present.newSelection]
    let componentTree = Helpers.findComponentTree(component.id,state.present.newAssets[state.present.currentPage]);

    return ({
      selection:component,
      currentProject:state.present.currentProject,
      currentPage:state.present.currentPage,
      componentTree:componentTree,
    });
}

export default connect(mapStateToProps)(MiniPreview);
