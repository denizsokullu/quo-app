import React from 'react';
import PropTypes from 'prop-types';


class ButtonCore extends React.Component {
  
  static propTypes = {
    title:PropTypes.string.isRequired,
    onClick:PropTypes.func,
    selected:PropTypes.bool,
  }

  static defaultProps = {
    selected: false
  }

  render() {
    let selected = this.props.selected ? 'selected' : ''
    return (
      <div className={this.props.className}>
        <button
          className={`button-inner ${selected}`} onClick={this.props.onClick}>
          {this.props.title}
        </button>
      </div>
    );
  }
}

export { ButtonCore }
