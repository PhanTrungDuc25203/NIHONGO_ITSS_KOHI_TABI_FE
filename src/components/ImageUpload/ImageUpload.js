import React from 'react';
import { useDropzone } from 'react-dropzone';
import all_icons from '../../assets/Icons/all_icons';

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
                <>
                    <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
                    <button className="upload-button">Upload Image</button>
                </>
            ) : (
                <>
                    <img src={all_icons.imageUp} alt="Upload Icon" />
                    <button className="upload-button">Upload Image</button>
                </>
            )}
        </div>
    );
};

export default ImageUpload;
