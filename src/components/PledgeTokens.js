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
      result: ''
    };

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("email: " + firebase.auth().currentUser.email);
      } else {
        window.location.href = '/signin';
      }
    });

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);


  }




  componentWillMount() {
        console.log("start of component mount");
        var database = firebase.database();


        var componentVariable = this;
          // Render question and answers with token pledging UI
          // On Submit collect tokens and distribute accordingly calling smart contract functions


        // Get current person whos logged in ID curID.
        var currentUser = firebase.auth().currentUser;
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

          currentUserID = Number(snapshot.val());

          // Go through unresolved questions, get one question questionID s.t. curID = askerID
          database.ref('/questions/unresolved/').once("value").then(function(snapshot) {

            var unresolvedQuestions = snapshot.val();
            console.log("indices", unresolvedQuestions);

            for (var i = 0; i < unresolvedQuestions.length; i++) {

                if (unresolvedQuestions[i].askerID == currentUserID) {
                  questionStorageID = unresolvedQuestions[i].questionID;
                  break;
                }
            }

            if(questionStorageID == -1) {
              console.log("No question...");
            }
            else {

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
                      type: "Default type",
                      content: "",
                      answererID: null,
                      answerID: null
                    }

                    a.content = answerInformation[i].answerText;
                    a.answererID = answerInformation[i].answererID;
                    a.answerID = i;

                    qaJSON.answers.push(a);
                  }


                  console.log("original", quizQuestions[0].answers)
                  quizQuestions[0] = qaJSON;
                  console.log("quizQuestions0", quizQuestions[0]);
                  const shuffledAnswerOptions = quizQuestions.map((question) => componentVariable.shuffleArray(question.answers));
                  console.log("shuffledAnswerOptions", shuffledAnswerOptions);
                  componentVariable.setState({
                    question: quizQuestions[0].question,
                    answerOptions: shuffledAnswerOptions[0]
                  });

                });

              });

            }

          });

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

    if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
    } else {
        setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

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
      />
    );
  }

  renderResult() {
    return (
      <Result className='title4' quizResult={this.state.result} />
    );
  }

  render() {
    return (
      <div className='mainBox1'>
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
          </div>
        </div>
        <div className='font'>
          {this.state.result ? this.renderResult() : this.renderQuiz()}
        </div>
        <button className='submitButton1' type='submit'>
            Submit
        </button>
      </div>
    );
  }

}
