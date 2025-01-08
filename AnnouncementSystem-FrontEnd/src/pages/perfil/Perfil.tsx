import {getEmail} from "../../services/token.tsx";
import {useLocation} from "react-router-dom";
import api from "../../services/api.tsx";
import {userSchema, User} from "../../schema/UserSchema.tsx";
import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "firebase/storage";
import {storage} from "../../services/firebaseConfig.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStarHalfStroke} from "@fortawesome/free-solid-svg-icons";

function Perfil() {
    const location = useLocation();
    const email = location.state?.advertiserEmail || getEmail()
    const [user, setUser] = useState<User>()
    const [imgPerfil, setImgPerfil] = useState<string>('/images/img-padrao.PNG')

    const fetchUser = async () => {
        try {
            const response = await api.get(`/user/${email}`)
            const validate = userSchema.safeParse(response.data)
            if(validate.success) {
                setUser(validate.data)
                fetchImgPerfil(validate.data.icon)
            }
            else console.log("Erro ao validar usuário: " + validate.error)
        }catch (e){
            console.log("Foi pego no catch")
        }
    }

    useEffect(() => {
        fetchUser()
    }, []);

    const fetchImgPerfil = (img: string | null | undefined) => {
        if (!img) {
            return;
        }
        const imageRef = ref(storage, img);
        getDownloadURL(imageRef).then((url) => {
            setImgPerfil(url);
        }).catch(error => {
            console.error("Erro ao buscar a imagem:", error);
        });
    };

    const formatScore = (score: number) => {
        return score.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    };

    return (
        <main>
            {user ? (
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-center align-middle mb-4">
                            <div className="w-56 h-56 justify-center">
                                <img
                                    src={imgPerfil}
                                    alt="Imagem de Perfil"
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                        <div className="font-bold text-xl text-center">{user.name}</div>
                        <div className="text-gray-600 text-center text-md">{user.type}</div>
                        <div className="text-lg text-center mt-2">
                            <FontAwesomeIcon icon={faStarHalfStroke} className="me-1 text-yellow-400"/>
                            {formatScore(user.score)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <div className="text-lg font-semibold">Anúncios</div>
                        </div>
                        {user.email == getEmail() &&
                            <div>
                                <div className="text-lg font-semibold">Meus Favoritos</div>
                            </div>
                        }
                        <div>
                            <div className="text-lg font-semibold">Avaliações</div>
                        </div>
                        {user.email == getEmail() &&

                            <div>
                                <div className="text-lg font-semibold">Minhas Avaliações</div>
                            </div>
                        }
                    </div>
                </div>
            ) : (
                <div>
                    Nenhum usuário
                </div>
            )}

        </main>
    );
}

export default Perfil;