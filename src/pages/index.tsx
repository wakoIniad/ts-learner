import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
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
    const color = turnColor;
    /**
     * + +
     * + 0
     * + -
     * 0 +
     * 0 -
     */
    let result = false;
    for(var i = -1;i <= 1;i ++) {
      for(var j = -1;j <= 1;j ++) {
        if(i || j) {
          let phase = 0;
          let flag = false;
          let [posX,posY] = [x,y];
          while(phase < 2) {
            posX += i;
            posY += j;
            if(board[posX] && board[posX][posY]) {
              const isSameColor = board[posX][posY] == color;
              /**
               *
               * 
               */
              switch(phase) {
                case 0:
                  if(isSameColor) {
                    phase = 2;
                  } else {
                    phase = 1;
                  }
                case 1:
                  if(isSameColor) {
                    phase = 2;
                    flag = true;
                  }
              }
            } else break;
          }
          result ||= flag;
        }
      }
    }
    return result;
  }
  function clicked(x:number,y:number) {
    if(!board[x][y]) {
      const copiedBoard = structuredClone(board);//DeepCopy
      copiedBoard[x][y] = turnColor
      setBoard(copiedBoard)
      setTurnColor(turnColor*-1);
    }
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
                const stat = board[x][y];
                let col = stat && ( (stat+1) && 'white'  || 'black' ) || 'transparent';
                const cell = <div className={styles.cell}>
                  <div className={styles.stonewhite} style={{backgroundColor:col}} key={x+'_'+y}
                  onClick={ ()=>clicked(x,y) }/>
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
