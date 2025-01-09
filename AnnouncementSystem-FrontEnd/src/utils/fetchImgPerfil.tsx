import {getDownloadURL, ref} from "firebase/storage";
import {storage} from "../services/firebaseConfig.tsx";

export const fetchImgPerfil = (img: string | null | undefined, setImg: (img: string) => void) => {
    if (!img) {
        return;
    }
    const imageRef = ref(storage, img);
    getDownloadURL(imageRef).then((url) => {
        setImg(url);
    }).catch(error => {
        console.error("Erro ao buscar a imagem:", error);
    });
};