import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getState } from 'quo-redux/state';
import actions from 'quo-redux/actions';

import { Card, DropdownCard } from 'ui-components/cards';
import { ButtonCore } from 'ui-components/buttons/buttons';


import { ADD_MESSAGE } from '../../../redux/actions';

//structure of the right sidebar
//select source component
//select action that will connect them
//select target component
//

class LinksTab extends Component {
  createLink(){
    const { dispatch } = this.props;
    dispatch(actions.CREATE_LINK());
  }
  setActionTrigger(){
    const { dispatch } = this.props;
    // dispatch()
  }
  setPropChange(){

  }
  render(){

    const triggers = [
      {
        name:'Hover',
        triggers:'onMouseEnter',
        disables:'onMouseLeave',
      },
      {
        name:'Press',
        triggers:'onMouseDown',
        disables:'onMouseUp',
      },
      {
        name:'Click',
        triggers:'onFocus',
        disables:'onBlur',
      },
    ]

    const propChanges = [
      {
        name: 'Appears',
        state: { opacity: 1 },
      },
      {
        name: 'Slides In',
        state: { opacity: 1 },
      },
      {
        name: 'Page Change',
        state: { opacity: 1 },
      },
    ]

    return (
      <div className='links-tab-wrapper'>
      
        <Card title='Primary Element'>
          { this.props.links.source ? this.props.links.source : 'Source not selected' }
        </Card>

        <DropdownCard
          title='Action'
          defaultValue={triggers[0].name}
          options={ triggers.map(t => t.name) }
          onChange={(value)=>{
            const { dispatch } = this.props;
            let currentTrig = triggers[_.findIndex(triggers,['name',value])];
            dispatch(actions.ADD_MESSAGE({type:status, text: `Selected '${value}' as the option`,duration: 3000}))
          }}
        />

        <Card title='Linked Element'>
          { this.props.links.target ? this.props.links.target : 'Target not selected' }
        </Card>

        <DropdownCard
          title='Property Change'
          defaultValue={propChanges[0].name}
          options={propChanges.map( p => p.name)}
          onChange={(value)=>{
            const { dispatch } = this.props;
            let currentProp = propChanges[_.findIndex(propChanges,['name',value])];
            dispatch(actions.ADD_MESSAGE({type:status,text:`Selected '${value}' as the option`,duration:1500}))
          }}
        />
        <ButtonCore title='Create Link' onClick={this.createLink.bind(this)}/>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  let app = getState(state,'app');
  return { links: app.linkBuilder }
}
LinksTab = connect(mapStateToProps)(LinksTab);

export default LinksTab
