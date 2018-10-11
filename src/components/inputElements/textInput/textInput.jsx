import React from 'react';

export default class TextInput extends React.Component{
  constructor(props) {
      super(props);
      this.state = {value: this.props.text};
      if(props.type === 'percentage'){
        this.state = {value: this.props.text + '%'};
      }

      this.handleChange = this.handleChange.bind(this);
      this.keyPress = this.keyPress.bind(this);
    }

    componentWillReceiveProps(nextProps){
      this.setState({value:nextProps.text});
    }

    handleChange(event) {
      this.setState({value: event.target.value});
      if(this.onChangeSet()){
        this.props.onChange(event.target.value,this.props.title,false);
      }
    }

    handleBlur(){
      if(this.props.type === 'percentage'){
        this.setState({value:this.state.value + '%'});
      }
      if(this.onChangeSet()){
        this.props.onChange(this.state.value,this.props.title,true);
      }
    }

    onChangeSet(){
      return this.props.onChange && typeof this.props.onChange === 'function'
    }

    keyPress(e){
      if(e.key === 'Enter'){
        e.currentTarget.blur();
      }
    }

    render() {
      return (
        <div className='text-input' >
          <input type={this.props.type} onBlur={this.handleBlur.bind(this)} value={this.state.value} onChange={this.handleChange} tabIndex='0' onKeyPress={this.keyPress}/>
          {this.props.noTitle ? null :   <div className='text-input-title'>{this.props.title}</div>}
        </div>
      );
    }
}
