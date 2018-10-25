import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';

class PropCardWrapper extends React.Component{
  constructor(props){
    super(props);
    this.state = {
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
    let isDisabled = this.state.enabled ? '' : 'disabled-card'
    let id = this.props.title.toLowerCase().split(' ').join('-');
    return(
      <div className={`prop-card ${isHalf} ${isDisabled}`} id={`card-${id}`}>
        <div className='prop-card-header'>
          {this.props.title}
          <Checkbox
            checked={this.state.enabled}
            value={this.props.title}
            onChange={this.onCheckChange}
            />
        </div>
        <div className='prop-card-body'>{this.props.children}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {pages: state.present.newAssets}
}


export default PropCardWrapper
