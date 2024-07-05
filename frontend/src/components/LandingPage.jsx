import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from 'axios';
import '../App.css';


function LandingPage() {
    const navigate = useNavigate();
    function handleClick(){
        navigate('/login');
    }
    useEffect(() => {
        const checkAuth = async () => {
          try {
            const response = await axios.get('/api/auth/username');
            navigate('/lobby');
          } catch (error) {
            console.error('Error fetching username:', error);
          }
        };
        checkAuth();
    }, []);
    
    const register = () => {
      navigate('/register');
    }

    return (
        <>
            <div className="landing-cont">
              <div className="landing-header">Art Attack! Draw, guess, and laugh with friends</div>
              <button className="landing-button" onClick={register}>Register</button>
            </div>
            <div className="landing-cont2"><button onClick={handleClick} className="landing-button landing-login">Login</button></div>
        </>
    )
}

export default LandingPage;