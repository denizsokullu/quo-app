import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getState } from 'quo-redux/state';
import actions from 'quo-redux/actions';

import { Card, DropdownCard } from 'ui-components/cards';
import { ButtonCore } from 'ui-components/buttons/buttons';

const trigger = (id, text, actions) => ({ id, text, actions })
const propChange = (id,text,props) => ({ id, text, props })
const getText = obj => _.mapValues(obj, o => o.text)

class LinksTab extends Component {

  data = {
    defaultTrigger: 'hover',
    triggers: {
      hover: trigger('hover','Hover', { enables:['onMouseEnter'], disables:['onMouseLeave'] }),
      press: trigger('press','Press', { enables:['onMouseDown'], disables:['onMouseUp'] }),
      click: trigger('click','Click', { enables:['onFocus'], disables:['onBlur'] })
    },
    defaultPropChange: 'appears',
    propChanges: {
      appears: propChange('appears','Appears(red)', { fill:{r:255,g:0,b:0,a:1} }),
      slidesIn: propChange('slidesIn','Slides In(green)', { fill:{r:0,g:255,b:0,a:1} }),
      pageChange: propChange('pageChange','Page Change(blue)', { fill:{r:0,g:0,b:255,a:1} })
    }
  }

  componentDidMount(){
    let { actions } = this.data.triggers[this.data.defaultTrigger];
    let { props } = this.data.propChanges[this.data.defaultPropChange];
    this.updateLinkBuilder({ ...actions, props})
  }

  createLink = () => {
    const { dispatch } = this.props;
    dispatch(actions.CREATE_LINK());
  }

  updateLinkBuilder = (data) => {
    const { dispatch } = this.props;
    dispatch(actions.UPDATE_LINK_BUILDER_DATA({ ...data }));
  }

  render(){
    const data = this.data;
    console.log(data);
    return (
      <div className='links-tab-wrapper'>
      
        <Card title='Primary Element'>
          { this.props.links.source ? this.props.links.source : 'Source not selected' }
        </Card>

        {/* Triggers */}
        <DropdownCard
          title='Action'
          defaultValue={data.defaultTrigger}
          options={getText(data.triggers)}
          onChange={(key)=>{
            let { actions } = data.triggers[key];
            this.updateLinkBuilder({ ...actions });
          }}
        />

        <Card title='Linked Element'>
          { this.props.links.target ? this.props.links.target : 'Target not selected' }
        </Card>

        {/* Property Changes */}
        <DropdownCard
          title='Property Change'
          defaultValue={data.defaultPropChange}
          options={getText(data.propChanges)}
          onChange={(key)=>{
            let { props } = data.propChanges[key]
            this.updateLinkBuilder({ props })
          }}
        />

        <ButtonCore title='Create Link' onClick={this.createLink}/>
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
