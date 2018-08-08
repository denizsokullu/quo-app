import React from 'react';
import PropTypes from 'prop-types';


class ButtonCore extends React.Component {
    render() {
      return (
        <div className={this.props.className}>
          <button
            className='button-inner' onClick={this.props.onClick}>
            {this.props.title}
          </button>
        </div>
      );
    }
}

ButtonCore.propTypes = {
  title:PropTypes.string.isRequired,
  onClick:PropTypes.func,
}


export { ButtonCore }
