import { useState } from 'react';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';

function PhotoUpload({ nomeArquivo, onUploadComplete }) {
    const [image, setImage] = useState<File|null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!image) return;

        const storageRef = ref(storage, `${nomeArquivo}/${image.name + v4()}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Erro ao fazer upload:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setDownloadURL(url);
                    onUploadComplete(url);
                });
            }
        );
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <h2 className='text-center text-lg mb-6'>Upload de Foto</h2>
            <input type="file" onChange={handleFileChange} />
            <button
                className='w-40 h-9 bg-blue-900 hover:bg-blue-700 rounded border-0 text-lg text-white px-4 mt-8'
                onClick={handleUpload}>Upload</button>
            {uploadProgress > 0 && <p>Progresso: {uploadProgress.toFixed(2)}%</p>}
            {downloadURL && (
                <div>
                    <p className='text-center m-3'>Upload concluído!</p>
                    <img src={downloadURL} alt="Uploaded file" width="200px" />
                </div>
            )}
        </div>
    );
}

export default PhotoUpload;