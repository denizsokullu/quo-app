import React from 'react';

export default class ComponentStates extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      selected : 'None',
      states : ['None','Hover','Pressed','Focused'],
    }
    this.onClick = this.onClick.bind(this);
  }

  onClick(e){
    this.setState({selected : e.target.innerHTML});
  }

  render(){
    return(
      <div className='component-states-container'>
        {this.state.states.map((state)=>{
          let selected = this.state.selected === state ? 'selected' : '';
          return(
            <div className={`component-state-box component-state-${selected}`} onClick={this.onClick}>
              {state}
            </div>
          );
        })}
      </div>
    )
  }
}
