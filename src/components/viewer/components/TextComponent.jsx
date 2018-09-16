import React from 'react';
import CoreComponent from './CoreComponent';
import TextArea from '../../inputElements/dynamicTextArea';
import { connect } from 'react-redux';
import { COMPONENT_SELECT, TEXT_EDIT_TRIGGER, TEXT_STRING_UPDATE } from '../../../redux/actions';


class TextComponent extends CoreComponent{
  constructor(props){
    super(props);
    // let that = this;
    this.state.editMode = false;
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.newText = this.getText();
  }

  getColor(){
    let c = this.state.textData.color;
    return (
      `rgba(${c.r},${c.g},${c.b},${c.a})`
    )
  }

  getFontFamily(){
    return (
      `"${this.state.textData.fontName}", sans-serif`
    )
  }

  handleDoubleClick(){
    this.setState({editMode:true});
    this.props.changeDrag(false);
  }

  deselect(){
    this.setState({editMode:false},()=>{
      this.dispatchTextStringUpdate(this.newText)
      this.props.changeDrag(true);
    })
  }

  dispatchTextStringUpdate(string){
    const { dispatch } = this.props;
    dispatch(TEXT_STRING_UPDATE({textString:string,id:this.state.data.id}));
  }

  getText(){
    let editStates = this.state.data.editStates;
    return editStates[this.props.editState].textString
  }

  textUpdate(str){
    this.newText = str
  }

  selectThis(){
    const { dispatch } = this.props;
    dispatch(COMPONENT_SELECT(this.state.data.id));
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selection !== this.state.data.id && this.state.editMode){
      this.setState({editMode:false},()=>{
        this.dispatchTextStringUpdate(this.newText)
        this.props.changeDrag(true);
        this.selectThis();
      })
    }
    if(!this.state.editMode) this.setState({data:nextProps.data});

  }

  //things that change(width,height,string)

  renderTextElement(){
    if(this.state.editMode && this.props.selection === this.state.data.id){
      let editStates = this.state.data.editStates;
      let style = editStates[this.props.editState].style
      let string = editStates[this.props.editState].textString
      let w = style.width;
      let h = style.height;
      return (
        <span className='text-outer edit-mode'>
          <TextArea className='text-inner'
            width={w}
            height={h}
            value={string}
            deselect={this.deselect.bind(this)}
            textUpdate={this.textUpdate.bind(this)}
            style={{
                fontFamily:style.fontFamily,
                fontSize:style.fontSize,
              }
            }
          />
        </span>
      )
    }
    else{
      return(
        <span className='text-outer'
          onDoubleClick={this.handleDoubleClick}
        >
          <p className='text-inner'>
            {this.getText()}
          </p>
        </span>
      )
    }
  }


  render(){
    return ( this.renderTextElement() )
  }
}

function mapStateToProps(state){
  return {
    selection:state.present.selection,
    editState:state.present.editState,
  }
}

TextComponent = connect(mapStateToProps)(TextComponent);

export default TextComponent
