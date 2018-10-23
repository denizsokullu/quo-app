import React from 'react'
import reactCSS from 'reactcss'


class ColorPicker extends React.Component {

  render() {
    const styles = reactCSS({
      'default': {
        color: {
          width: '16px',
          height: '16px',
          borderRadius: '2px',
          boxShadow:'0 2px 4px 0 rgba(0,0,0,.5)',
          background: `rgba(${ this.props.color.r }, ${ this.props.color.g }, ${ this.props.color.b }, ${ this.props.color.a })`,
        },
        container: {
          display:'inline-block',
          marginRight:'1rem',
        },
        swatch: {
          borderRadius: '1px',
          display: 'inline-block',
          cursor: 'pointer',
        }
      },
    });

    return (
      <div style={ styles.container }>
        <div style={ styles.swatch } onClick={ this.props.handleClick } className='color-picker-swatch'>
          <div style={ styles.color } />
        </div>
        <div className='color-picker-title'>
          {this.props.title}
        </div>
      </div>
    )
  }
}

export default ColorPicker
