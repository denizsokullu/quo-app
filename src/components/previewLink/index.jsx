import React from 'react';
import { connect } from 'react-redux';
import { RETRIEVE_COMPONENT } from '../../redux/actions';
import PreviewComponent from '../previewComponent/previewComponent';

class PreviewLink extends React.Component{

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(RETRIEVE_COMPONENT(this.props.projectId,this.props.pageId,this.props.id));
  }

  render(){
    return(
      <div style={{width:'100vw',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
        {
          this.props.loading
          ?
          <p style={{color:'white'}}>Loading</p>
          :
          this.props.assets
          ?
          <PreviewComponent component={this.props.assets.components[this.props.id]} dim={{w:1200,h:800}} previewLink componentTree={this.props.assets}/>
          :
          <p style={{color:'white'}}>Component doesn't exist</p>
        }
      </div>
    )
  }
}

function mapStateToProps(state,ownProps){
    if(state.present.previewLink && state.present.previewLink.received) {
        return {assets:state.present.previewLink.assets,loading:false}
    }
    else{
      return { loading:true }
    }

}


export default connect(mapStateToProps)(PreviewLink);


// /p/C03346FF-82E0-4926-89F2-202F119F7D8D/E92A0DF7-FC86-4747-A089-3DDA40683D16
