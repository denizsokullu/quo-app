import React from 'react'
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';

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
      let border = (parseInt(style.borderLeftWidth.slice(0,-2))+parseInt(style.borderRightWidth.slice(0,-2))) * this.state.scale

      this.setState({
        scale:(elDims.width - border) / nextProps.selection.frame.width
      })

    }
    else{
      this.setState({
        visible:false
      })
    }
  }


  render(){

    // return(
    //     // this.state.visible ?
    //     // <div className='selection-frame-wrapper' style={
    //     //   {
    //     //     left:`${this.state.position.x}px`,
    //     //     top:`${this.state.position.y}px`,
    //     //     width:`${this.state.size.w}px`,
    //     //     height:`${this.state.size.h}px`,
    //     //   }
    //     // }>
    //     //   <div className='selection-frame top left'></div>
    //     //   <div className='selection-frame top middle-w'></div>
    //     //   <div className='selection-frame top right'></div>
    //     //   <div className='selection-frame bottom left'></div>
    //     //   <div className='selection-frame bottom middle-w'></div>
    //     //   <div className='selection-frame bottom right'></div>
    //     //   <div className='selection-frame middle-h left'></div>
    //     //   <div className='selection-frame middle-h right'></div>
    //     // </div>
    //     // : null
    // )

    if(this.state.target){
      let style = { transform:`scale(${1/this.state.scale})`}
      return(
        ReactDOM.createPortal(

            this.state.visible ?
              <React.Fragment>
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
  if(state.present.currentPage){
    return {
      selection: state.present.newAssets[state.present.currentPage].components[state.present.newSelection]
    }
  }
  else{
    return {
      selection: state.present.newSelection
    }
  }
}

export default connect(mapStateToProps)(SelectionFrame);
