import React from 'react'

export default class ClickFrame extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className = 'clickFrame'>
        <div className ='click-box' id='click-box-1'></div>
        <div className ='click-box' id='click-box-2'></div>
        <div className ='click-box' id='click-box-3'></div>
        <div className ='click-box' id='click-box-4'></div>
        <div className ='click-box' id='click-box-5'></div>
        <div className ='click-box' id='click-box-6'></div>
        <div className ='click-box' id='click-box-7'></div>
        <div className ='click-box' id='click-box-8'></div>
      </div>
    )
  }
}
