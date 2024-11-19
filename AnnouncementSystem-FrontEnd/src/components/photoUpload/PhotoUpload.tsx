import { useState } from 'react';
import { storage } from '../../services/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';

interface photoUploadProps {
    Image: (image: File | null) => void;
    isImage: (isImage: boolean) => void;
}

function PhotoUpload({ Image, isImage }) {    

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            Image(e.target.files[0]);
            isImage(true);
        }
    };



    return (
        <div className='flex flex-col justify-center items-center'>
            <h2 className='text-center text-lg mb-6'>Upload de Foto</h2>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
}

export default PhotoUpload;