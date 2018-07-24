import React from 'react';
import Dropzone from 'react-dropzone';
import JSZip from 'jszip';
import { connect } from 'react-redux'
import { UPLOAD_SKETCH, UPLOAD_IMAGE } from '../../redux/actions';

class DropzoneContainer extends React.Component {
  constructor() {
    super();
    this.state = { files: []};
    this.style = {
      normal: {
        width: '100%',
        height: '100%',
        display: 'block',
        transition: 'all .4s'
      },
      active: {
        border: '3px solid #33226f'
      },
      accept: {
        border: '3px solid #27ff6f'
      }
    };
  }

  onDrop(files) {
    const { dispatch } = this.props
    files.map(curFile => {
      JSZip.loadAsync(curFile).then(zip => {
        Object.keys(zip.files).forEach(filename => {
          let file = zip.files[filename]
          if (filename.includes('.png') && filename.includes('images/')){
            file.async('base64').then(imageData => {
              dispatch(UPLOAD_IMAGE({filename,imageData}));
            });
          }
          if (filename.includes('.json') && filename.includes('pages/')) {
            file.async('string').then(fileData => {
              dispatch(UPLOAD_SKETCH(JSON.parse(fileData)));
            });
          }
        });

      });
      return curFile
    });



  }

  render() {
    return (
      <div className='dropzone-container'>
        <div className='dropzone'>
          <Dropzone
            disableClick={true}
            onDrop={this.onDrop.bind(this)}
            style={this.style.normal}
            activeStyle={this.style.active}
            acceptStyle={this.style.accept}>
            {this.props.children}
          </Dropzone>
        </div>
      </div>
    );
  }
}

export default connect()(DropzoneContainer);
