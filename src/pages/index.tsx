import { useState ,useRef, createRef, RefObject, forwardRef } from 'react';
import styles from './index.module.css';

const Home = () => {

  const cellRefs = useRef<RefObject<HTMLInputElement>[]>([]);
  for(let n = 0;n < 8*8;n++) {
    cellRefs.current[n] = createRef<HTMLInputElement>()
  }

  let [highlightCells,setHighlightCells] = useState([]);
  let [alreadyHighlighted,setAlreadyHighlighted] = useState(null);

  function cellGenerator({x,y}:{x:number,y:number},ref) {
    const stat = board[x][y];
    let col = stat && ( (stat+1) && 'white'  || 'black' ) ||
    putChecker(x,y) && 'rgba(255,255,255,0.5)' || 'transparent';

    function mouseEntered() {
      console.log('MOUSE_ENTER',x*8+y,alreadyHighlighted)
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
      console.log('CLICK',x*8+y,alreadyHighlighted)
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
        setTurnColor(turnColor*-1);
        setAlreadyHighlighted(null);
      }
    }


    return alreadyHighlighted === (x*8+y)?
<div className={styles.stonewhite} style={{backgroundColor:col}} key={x * 8 + y}
    ref={ref}
    onClick={ ()=>clicked(x,y) }
    />
    : <div className={styles.stonewhite} style={{backgroundColor:col}} key={x * 8 + y}
    ref={ref}
    onClick={ ()=>clicked(x,y) }
    onMouseEnter={ ()=>mouseEntered(x,y)}
    />
  }
  const InpuItem = forwardRef(cellGenerator)

  const _ = new Array(8).fill([]).map(()=>
    new Array(8).fill(0).map(()=>0)
  );
  _[3][3] = -1
  _[4][4] = -1
  _[3][4] = 1
  _[4][3] = 1
  const [board,setBoard] = useState(_);

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
      <div className={styles.board}>
        {
          (function() {
            const col = []
            for(let x:number=0;x<8;x++) {
              const row = [];
              for(let y:number=0;y<8;y++) {
                let color = 'transparent';
                if(highlightCells.includes(x*8+y)) {
                  color = 'rgba(100,200,100,0.5)'
                }
                const cell = <div className={styles.cell} style={{backgroundColor:color}}>
                  <InpuItem ref={cellRefs.current[x * 8 + y]} x={x} y={y}/>
                </div>
                row.push(cell);

              }
              col.push(<div>{row}</div>)
            }
            return col
          })()
        }
      </div>
    </div>
  );
};
export default Home;
