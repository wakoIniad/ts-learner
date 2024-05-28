import { useState ,useRef, createRef, RefObject, forwardRef } from 'react';
import styles from './index.module.css';

const Home = () => {

  function getTeamStones() {
    let BLACK = 0;
    let WHITE = 0;
    for(const line of board) {
      for(const stone of line) {
        if(stone > 0) {
          WHITE += 1;
        } else if(stone < 0) {
          BLACK += 1;
        }
      }
    }
    return [BLACK,WHITE];
  }

  const _ = new Array(8).fill([]).map(()=>
    new Array(8).fill(0).map(()=>0)
  );
  _[3][3] = -1
  _[4][4] = -1
  _[3][4] = 1
  _[4][3] = 1
  const [board,setBoard] = useState(_);

  let [mode,setMode] = useState(0);
  if(mode === 0)return game();
  if(mode === 1)return game(true);

  function result() {
    const teamStones = getTeamStones();
    const winner = teamStones[0] > teamStones[1] ? 'WINNER is BLACK ':
    teamStones[1] > teamStones[0] ? 'WINNER is WHITE': 'DRAW';
    return (<div className={styles.message}>{winner}</div>)
  }
  function game(displayResult:boolean=false) {
    let [gameEndCounter,setGameEndCounter] = useState(false);
    const cellRefs = useRef<RefObject<HTMLInputElement>[]>([]);
    for(let n = 0;n < 8*8;n++) {
      cellRefs.current[n] = createRef<HTMLInputElement>()
    }

    let [highlightCells,setHighlightCells] = useState([]);
    let [alreadyHighlighted,setAlreadyHighlighted] = useState(null);

    let nowPlayerHasPlaceableCell = false;

    function boardLoaded() {
      if(mode!==0)return;
      if(nowPlayerHasPlaceableCell === false) {
        if(gameEndCounter) {
          setMode(1);
        } else {
          setTurnColor(turnColor*-1);
          setGameEndCounter(true);
        }
      }
    }
    function cellGenerator({x,y}:{x:number,y:number},ref) {
      const stat = board[x][y];
      let col = stat && ( (stat+1) && 'white'  || 'transparent' ) ||
      putChecker(x,y) && 'rgba(255,255,255,0.5)' || 'transparent';

      let border = stat == -1 ?'solid 1em white':'transparent'
      function mouseEntered() {
        if(mode!==0)return;
        const ID = x*8+y;
        setAlreadyHighlighted(ID);
        const cells = [];
        const turnableStones = getTurnableStones(x,y);
        for(const line of turnableStones) {
          let [posX,posY] = [x,y];
          for(var n = 0;n < line[2];n ++) {
            posX += line[0];
            posY += line[1];
            cells.push(posX*8+posY)
          }
        }
        setHighlightCells(cells);

      }

      function clicked() {
        if(mode!==0)return;
        const turnableStones = getTurnableStones(x,y);
        if(turnableStones.length) {
          const copiedBoard = structuredClone(board);//DeepCopy
          copiedBoard[x][y] = turnColor

          for(const line of turnableStones) {
            let [posX,posY] = [x,y];
            for(var n = 0;n < line[2];n ++) {
              posX += line[0];
              posY += line[1];
              copiedBoard[posX][posY] *= -1;
            }
          }
          setBoard(copiedBoard)
          //setTurnColor(turnColor*-1);
          setAlreadyHighlighted(null);
        }
      }


      let stoneStyle = [styles.stone]
      let water = '';
      if(board[x][y]) {
        stoneStyle.push(styles.fixedStone)
      } else {
        water = <div className={styles.wave}/>
      }
      stoneStyle = stoneStyle.join(' ')
      return alreadyHighlighted === (x*8+y)?
  <div className={stoneStyle} style={{backgroundColor:col,border:border}} key={x * 8 + y}
      ref={ref}
      onClick={ ()=>clicked(x,y) }
      >
        {water}
      </div>
      : <div className={stoneStyle} style={{backgroundColor:col,border:border}} key={x * 8 + y}
      ref={ref}
      onClick={ ()=>clicked(x,y) }
      onMouseEnter={ ()=>mouseEntered(x,y)}
      >
      {water}
      </div>
    }
    const InpuItem = forwardRef(cellGenerator)



    const [turnColor,setTurnColor] = useState(-1);



    function putChecker(x:number,y:number) {
      if(board[x][y])return false;
      const color = turnColor;
      let res = false;
      for(var i = -1;i <= 1;i ++) {
        for(var j = -1;j <= 1;j ++) {
          if(i || j) {
            let c = 0;//
            let [posX,posY] = [x,y];
            while(board[posX+=i]?.[posY+=j]) {
              if((board[posX][posY] === color)) {
                res ||= c;
                break;
              };
              c++;//
            }
          }
        }
      }
      return res;
    }

    function getTurnableStones(x:number,y:number) {
      if(board[x][y])return [];

      const color = turnColor;
      let result = [];
      for(var i = -1;i <= 1;i ++) {
        for(var j = -1;j <= 1;j ++) {
          if(i || j) {
            let c = 0;//
            let [posX,posY] = [x,y];
            while(board[posX+=i]?.[posY+=j]) {
              if(board[posX][posY] === color) {
                if(c)result .push([i,j,c]);
                break;
              }
              c++;//
            }
          }
        }
      }
      return result;
    }





    return (
      <div className={styles.container}>
        {
        (function(){
          if(displayResult) {
            const teamStones = getTeamStones();
            const winner = teamStones[0] > teamStones[1] ? 'WINNER is BLACK ':
                  teamStones[1] > teamStones[0] ? 'WINNER is WHITE': 'DRAW';
            return <div className={styles.message}><h1>{winner}</h1></div>
          } else return '';
        })()
        }
        <div className={styles.info}>
          <div className={styles.scoreBoard}>
            <div className={styles.scoreBarBox}>
                {
                  (function() {
                    //0: black,1 white;
                    const sitiation = getTeamStones();
                    const res = [];
                    if(sitiation[1]/(sitiation[0]+sitiation[1]) > 0.06){
                      res.push(<div className={styles.scoreBarWhite}
                    style={{width: Math.max(0,(sitiation[1]/(sitiation[1]+sitiation[0]))*100-6)+'%' }}
                    >{sitiation[1]}</div>)
                    }
                    if(sitiation[0]/(sitiation[0]+sitiation[1]) > 0.06) {
                      res.push(<div className={styles.scoreBarBlack}
                        style={{width: Math.max(0,(sitiation[0]/(sitiation[0]+sitiation[1]))*100-6)+'%' }}
                        >{sitiation[0]}</div>)
                    }
                    return <div className={styles.scoreBarBox_}>
                      {res}
                    </div>
                  })()
                }
            </div>
          </div>
          <div className={styles.nowTurnDisplay}>
            {
              (function(){
                return <em>now: {['○','','◎'][turnColor+1]}</em>
              })()
            }
          </div>
        </div>
        <div className={styles.board}>
          {
            (function() {
              const col = []
              for(let x:number=0;x<8;x++) {
                const row = [];
                for(let y:number=0;y<8;y++) {

                  if(putChecker(x,y))nowPlayerHasPlaceableCell = true;
                  let color = 'transparent';
                  if(highlightCells.includes(x*8+y)) {
                    color = 'rgba(100,200,100,0.5)'
                  }
                  const cell = <div className={styles.cell} style={{backgroundColor:color}}>
                    <InpuItem ref={cellRefs.current[x * 8 + y]} x={x} y={y}/>
                  </div>
                  row.push(cell);
                  if(x*8+y===63)boardLoaded()
                }
                col.push(<div>{row}</div>)
              }
              return col
            })()
          }
        </div>
      </div>
    );
  }
};
export default Home;
