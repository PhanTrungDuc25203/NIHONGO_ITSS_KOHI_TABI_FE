import React from 'react';
import { useDropzone } from 'react-dropzone';
import all_icons from '../../assets/Icons/all_icons';
import './ImageUpload.scss';

const ImageUpload = ({ onUpload, uploadedImage }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onUpload,
        multiple: false,
        accept: 'image/*'
    });

    return (
        <div className="image-upload" {...getRootProps()}>
            <input {...getInputProps()} />
            {uploadedImage ? (
                <div className="uploaded-image-container">
                    <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
                    <button className="upload-button">Upload Image</button>
                </div>
            ) : (
                <div className="upload-image-container">
                    <img src={all_icons.imageUp} alt="Upload Icon" />
                    <button className="upload-button">Upload Image</button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;