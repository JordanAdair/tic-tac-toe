import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Square extends React.Component {
  // This is a "Controlled Component" since Board has full control over these.
  render() {
    // Use the prop passed from the parent Board component, and return its value.
    return (
      <button
        className="square"
        onClick={() => {
          // When a Square is clicked, the onClick function provided by Board is called.
          this.props.onClick();
        }}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  /**
   * Add a constructor to the Board and set the Board’s initial state to contain an array of
   * 9 nulls corresponding to the 9 squares
   */
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = "X";
    this.setState({ squares: squares });
  }

  renderSquare(i) {
    // Pass two props called "value", and "onClick" to the child Square Component
    return (
      <Square
        value={this.state.squares[i]}
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
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = "Next player: X";

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
