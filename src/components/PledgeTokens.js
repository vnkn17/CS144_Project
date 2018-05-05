import React, { Component } from 'react';
import update from 'react-addons-update';
import quizQuestions from './helpers/quizQuestions';
import Quiz from './helpers/Quiz';
import Result from './helpers/Result';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Button } from 'reactstrap';
import GithubUsers from './helpers/GithubUsers';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

require('firebase');


export default class PledgeTokens extends Component {

  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {
        Nintendo: 0,
        Microsoft: 0,
        Sony: 0
      },
      result: '',
      numTokens: 420,
      answerIDTokens: []
    };

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
        console.log("current User: ", firebase.auth().currentUser);
      } else {
        window.location.href = '/signin';
      }
    });

    //this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.handler = this.handler.bind(this);

  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
        firebase.database().ref('/users/user')
        var email = (firebase.auth().currentUser.email).replace(/\./g, '_');
        console.log("wat");
        firebase.database().ref('/users/emailsToIDs/' + email).once("value").then(function(snapshot) {
          console.log("de");
          var currentID = snapshot.val().userID;
          firebase.database().ref('/users/userData/' + currentID + '/numTokens').once("value").then(function(snapshot) {
            console.log("fuk");
            var tkNum = Number(snapshot.val());
            // st.numTokens = tkNum;
            var tokenDisplay = document.getElementsByClassName("tokenDisplay");
            console.log("token display:\n" + tokenDisplay[0].innerHTML);
            // tokenDisplay[0].innerHTML = "You own " + tkNum + " Tokens";
            tokenDisplay[0].innerHTML = "<h4>You own " + tkNum + " Tokens</h4>\
              <a className='tokenText1' href='www.google.com'>Buy more</a>"
          });
        });
      } else {
        window.location.href = '/signin';
      }
    });
  }

  handler(idOfAnswer, tokensAwarded, answererID) {
    var found = false;
    for (var i = 0; i < this.state.answerIDTokens.length; i++)  {
      if (this.state.answerIDTokens[i].idOfAnswer == idOfAnswer)  {
        this.state.answerIDTokens[i].tokensAwarded = Number(tokensAwarded);
        found = true;
        break;
      }
    }
    var joined = this.state.answerIDTokens;
    if (!found) {
      var pair =
        {idOfAnswer: idOfAnswer,
        tokensAwarded: Number(tokensAwarded),
        answererID: answererID};
      joined = this.state.answerIDTokens.concat(pair);
    }
    this.setState({ answerIDTokens: joined });
  }


  componentWillMount() {
        console.log("start of component mount");
        var componentVariable = this;

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log("email: " + firebase.auth().currentUser.email);
            console.log("current User: ", firebase.auth().currentUser);

            var database = firebase.database();
            // Render question and answers with token pledging UI
            // On Submit collect tokens and distribute accordingly calling smart contract functions
            // Get current person whos logged in ID curID.
            var currentUser = firebase.auth().currentUser;
            console.log("current User: ", currentUser);
            var email;
            if (currentUser != null) {
              email = (currentUser.email).replace(/\./g, '_');
              console.log("submit email: " + email);
            }

            var currentUserID;
            var questionStorageID = -1;
            var qaJSON =
              {question: "",
               questionID: null,
               askerID: "",
               answers: []
              };

            database.ref('/users/emailsToIDs/' + email + '/userID').once("value").then(function(snapshot) {

              console.log("id: ", snapshot.val());
              currentUserID = Number(snapshot.val());

              // Go through unresolved questions, get one question questionID s.t. curID = askerID
              database.ref('/questions/unresolved/').once("value").then(function(snapshot) {

                var unresolvedQuestions = snapshot.val();
                console.log("indices", unresolvedQuestions);
                console.log("length: ", unresolvedQuestions.length);

                //console.log("What is this?", unresolvedQuestions[0].askerID);
                for (var i = 0; i < unresolvedQuestions.length; i++) {

                    console.log("done: ", unresolvedQuestions[i].done);
                    console.log("askerID: ", unresolvedQuestions[i].askerID);
                    console.log("ID: ", currentUserID);

                    if (unresolvedQuestions[i].done == false && unresolvedQuestions[i].askerID == currentUserID) {
                      questionStorageID = unresolvedQuestions[i].questionID;
                      break;
                    }
                }

                if(questionStorageID == -1) {
                  console.log("No question...");
                }
                else {
                  componentVariable.setState({questionId: questionStorageID});

                  // Find questionID, get relevant answers
                  database.ref('/questions/questionData/' + questionStorageID + '/answers').once("value").then(function(snapshot) {
                    var answerCount = snapshot.child("answerCount").val();
                    console.log(Number(answerCount));

                    var question = '/questions/questionData/' + questionStorageID;
                    database.ref(question).once("value").then(function(snapshot) {

                      qaJSON.question = snapshot.child("text").val();
                      qaJSON.questionID = questionStorageID;
                      qaJSON.askerID = snapshot.child("askerID").val();


                      var answerInformation = snapshot.child("answers").child("answerData").val();


                      for(var i = 0; i < answerCount; i++) {
                        var a = {
                          content: "",
                          answererID: null,
                          answerID: null
                        }

                        a.content = answerInformation[i].answerText;
                        a.answererID = answerInformation[i].answererID;
                        a.answerID = i;

                        qaJSON.answers.push(a);
                      }


                      quizQuestions[0] = qaJSON;
                      const shuffledAnswerOptions = quizQuestions.map((question) => componentVariable.shuffleArray(question.answers));
                      console.log(shuffledAnswerOptions[0]);
                      componentVariable.setState({
                        question: quizQuestions[0].question,
                        answerOptions: shuffledAnswerOptions[0]
                      });

                    });

                  });

                }

              });

            });
          } else {
            window.location.href = '/signin';
          }
        });
  }


  shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    console.log("ID", this.state.questionId);
    console.log("Length", this.quizQuestions.length);

    if (this.state.questionId < quizQuestions.length) {

        setTimeout(() => this.setNextQuestion(), 300);
    } else {
        setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }
/*
  setUserAnswer(answer) {
    const updatedAnswersCount = update(this.state.answersCount, {
      [answer]: {$apply: (currentValue) => currentValue + 1}
    });

    this.setState({
        answersCount: updatedAnswersCount,
        answer: answer
    });
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
        counter: counter,
        questionId: questionId,
        question: quizQuestions[counter].question,
        answerOptions: quizQuestions[counter].answers,
        answer: ''
    });
  }
*/


  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
  }

  setResults(result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
        getTokensHandler={this.handler}
      />
    );
  }

  renderResult() {
    return (
      <Result className='title4' quizResult={this.state.result} />
    );
  }

  logoutClick = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("Succesful signing out.");

    }, function(error) {
      // An error happened.
      console.log("Error in signing out.");
    });
  }

  onSubmit = (event) => {
    event.preventDefault();

    // Determine token distribution
    var componentVariable = this;
    var tokenDistribution = [];
    var computedTotalTokens = 0;
    for(var i = 0; i < this.state.answerIDTokens.length; i++) {
      computedTotalTokens += this.state.answerIDTokens[i].tokensAwarded;
      tokenDistribution.push(0);
    }
    for(var i = 0; i < this.state.answerIDTokens.length; i++) {
      tokenDistribution[this.state.answerIDTokens[i].idOfAnswer] =  this.state.answerIDTokens[i].tokensAwarded;
    }

    var database = firebase.database();
    database.ref('/questions/questionData/' + componentVariable.state.questionId + '/tokensPledged').once("value").then(function(snapshot) {
        // Check if pledged != computed
          // If: Error
          // Else: update firebase
        var pledgedTokens = Number(snapshot.val());
        if(pledgedTokens != computedTotalTokens) {
          console.log("Error, incorrect pledged amount....");
        } else {
          for(var i = 0; i < tokenDistribution.length; i++) {
              var id = componentVariable.state.questionId
              database.ref('/questions/questionData/' + id + '/answers/answerData/' + i + '/tokensAwarded').set(tokenDistribution[i]);
          }

          database.ref('/questions/unresolved/' + componentVariable.state.questionId + '/done').set(true);

          // Update on firebase after tokens distributed.
          for(var i = 0; i < componentVariable.state.answerIDTokens.length; i++) {
            var tokensAwarded = componentVariable.state.answerIDTokens[i].tokensAwarded;
            var answererID = componentVariable.state.answerIDTokens[i].answererID;
            database.ref('/users/userData/' + answererID + '/numTokens').once("value").then(function(snapshot) {
              var curVal = Number(snapshot.val());
              database.ref('/users/userData/' + answererID + '/numTokens').set(curVal + tokensAwarded);
            });

          }

        }
    });


    database.ref('/questions/questionData/' + componentVariable.state.questionId + '/tokensPledged').once("value").then(function(snapshot) {
        var pledgedTokens = Number(snapshot.val());

        // First, check if correct number of tokens allocated.
        if(pledgedTokens != computedTotalTokens) {
          console.log("Error, incorrect pledged amount....");
        } else {
          // Solidity Integration giving tokens
          var transactionContract = componentVariable.props.transcontract;
          var transactionInstance;

          componentVariable.props.web.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }
            var account = accounts[0];

            console.log("before deploying")
            transactionContract.deployed().then(function(instance) {
              transactionInstance = instance;
              console.log("after deploying");
              console.log("QID:" , componentVariable.state.questionId);
              console.log("Token distribution: " , tokenDistribution);
              console.log("Account: ", account);
              transactionInstance.executeTransaction(tokenDistribution, componentVariable.state.questionId, {from: account, gas: 600000}).then(function(result) {
                //for (var i = 0; i < 500; i++) {
                    console.log("transaction worked!");
                //}
              });
            });
          });

        }
      });

      // Update tokensAwarded (sucess message?)
      alert('Tokens successfully awarded!');
      location.reload();
  }

  render() {
    return (
      <div className='mainBox'>
        <div className='headerBox'>
          <div className='linksParentBox'>
            <div className='linkBox'>
              <a href="signin" className='href'>Sign In</a>
            </div>
            <div className='linkBox'>
              <a href="signup" className='href'> Sign Up</a>
            </div>
            <div className='linkBox'>
              <a href="/" className='href'>Home</a>
            </div>
            <div className='linkBox'>
              <a href="askquestion" className='href'> Ask Question</a>
            </div>
            <div className='linkBox'>
              <a href="answerquestion" className='href'> Answer Question</a>
            </div>
            <div className='linkBox'>
              <a href="reviewtokens" className='href'> Review Tokens</a>
            </div>
          </div>
        </div>
        <div className='tokenDisplay'>
        </div>
        <form className='questionForm' onSubmit = {this.onSubmit}>
          <div className='font'>
          {/*if (condition=true) return this.renderResult() else this.renderQuiz()*/}
            {this.state.result ? this.renderResult() : this.renderQuiz()}
          </div>
          <button className='submitButton1' type='submit' onClick = {this.onSubmit}>
              Submit
          </button>
        </form>
        <div className='logOutBox'>
          <button className='submitButton8' onClick={this.logoutClick}>Log Out</button>
        </div>
      </div>
    );
  }

}
