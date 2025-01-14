import {useLocation} from "react-router-dom";

interface AnnouncerPageProps {
    email?: string;
}

function Anunciante() {
    const location = useLocation();
    const { email } = location.state || {};

    return (
        <main>
            <h1>Bem-vindo ao perfil do anunciante</h1>
            {email ? (
                <p>Email do anunciante: {email}</p>
            ) : (
                <p>Email não informado.</p>
            )}
        </main>
    );
}

export default Anunciante;