import React from 'react';
import { connect } from 'react-redux';
import { RETRIEVE_COMPONENT } from '../../redux/actions';
import PreviewComponent from '../previewComponent/previewComponent';

class PreviewLink extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      // pageId : this.props.pageId,
      // componentId : this.props.id,
      // projectId: this.props.projectId
      loading:true
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({component:nextProps.component,loading:nextProps.loading},()=>{console.log(this.state)});
    console.log(nextProps);
  }

  componentDidMount(){
    const { dispatch } = this.props;
    console.log(this.props.projectId,this.props.pageId,this.props.id);
    dispatch(RETRIEVE_COMPONENT(this.props.projectId,this.props.pageId,this.props.id));
  }

  render(){
    return(
      <div>
        {
          this.state.loading
          ?
          <p style={{color:'white'}}>Loading</p>
          :
          this.state.component
          ?
          <PreviewComponent component={this.state.component}/>
          :
          <p style={{color:'white'}}>Component doesn't exist</p>
        }
      </div>
    )
  }
}

function mapStateToProps(state,ownProps){
    if(state.present.previewLink && state.present.previewLink.received) return {component:state.present.previewLink.component,loading:false}
    else return {}

}


export default connect(mapStateToProps)(PreviewLink);


// /p/C03346FF-82E0-4926-89F2-202F119F7D8D/E92A0DF7-FC86-4747-A089-3DDA40683D16
