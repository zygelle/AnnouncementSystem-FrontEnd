import {v4} from "uuid";
import {ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "./firebaseConfig.tsx";

export const handleUpload = async (images: File[], nomeArquivo: string): Promise<string> => {
    const uploadPromises = images.map((image) => {
        const uniqueName = `${nomeArquivo}/${image.name}_${v4()}`;
        const storageRef = ref(storage, uniqueName);

        return new Promise<void>((resolve, reject) => {
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload de ${image.name}: ${progress.toFixed(2)}% concluído.`);
                },
                (error) => {
                    console.error(`Erro ao fazer upload de ${image.name}:`, error);
                    reject(error);
                },
                () => {
                    console.log(`Upload de ${image.name} concluído.`);
                    resolve();
                }
            );
        });
    });

    try {
        await Promise.all(uploadPromises);
        console.log("Todos os uploads foram concluídos com sucesso.");
        return nomeArquivo;
    } catch (error) {
        console.error("Erro durante o upload de uma ou mais imagens:", error);
        throw new Error("Erro durante o upload. Processo interrompido.");
    }
};