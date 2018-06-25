import React from 'react'


export default class TopBar extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      windowName : this.props.windowName
    }
  }

  render(){
    return (
      <div className='top-bar'>

      </div>
    )
  }
}
