import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { DropContainer, UploadMessage } from "./styledUpload.js";

export default class Upload extends Component {

    renderDragMessage(isDragActive, isDragReject) {
        if (!isDragActive) {
            return <UploadMessage className={'m-0'}>Agregar Archivo</UploadMessage>;
        }

        if (isDragReject) {
            return <UploadMessage type="error" className={'m-0'}>Archivo no soportado</UploadMessage>;
        }

        return <UploadMessage type="success" className={'m-0 drag-file-style'}>Suelte los archivos aqui</UploadMessage>;
    };

    render() {

        const { onUpload } = this.props;

        return (
            <Dropzone accept={this.props.accept} onDropAccepted={onUpload}>
                {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                    <DropContainer
                        {...getRootProps()}
                        isDragActive={isDragActive}
                        isDragReject={isDragReject}
                    >
                        <input {...getInputProps()} className='bg-white' />
                        {this.renderDragMessage(isDragActive, isDragReject)}
                    </DropContainer>
                )}
            </Dropzone>
        );
    }
}

Upload.defaultProps = {
    accept: 'image/*,.pdf,.doc,.docx,.mp4,audio/*'
};
