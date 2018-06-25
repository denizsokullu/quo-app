import React from 'react';


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


export { ButtonCore }
