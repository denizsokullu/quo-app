import React from 'react';

export default class TextInput extends React.Component{
  constructor(props) {
      super(props);
      this.state = {value: this.props.text};
      this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps){
      this.setState({value:nextProps.text});
    }

    handleChange(event) {
      this.setState({value: event.target.value});
      if(this.props.onChange){
        this.props.onChange(event.target.value);
      }
    }

    keyPress(e){
      console.log(e.key);
      if(e.key === 'Enter'){
        e.currentTarget.blur();
      }
    }

    render() {
      return (
        <div className='text-input' >
          <input type={this.props.type} value={this.state.value} onChange={this.handleChange} tabIndex='0' onKeyPress={this.keyPress}/>
          {this.props.noTitle ? null :   <div className='text-input-title'>{this.props.title}</div>}

        </div>
      );
    }
}
