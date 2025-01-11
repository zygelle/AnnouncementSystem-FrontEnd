import React, { useState, useRef } from 'react';

interface photoUploadProps {
    Images: (images: File[]) => void;
    isImages: (isImages: boolean) => void;
}

const PhotoUpload: React.FC<photoUploadProps> = ({ Images, isImages }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const updatedFiles = [...selectedFiles, ...newFiles];
            setSelectedFiles(updatedFiles);
            Images(updatedFiles);
            isImages(updatedFiles.length > 0);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < selectedFiles.length - 3) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        setSelectedFiles(updatedFiles);
        Images(updatedFiles);
        isImages(updatedFiles.length > 0);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const visibleImages = selectedFiles.slice(currentIndex, currentIndex + 3);

    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-center text-lg mb-6">Upload de Foto</h2>
            <input type="file" onChange={handleFileChange} multiple ref={fileInputRef} className="hidden" />
            <button
                className="order p-2 rounded-md cursor-pointer text-gray-600 bg-white shadow-md w-80 text-center"
                onClick={() => fileInputRef.current?.click()}
            >
                Selecionar arquivos
            </button>

            {selectedFiles.length > 0 && (
                <div className="flex items-center space-x-2 mt-4">
                    {currentIndex > 0 && (
                        <button
                            className="text-gray-700 hover:text-gray-900"
                            onClick={handlePrevious}
                        >
                            {"<"}
                        </button>
                    )}

                    <div className="flex space-x-3">
                        {visibleImages.map((file, index) => {
                            const fileUrl = URL.createObjectURL(file);
                            return (
                                <div key={index} className="relative">
                                    <img
                                        src={fileUrl}
                                        alt={`Imagem ${index + 1}`}
                                        className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                                            selectedImage === fileUrl ? "ring-2 ring-blue-500" : ""
                                        }`}
                                        onClick={() => setSelectedImage(fileUrl)}
                                    />
                                    <button
                                        className="absolute top-0 right-0 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex justify-center items-center"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {currentIndex < selectedFiles.length - 3 && (
                        <button
                            className="text-gray-700 hover:text-gray-900"
                            onClick={handleNext}
                        >
                            {">"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PhotoUpload;