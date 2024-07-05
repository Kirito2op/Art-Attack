import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    function handleClick() {
        navigate('/');
    }
    return(
        <>
            <div>Page not found!</div>
            <button onClick={handleClick} className="landing-button">Return Home</button>
        </>
    )
}

export default NotFound;