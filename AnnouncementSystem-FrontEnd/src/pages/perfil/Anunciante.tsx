import {useLocation} from "react-router-dom";

interface AnnouncerPageProps {
    email?: string;
}

function Anunciante() {
    const location = useLocation();
    const { email } = location.state || {};

    return (
        <main></main>
    );
}

export default Anunciante;