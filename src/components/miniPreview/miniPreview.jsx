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

class MiniPreview extends React.Component{

  constructor(props) {
    super(props);
    this.state = {isMinimized: false, docked:true, component:props.selection};
    this.handleMinimizeClick = this.handleMinimizeClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({component:nextProps.selection});
  }

  handleMinimizeClick() {
    this.setState(prevState => ({
      isMinimized: !prevState.isMinimized
    }));
  }
  renderPreviewComponent(){
    return (<PreviewComponent id={this.state.component} component={this.state.component}/>)
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
                <ReplyIcon/>
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
    return ({
      selection:component
    });
}

export default connect(mapStateToProps)(MiniPreview);
