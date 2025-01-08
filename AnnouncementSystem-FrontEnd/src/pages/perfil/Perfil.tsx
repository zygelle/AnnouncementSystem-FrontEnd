import {getEmail} from "../../services/token.tsx";
import {useLocation} from "react-router-dom";

function Perfil() {
    const location = useLocation();
    const email = location.state?.advertiserEmail || getEmail();



    return (
        <main>

        </main>
    );
}

export default Perfil;