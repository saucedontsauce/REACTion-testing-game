import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  let highscore = window.localStorage.getItem("reactiontest_highscore") || 0;

  const [testscore, setTestscore] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetimg, setTargetimg] = useState('/archertarget.svg');
  const [inprog, setInprog] = useState(false);
  const gameloop = useRef();

  const genmsdelay = () => {
    const tnm = Math.floor(Math.random() * 4250);
    const nnm = Math.floor(Math.random() * (tnm - 1250));
    const nm = tnm - nnm;
    return nm
  }

  const start = () => {
    console.log('start requested');
    setInprog(true)
    gameloop.delay = setTimeout(() => {
      setVisible(true)
      gameloop.current = setInterval(() => {
        setTestscore((state) => { return ++state });

      }, 1)

    }, genmsdelay())


  }

  const stop = () => {
    console.log('stop requested');
    setInprog(false)
    clearTimeout(gameloop.delay)
    gameloop.delay = undefined
    clearInterval(gameloop.current)
    gameloop.current = undefined;
  };

  const reset = () => {
    console.log('reset requested');
    if (testscore > highscore) {
      window.localStorage.setItem("reactiontest_highscore", testscore)
    }
    setTestscore(0)
    setVisible(false)
  }

  const interaction = () => {
    console.log("Click happened");

    if (inprog) {
      // gameloop is currently assigned
      stop();
    } else {
      // gameloop is not defined
      if (testscore) {
        reset()
      } else {
        start();
      }


    }

  }



  // for unmount to stop 'memory leakage'
  useEffect(() => {

    return () => {
      clearInterval(gameloop.current)
    }
  }, [])

  return (
    <div className='gameSlide noselect'>
      <div className='gameTitle'>
        <h2>SniperTest</h2>
        <p>Click the scope to start and again to stop.</p>
      </div>
      <div className="gameBox noselect">
        <div className="scope noselect" onClick={interaction}>
          {visible && <img src={targetimg} className="scopetarget"></img>}
          <div className="scopehline noselect"></div>
          <div className="scopevline noselect"></div>
        </div>
      </div>
      <div className="scoreBox noselect" style={testscore < highscore ? { "color": "green" } : testscore == highscore ? { "color": "orange" } : { "color": "red" }}>{testscore}ms</div>
    </div>
  )
}

export default App
