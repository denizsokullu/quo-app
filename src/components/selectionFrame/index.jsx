import React from 'react'
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import { getState } from '../../redux/state';

class SelectionFrame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      target:undefined,
      position: {
        x:0,
        y:0,
      },
      size:{
        w:0,
        h:0,
      },
      scale:1
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selection){
      let el = document.getElementById(nextProps.selection.id);

      this.setState({
        visible:true,
        target:el,
      })

    }
    if(nextProps.scale && nextProps.selection){

      let el = document.getElementById(nextProps.selection.id);
      let elDims = el.getBoundingClientRect();
      let style = window.getComputedStyle(el);

      // let border = (parseInt(style.borderLeftWidth.slice(0,-2))+parseInt(style.borderRightWidth.slice(0,-2))) * this.state.scale;

      let styleWidth = style.width.slice(0,-2);
      // - border;
      let computedWidth = elDims.width

      this.setState({
        scale: computedWidth / styleWidth
      })

    }
    else{
      this.setState({
        visible:false
      })
    }
  }


  render(){

    if(this.state.target){

      let style = { transform:`scale(${1/this.state.scale})` }
      let lineStyleH = { transform: `scale(1,${1/this.state.scale})`}
      let lineStyleV = { transform: `scale(${1/this.state.scale},1)`}
      return(
        ReactDOM.createPortal(

            this.state.visible ?
              <React.Fragment>
                <div className='selection-line top h' style={lineStyleH}></div>
                <div className='selection-line bottom h' style={lineStyleH}></div>
                <div className='selection-line left v' style={lineStyleV}></div>
                <div className='selection-line right v' style={lineStyleV}></div>
                <div className='selection-frame top left' style={style}></div>
                <div className='selection-frame top middle-w' style={style}></div>
                <div className='selection-frame top right' style={style}></div>
                <div className='selection-frame bottom left' style={style}></div>
                <div className='selection-frame bottom middle-w' style={style}></div>
                <div className='selection-frame bottom right' style={style}></div>
                <div className='selection-frame middle-h left' style={style}></div>
                <div className='selection-frame middle-h right' style={style}></div>
             </React.Fragment>
              :
              null,
              this.state.target
        )
      )
    }
    else{
      return null
    }
  }
}


function mapStateToProps(state) {

  let app = getState(state,'app');

  //TODO connect the data correctly here to display the selection

  return {
    selection:app.selection
  }

  // if(state.present.currentPage){
  //   return {
  //     selection: state.app.selection
  //   }
  // }
  // else{
  //   return {
  //     selection: state.present.newSelection
  //   }
  // }
}

export default connect(mapStateToProps)(SelectionFrame);
