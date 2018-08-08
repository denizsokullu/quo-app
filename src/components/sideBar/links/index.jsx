import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, DropdownCard } from '../../card';

import { ADD_MESSAGE } from '../../../redux/actions';

//structure of the right sidebar
//select source component
//select action that will connect them
//select target component
//

class LinksTab extends Component {
  render(){
    const actionValues = ['None','Click(Tap)','Hover','Scrolling in View','Page load','Page scrolled','Mouse moves in viewport']
    const actionLineIndices = [0,3]
    const action2Values = ['None','Appears','Slides In','Page Change']
    const action2LineIndices = [0]
    return (
      <div className='links-tab-wrapper'>
        <Card collapsed title='Primary Element'/>
        <DropdownCard
          title='Action'
          defaultValue={actionValues[0]}
          options={actionValues}
          lineIndices={actionLineIndices}
          onChange={(value)=>{
            const { dispatch } = this.props;
            dispatch(ADD_MESSAGE({type:status,text:`Selected '${value}' as the option`,duration:6000}))
          }}
        />
        <Card collapsed title='Linked Element'/>
        <DropdownCard
          title='Action'
          defaultValue={action2Values[0]}
          options={action2Values}
          lineIndices={action2LineIndices}
          onChange={(value)=>{
            const { dispatch } = this.props;
            dispatch(ADD_MESSAGE({type:status,text:`Selected '${value}' as the option`,duration:1500}))
          }}
        />
      </div>
    )
  }
}

LinksTab = connect()(LinksTab);

export default LinksTab
