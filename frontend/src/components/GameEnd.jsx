import { useNavigate } from "react-router-dom";

function GameEnd({ scores }) {
    const navigate = useNavigate();
    console.log(scores);
    scores.sort((a, b) => b.score - a.score);
    const handleClick = () => {
        navigate('/lobby');
    }
    return (
        <>
            <div className="login-header">Game Over!</div>
            <div className="end-cont">
                {scores.map((score, index) => (
                    <div className="end-message" key={score.id}>
                        <div>{index + 1}. {score.username}</div>
                        <div>{score.score} points</div>
                    </div>
                ))}
            </div>
            <div className="end-cont-button"><button className="end-button" onClick={handleClick}>Return to Lobby</button></div>
        </>
    );
}

export default GameEnd;
