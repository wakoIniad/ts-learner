import styles from './index.module.css';

const Home = () => {
  const board: object[][] =
  new Array(8).fill([]).map(()=>
    new Array(8).fill(0).map(()=>
      {
        const res:{stat:number,obj:any} = ({stat:0,obj:{}})
        return res;
      })
  )
  board[3][3].stat = -1
  board[4][4].stat = -1
  board[3][4].stat = 1
  board[4][3].stat = 1


  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {
          (function() {
            const col = []
            for(let i:number=0;i<8;i++) {
              const row = [];
              for(let i:number=0;i<8;i++) {
                const cell = <div className={styles.cell}>
                <div className={styles.stone}/>
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
