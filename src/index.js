import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var possibleCombinationSum = function(arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
      arr.pop();
      return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount ; i++ ) {
      var combinationSum = 0;
      for (var j=0 ; j < listSize ; j++) {
        if (i & (1 << j)) { combinationSum += arr[j]; }
      }
      if (n === combinationSum) { return true; }
    }
    return false;
  };

const Stars = (props) => {
    let stars =[];
    for(let i=0;i<props.numberOfStars;i++) {
        stars.push(<i key={i} className="fa fa-star"></i>);
    }
    return (
        <div className="col-5">
        {stars}
        </div>
    );
}
 
const Button = (props) => {
    let button;
    switch(props.isAnswer) {
        case true :
        button = <button onClick={props.acceptAnswer} className="btn btn-success"><i className="fas fa-check"></i></button> 
        break;
        case false :
        button = <button className="btn btn-danger"><i className="fas fa-times"></i></button> 
        break;
        default:
        button = <button onClick={() => props.onClick()} disabled={props.selectedNumbers.length === 0} className="btn btn-primary">=</button>
        }
    return (
        <div className="col-2 text-center">
        {button}
        <br /> <br />
        <button onClick={props.reDrawStars} className="btn btn-warning"  disabled={props.redraws === 0}><i className="fa fa-retweet">{props.redraws}</i>
        </button>
        </div>
    );
}


const Numbers = (props) => {
   const selectedNumber = (number) => {
        if (props.selectedNumbers.indexOf(number) >= 0) {
            return "selected";
        }
        if (props.usedNumbers.indexOf(number) >= 0) {
            return "used";
        }
    }
    return (
        <div className="card text-center">
        <div>
        {Numbers.list.map((number,i) => 
            <span key={i} className={selectedNumber(number)} onClick={() => props.onClick(number)}>{number}</span>
        )}
        </div>
        </div>
    )
}


const DoneFrame = (props) => {
    return(    
    <div className="text-center"> 
    <h2>{props.doneStatus}</h2>
    <button className="btn btn-default" onClick={props.resetGame}>Play Again</button>
    </div>
    )
}
const Answer = (props) => {
    return (
        <div className="col-5">
        {props.selectedNumbers.map((number,i) => <span onClick={() => props.onClick(number)} key={i}>{number}</span>
        )}
        </div>
    );
}
class Game extends React.Component {
    static intialState =  {
        selectedNumbers : [],
        numberOfStars : 1 + Math.floor(Math.random()*9),
        usedNumbers : [],
        isAnswer: null,
        redraws: 5,
        doneStatus: null
    }
    state = Game.intialState;
   selectNumber = (number) => {
            if(this.state.selectedNumbers.indexOf(number) >=0) {return;}
            if(this.state.usedNumbers.indexOf(number) >=0) {return;}
            this.setState(prevState => { return {selectedNumbers : prevState.selectedNumbers.concat(number), isAnswer:null}});
    }

    unselectNumber = (number) => {
        this.setState(prevState => { return {selectedNumbers: prevState.selectedNumbers.filter((num) => number !== num) , isAnswer: null}});
    }

    checkAnswer = () => {
        this.setState(prevState => { return {isAnswer: prevState.numberOfStars === prevState.selectedNumbers.reduce((a,b) => a+b,0) }})
    }

     acceptAnswer = () => {
        this.setState(prevState => { return {
                usedNumbers: prevState.usedNumbers.concat(this.state.selectedNumbers),
                selectedNumbers: [],
                isAnswer: null,
                numberOfStars : 1 + Math.floor(Math.random()*9)
        }},this.checkDoneStatus);
    }

    reDrawStars = () => {
        if (this.state.redraws === 0){return;}
        this.setState(prevState => { return {numberOfStars: 1 + Math.floor(Math.random()*9) , 
                       isAnswer: null ,
                       selectedNumbers: [],
                       redraws: this.state.redraws - 1
                      }},this.checkDoneStatus)
    }

    resetGame = () => {
        this.setState(Game.intialState);
    }

     possibleSolutions = ({numberOfStars,usedNumbers}) => {
        const remainingNumbers = Numbers.list.filter((num) => this.state.usedNumbers.indexOf(num) < 0);
        return possibleCombinationSum(remainingNumbers,numberOfStars);
    }

    checkDoneStatus = () => {
        this.setState( prevState => {
            if(prevState.usedNumbers.length === 9) {
                return{doneStatus:'You Won'};
            }
            if(prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
                return{doneStatus:'GameOver'};
            }
        })
            
    }

    
    render() {
        const {selectedNumbers , numberOfStars, usedNumbers, isAnswer, redraws, doneStatus} = this.state;
        return (
            <div className="container">
                <div className="jumbotron">
                <h1>Play Nine</h1>
                </div>
                <hr />
                <div className="row">
                 <Stars numberOfStars= {numberOfStars}/>
                <Button onClick= {this.checkAnswer} redraws={redraws} acceptAnswer= {this.acceptAnswer} reDrawStars = {this.reDrawStars} selectedNumbers= {selectedNumbers} isAnswer= {isAnswer}/>
                 <Answer onClick={this.unselectNumber} selectedNumbers= {selectedNumbers}/>
                 </div>
                 <br />
                 {doneStatus? 
                 <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus}/>:
                 <Numbers onClick={this.selectNumber} usedNumbers= {usedNumbers} selectedNumbers= {selectedNumbers} />
                 }
            </div>
        );
    }
}
Numbers.list = [1,2,3,4,5,6,7,8,9,10];

const App = (props) => {
    return (
        <div>
            <Game />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
