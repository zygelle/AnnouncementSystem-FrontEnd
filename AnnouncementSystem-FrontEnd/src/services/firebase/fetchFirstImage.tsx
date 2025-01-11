import {getDownloadURL, listAll, ref} from "firebase/storage";
import {storage} from "./firebaseConfig.tsx";

export const fetchFirstImage = async (id: string | null | undefined): Promise<string | undefined> => {
    if (!id) {
        return;
    }

    const imageListRef = ref(storage, `${id}/`);

    try {
        const response = await listAll(imageListRef);

        if (response.items.length > 0) {
            return await getDownloadURL(response.items[0]);
        } else {
            console.log("Nenhuma imagem encontrada.");
            return;
        }
    } catch (error) {
        console.error("Erro ao buscar as imagens:", error);
        return;
    }
};
