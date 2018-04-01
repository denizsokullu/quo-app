import React from 'react';
import Checkbox from 'material-ui/Checkbox';

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


class LayerCard extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    let isHalf = this.props.half ? 'half-width' : ''
    let id = this.props.title.toLowerCase().split(' ').join('-');
    return(
      <div className={`layer-card ${isHalf}`} id={`card-${id}`}>
        <div className='style-card-header'>
          {this.props.title}
        </div>
        <div className='style-card-body layer-card-body'>{this.props.children}</div>
      </div>
    )
  }
}

export { StyleCard, LayerCard }
