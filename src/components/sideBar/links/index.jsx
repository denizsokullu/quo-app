import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getState } from 'quo-redux/state';
import actions from 'quo-redux/actions';

import { Card, DropdownCard } from 'ui-components/card';
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
  render(){
    const actionValues = ['None','Click(Tap)','Hover','Scrolling in View','Page load','Page scrolled','Mouse moves in viewport']
    const actionLineIndices = [0,3]
    const action2Values = ['None','Appears','Slides In','Page Change']
    const action2LineIndices = [0]
    return (
      <div className='links-tab-wrapper'>
        <Card title='Primary Element'>
          { this.props.links.source ? this.props.links.source : 'Source not selected' }
        </Card>
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
        <Card title='Linked Element'>
          { this.props.links.target ? this.props.links.target : 'Target not selected' }
        </Card>
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
