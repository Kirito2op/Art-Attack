import '../App.css'

function PlayerBoard({ username, score }) {
    return (
      <>
        <div className='room-message board-message'>
          <div className='board-message2'>{username}</div>
          <div className='board-message2'>Score: {score}</div>
        </div>
      </>
    );
  }
  
  export default PlayerBoard;