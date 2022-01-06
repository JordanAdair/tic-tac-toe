import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// class Square extends React.Component {
//   // This is a "Controlled Component" since Board has full control over these.
//   render() {
//     // Use the prop passed from the parent Board component, and return its value.
//     return (
//       <button
//         className="square"
//         onClick={() => {
//           // When a Square is clicked, the onClick function provided by Board is called.
//           this.props.onClick();
//         }}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

// Turning the Square component into a Function Component
const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

class Board extends React.Component {
  // /**
  //  * Add a constructor to the Board and set the Board’s initial state to contain an array of
  //  * 9 nulls corresponding to the 9 squares
  //  */
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     // Create a "board" of 9 empty spaces.
  //     squares: Array(9).fill(null),
  //     // If xIsNext is true, change the square's value to be "X", otherwise "O"
  //     xIsNext: true,
  //   };
  // }

  // handleClick(i) {
  //   // Create a copy of the array, instead of modifying the existing one to fit immutability paradigm.
  //   const squares = this.state.squares.slice();
  //   //If there is a winner, we can just break out of the function since we don't want to continue to play after someone already won.
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   // Making use of a ternary operator, we check if X is next, and return "X" if true, and "O" if it's false.
  //   squares[i] = this.state.xIsNext ? "X" : "O";
  //   this.setState({
  //     squares: squares,
  //     // Flip the value of xIsNext (If true, then make it false. If false, make it true.)
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  renderSquare(i) {
    // Pass two props called "value", and "onClick" to the child Square Component
    return (
      <Square
        // value={this.state.squares[i]}
        value={this.props.squares[i]}
        /**
         * Since state is considered to be private to a component that defines it,
         * we cannot update the Board's state directly from the Square.
         * Instead, we pass down a function from the Board to the Square,
         * and we'll have Square call that function when a square is clicked.
         */
        //? How does this work?
        /**
         * The "onClick" prop on the built-in DOM <button> component tells React to set up a click event listener
         * When the button is clicked, React will call the onClick event that is defined in Square's render() method.
         * This event handler calls this.props.onClick(). The Square's onClick prop was specified by the Board.
         * Since the Board passes onClick ... => this.handleClick(i) to Square, the Square calls the Board's handleClick(i) when clicked.
         *
         * The DOM <button> element’s onClick attribute has a special meaning to React because it is a built-in component.
         * We could give any name to the Square’s onClick prop or Board’s handleClick method, and the code would work the same.
         */
        // onClick={() => this.handleClick(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // Setting up the initial state for the Game component within its constructor:
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      // Before we implement jumpTo, we’ll add stepNumber to the Game component’s state to indicate which step we’re currently viewing.
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    /**
     * This ensures that if we “go back in time” and then make a new move from that point,
     * we throw away all the “future” history that would now become incorrect.
     */
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // Create a copy of the array, instead of modifying the existing one to fit immutability paradigm.
    const squares = current.squares.slice();
    //If there is a winner, we can just break out of the function since we don't want to continue to play after someone already won.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Making use of a ternary operator, we check if X is next, and return "X" if true, and "O" if it's false.
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      // Flip the value of xIsNext (If true, then make it false. If false, make it true.)
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // set xIsNext to true if the number that we’re changing stepNumber to is even
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    /* Updating the Game component's render function
    to use the most recent history entry to determine and display the game's status */
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    /**
     * Using the map method, we can map our history of moves to React elements representing buttons on the screen,
     * and display a list of buttons to "jump" to past moves.
     */
    const moves = history.map((step, move) => {
      /**
       * As we iterate through the history array, the "step" variable refers to the current history element value,
       * and "move" refers to the current history element index. We are only interested in "move" here,
       * hence "step" is not getting assigned to anything.
       */
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        /**
         * For each move in the tic-tac-toe game's history, we create a list item which contains a button
         * The button has an onClick handler which calls a method called "this.jumpTo"
         */
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner:" + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// Given an array of 9 squares, this function will check for a winner and return 'X', 'O', or null as appropriate.
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
