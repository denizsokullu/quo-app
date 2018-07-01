import React from 'react';
import { connect } from 'react-redux';



class PreviewLink extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pageId : this.props.pageId,
      componentId : this.props.id,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({component:nextProps.component});
  }

  render(){
    return(<p> This is the Preview Link {this.state.component.id}</p>)
  }
}

function mapStateToProps(state,ownProps){
    let component = state.present.newAssets[ownProps.pageId].components[ownProps.componentId]
    return ({
      component:component
    });
}

export default connect(mapStateToProps)(PreviewLink);


// /p/C03346FF-82E0-4926-89F2-202F119F7D8D/E92A0DF7-FC86-4747-A089-3DDA40683D16
