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
  constructor(props){
    super(props);
    this.updateLinkBuilder = this.updateLinkBuilder.bind(this);
    this.setData();
  }
  setData(){
    this.defaultTrigger = 0

    // change it to this later

    // this.triggers = {
    //   hover: {
    //     id: hover,
    //     name: 'Hover',
    //     actions:{
    //       enables:['onMouseEnter'],
    //       disables:['onMouseLeave'],
    //     }
    //   }
    // }
    
    this.triggers = [
      {
        name:'Hover',
        actions:{
          enables:['onMouseEnter'],
          disables:['onMouseLeave'],
        }
      },
      {
        name:'Press',
        actions: {
          enables:['onMouseDown'],
          disables:['onMouseUp'],
        }
      },
      {
        name:'Click',
        actions: {
          enables:['onFocus'],
          disables:['onBlur'],
        }
      },
    ]
    this.defaultProp = 0
    this.propChanges = [
      {
        name: 'Appears(red)',
        props: { fill:{r:255,g:0,b:0,a:1} },
      },
      {
        name: 'Slides In(green)',
        props: { fill:{r:0,g:255,b:0,a:1} },
      },
      {
        name: 'Page Change(blue)',
        props: { fill:{r:0,g:0,b:255,a:1} },
      },
    ]
  }

  componentDidMount(){
    let { actions } = this.triggers[this.defaultTrigger];
    let { props } = this.propChanges[this.defaultProp];
    console.log({...actions, props});
    this.updateLinkBuilder({...actions, props})
  }

  createLink(){
    const { dispatch } = this.props;
    dispatch(actions.CREATE_LINK());
  }

  updateLinkBuilder(data){
    const { dispatch } = this.props;
    dispatch(actions.UPDATE_LINK_BUILDER_DATA({ ...data }));
  }

  render(){
    return (
      <div className='links-tab-wrapper'>
      
        <Card title='Primary Element'>
          { this.props.links.source ? this.props.links.source : 'Source not selected' }
        </Card>

        <DropdownCard
          title='Action'
          defaultValue={this.triggers[this.defaultTrigger].name}
          options={ this.triggers.map(t => t.name) }
          onChange={(value)=>{
            let { actions } = this.triggers[_.findIndex(this.triggers,['name',value])];
            this.updateLinkBuilder({ ...actions });
          }}
        />

        <Card title='Linked Element'>
          { this.props.links.target ? this.props.links.target : 'Target not selected' }
        </Card>

        <DropdownCard
          title='Property Change'
          defaultValue={this.propChanges[this.defaultProp].name}
          options={this.propChanges.map( p => p.name)}
          onChange={(value)=>{
            const { dispatch } = this.props;
            let { props } = this.propChanges[_.findIndex(this.propChanges,['name',value])];
            this.updateLinkBuilder({ props })
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
