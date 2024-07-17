import { useState } from 'react'
import './index.css';

function Square({value, onSquareClick}){
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {
  // function handleClick akan mengubah isi array dengan setSquares
  function handleClick(i){
    // disable function lain ketika kotak sudah di klik / ketika ada pemenanngnya(function winnerCalculate berjalan)
    if(squares[i] || winnerCalculate(squares)) return;
    // membuat array baru yg bernilai sama dengan squares agar bisa dimodifikasi tanpa mengubah array yg diduplikat :
    const nextSquares = squares.slice();
    // mengisi array squares dengan nilai x sesuai index kotak yang di klik dengan menetapkan nilai nextSquares :
    nextSquares[i] = (xIsNext) ? 'X' : 'O';
    // if(xIsNext){
    //   nextSquares[i] = 'X';
    // }else{
    //   nextSquares[i] = 'O';
    // }
    // memanggil function onplay dengan isi keadaan berikutnya dari board
    onPlay(nextSquares);
  };
  const winner = winnerCalculate(squares);
  let status = '';
  if(winner){
    status = 'Winner : '+ winner;
  }else{
    status = 'Next Player : ' + (xIsNext? 'X': 'O');
  }
  return (
    // component square diberi unique key berupa value dari tiap array
    // agar function tidak langsung dijalankan function onSquareCLick dibungkus dalam anonymous function dengan 
    //  arrow function agar dapat dijalankan dan dapat menampung parameter
    <>
    <div className='status'>
    {status}
    </div> <br/>
    <div className="papan">
      {/* square diberi value ketika di klik dan menjalankan fungsi handleclick sesuai index array */}
     <Square  value={squares[0]} onSquareClick={() =>handleClick(0)}/>
     <Square  value={squares[1]} onSquareClick={() =>handleClick(1)}/>
     <Square  value={squares[2]} onSquareClick={() =>handleClick(2)}/>
     <Square  value={squares[3]} onSquareClick={() =>handleClick(3)}/>
     <Square  value={squares[4]} onSquareClick={() =>handleClick(4)}/>
     <Square  value={squares[5]} onSquareClick={() =>handleClick(5)}/>
     <Square  value={squares[6]} onSquareClick={() =>handleClick(6)}/>
     <Square  value={squares[7]} onSquareClick={() =>handleClick(7)}/>
     <Square  value={squares[8]} onSquareClick={() =>handleClick(8)}/>
    </div>
    </>
  );
}
  function Game(){
    // mendeklarasikan nilai history dalam bentuk array yg bernilai array dengan nilai 9 null
    const [history,setHistory] = useState([Array(9).fill(null)]);
    // menyimpan state yg berisi tempat terakhir move
    const [currentMove, setCurrentMove] = useState(0);
    // mencari nilai terakhir dari history (kondisi terakhir squares di isi)
    // menentukan giliran dengan mencari nilai currentMove(index array dari board)
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function jumpTo(nextMove){
      setCurrentMove(nextMove);
      setXIsNext(nextMove % 2 === 0);
    }

    function handlePlay(nextSquares){
      const nextHistory = [...history.slice(0,currentMove +1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length -1);
    }
    // mengisi variable moves dengan array dari history yg menyimpan keadaan history
    const moves = history.map((squares, move) => {
      let description = '';
        if(move > 0){
          description = 'Go to move #' + move;
        }else{
          description = 'Go to Game Start';
        }
        return (
          <li key={move}>
            {/* membuat event button yg memiliki parameter move(harus dibungkus dengaan arrow function karena 
              akan menjalankan function yg membutuhkan parameter) */}
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        );
    });
    return(
      <>
      <div className='game'>
        <div className='game-board'>
          {/* board memiliki 3 props : mencari giliran pemain(xIsNext), keadaan terakhir board(utk history)currentSquares */}
          {/* dan handlePlay utk aksi ketika board di klik(menambah history?) */}
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
        </div>
          <div className="game-info">
            <ol>{moves}</ol>
          </div>
      </div>
      </>
    );
  }

function winnerCalculate(squares){
  // mengecek kondisi kotak setiap selesai di isi / di klik
  const lines = [
    // horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];
  // mencocokkan isi tiap lines dengan isi dari squares(kotak yg di klik)
  for(let i=0;i<lines.length;i++){
    // mengambil isi array squares berdasarkan index lines
    const [a,b,c] = lines[i];
    // mencocokkan nilai squares(kotak yg di klik) dengan lines
    if(squares[a] && squares[a] === squares[b] && squares[c]){
      return squares[a];
    }
  }
  return false;
}

export default Game
