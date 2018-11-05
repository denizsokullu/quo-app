import React from 'react';
import Dropzone from 'react-dropzone';
import JSZip from 'jszip';
import { connect } from 'react-redux';
import actions from 'quo-redux/actions';

class DropzoneContainer extends React.Component {
  constructor() {
    super();
    this.state = { files: [] };
    this.style = {
      normal: {
        width: '100%',
        height: '100%',
        display: 'block',
        transition: 'all .4s'
      }
    };
  }

  onDrop(files) {
    const { dispatch } = this.props;
    files.map(curFile => {
      const fileNameParts = curFile.name.split('.');
      const fileType = fileNameParts[fileNameParts.length - 1];
      switch (fileType) {
        case 'sketch':
          JSZip.loadAsync(curFile).then(zip => {
            Object.keys(zip.files).forEach(filename => {
              let file = zip.files[filename];
              if (filename.includes('.png') && filename.includes('images/')) {
                file.async('base64').then(imageData => {
                  dispatch(actions.UPLOAD_IMAGE({filename,imageData}));
                });
              }
              if (filename.includes('.json') && filename.includes('pages/')) {
                file.async('string').then(fileData => {
                  dispatch(actions.UPLOAD_SKETCH({ data: JSON.parse(fileData), filetype: 'sketch' }));
                });
              }
            });
          });
          break;
        case 'jpg':
        case 'png':
          const reader = new FileReader();
          reader.onload = () => {
              dispatch(actions.UPLOAD_IMAGE({ filetype: 'image', data: reader.result }))
          };
          reader.readAsDataURL(curFile);
          break;
        default:
          break;
      }
      return curFile;
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
            activeClassName='drag-active'
            activeStyle={this.style.active}
            acceptStyle={this.style.accept}
          >
            {this.props.children}
          </Dropzone>
        </div>
      </div>
    );
  }
}

export default connect()(DropzoneContainer);
