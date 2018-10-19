import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import { getState } from 'quo-redux/state';
import actions from 'quo-redux/actions';
import { getComponentFromCurrentTab, getSelectionFirstID } from 'quo-redux/helpers';
import { VerticalListCard } from 'ui-components/cards';

import BackIcon from 'material-ui-icons/ArrowBack';
import CheckIcon from 'material-ui-icons/Check';


class ComponentStatesDropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dropdown:true,
      selected:{},
      values:[
        {text:'Hover',id:'1', icon:true},
        {text:'Pressed',id:'2', icon:true},
        {text:'Focus',id:'3', icon:true},
        {text:'Double Click',id:'4'}]
    }
  }

  onOptionClick(option){
    this.setState({dropdown:false,selected:option});
    const { dispatch } = this.props;
    dispatch(actions.STATE_MANAGER_UPDATE({
      current:option.text,
    }))
  }

  onBackIconClick(){
    this.setState({dropdown:true,selected:{}});
    const { dispatch } = this.props;
    dispatch(actions.STATE_MANAGER_UPDATE({
      current:'',
    }))
  }

  renderDropdown(){
    return (
      <VerticalListCard
        title='States'
        optionIcon={ <CheckIcon/> }
        optionIconOrientation='left'
        values={this.state.values}
        onOptionClick={this.onOptionClick.bind(this)}
      />
    )
  }
  renderSelectedView(){
    return (
      <div className='selected-state-wrapper'>
        <div className='back-icon' onClick={this.onBackIconClick.bind(this)}> <BackIcon/> </div>
        <div className='state-text'> { this.state.selected.text }</div>
      </div>

    )
  }
  render(){
    return ( this.state.dropdown ? this.renderDropdown() : this.renderSelectedView() )
  }
}

const mapStateToProps = (state) => {
  // stateOptions is the array of states that are being
  // composited to create the props of the component that is selected
  // let domain = getState(state,'domain');
  // let component = getComponentFromCurrentTab(domain.tabs,getSelectionFirstID(state));
  // if(!component) return { stateOptions:[] };
  // let stateModifiers = component.state.states.composite.modifiers;
  // let ids = (_.remove(_.keys(component.state.states),(e)=> e !== 'composite'))
  // let stateOptions = ids.map((id)=> component.state.states[id])
  // stateOptions = stateOptions.map(e => { return {
  //   text:e.title,
  //   selected:!!(stateModifiers.includes(e.id))
  // }})
  return {
    // stateOptions
    stateOptions: [
      {text:'state1',selected:false},
      {text:'state2',selected:false},
      {text:'state3',selected:false},
      {text:'state4',selected:false}
    ]
  }
}


export default connect(mapStateToProps)(ComponentStatesDropdown);
