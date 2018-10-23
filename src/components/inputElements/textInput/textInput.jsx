import React from 'react';
import { fSafe } from 'utils';

export default class TextInput extends React.Component{
  constructor(props) {
      super(props);
      this.state = {value: this.props.text};

      this.suffix = '';
      if(props.type === 'percentage'){
        this.suffix = '%';
      }

      this.handleChange = this.handleChange.bind(this);
      this.keyPress = this.keyPress.bind(this);
    }

    componentWillReceiveProps(nextProps){
      this.setState({value:nextProps.text});
    }

    handleChange(event) {
      fSafe(this.props.onChange, event.target.value, this.props.title, false);
    }

    handleBlur(event){
      fSafe(this.props.onChange, event.target.value, this.props.title, true);
    }

    keyPress(e){
      if(e.key === 'Enter'){
        e.currentTarget.blur(e);
      }
    }

    render() {
      return (
        <div className='text-input' >
          <input type={this.props.type} 
                 onBlur={this.handleBlur.bind(this)} 
                 value={this.state.value} 
                 onChange={this.handleChange} 
                 tabIndex='0' 
                 onKeyPress={this.keyPress}/>
          {this.props.noTitle ? null :   <div className='text-input-title'>{this.props.title}</div>}
        </div>
      );
    }
}
