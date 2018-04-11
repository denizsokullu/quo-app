import React from 'react'
import reactCSS from 'reactcss'


class ColorPicker extends React.Component {

  state = {
    displayColorPicker: false,
    color : this.props.color
  };

  componentWillReceiveProps(nextProps){
    this.setState({color:nextProps.color});
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '16px',
          height: '16px',
          borderRadius: '2px',
          boxShadow:'0 2px 4px 0 rgba(0,0,0,.5)',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        container: {
          display:'inline-block',
          marginRight:'1rem',
        },
        swatch: {
          // padding: '5px',
          // background: '#fff',
          borderRadius: '1px',
          // boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div style={ styles.container }>
        <div style={ styles.swatch } onClick={ this.props.handleClick } className='color-picker-swatch'>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
        </div> : null }
        <div className='color-picker-title'>
          {this.props.title}
        </div>
      </div>
    )
  }
}

export default ColorPicker
