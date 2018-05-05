import React, { Component } from 'react';
import update from 'react-addons-update';
import quizQuestions from './helpers/quizQuestions';
import Quiz2 from './helpers/Quiz2';
import Result from './helpers/Result';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Button } from 'reactstrap';
import GithubUsers from './helpers/GithubUsers';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

require('firebase');


export default class ReviewTokens extends Component {

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
      answerIDTokens: [],
      curID: 0
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


  componentWillMount() {
        console.log("start of component mount");
        var componentVariable = this;

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // Gets current user, logged in.
            console.log("email: " + firebase.auth().currentUser.email);
            console.log("current User: ", firebase.auth().currentUser);

            var database = firebase.database();

            var currentUser = firebase.auth().currentUser;
            console.log("current User: ", currentUser);
            var email;
            if (currentUser != null) {
              email = (currentUser.email).replace(/\./g, '_');
              console.log("submit email: " + email);
            }

            // Struct tracks question and the answers and answer ids.
            var currentUserID;
            var questionStorageID = -1;
            var qaJSON =
              {question: "",
               questionID: null,
               askerID: "",
               answers: []
              };

            // Get the userID of current user.
            database.ref('/users/emailsToIDs/' + email + '/userID').once("value").then(function(snapshot) {

              console.log("id: ", snapshot.val());
              currentUserID = Number(snapshot.val());
              componentVariable.setState({curID: currentUserID});


              // Go through unresolved questions list. Find first question where "done" is true.
              // and the askerId is not equal to currentUserId.
              database.ref('/questions/unresolved/').once("value").then(function(snapshot) {

                var unresolvedQuestions = snapshot.val();

                database.ref('/questions/').once("value").then(function(globalSnap) {
                  var questData = globalSnap.child("questionData").val();



                  console.log("indices", unresolvedQuestions);
                  console.log("length: ", unresolvedQuestions.length);

                  for (var i = 0; i < unresolvedQuestions.length; i++) {

                      if (globalSnap.child("questionData").child(i).hasChild("answers") && globalSnap.child("questionData").child(i).hasChild("reviewers")) {
                          // run some code

                        var found = true;
                        for(var j = 0; j < questData[i].answers.answerCount; j++) {
                            if(questData[i].answers.answerData[j].answererID == currentUserID) {
                              found = false;
                              break;
                            }
                        }

                        var review = true;
                        for(var k = 0; k < questData[i].reviewers.reviewerCount; k++) {
                            if(questData[i].reviewers.reviewerData[k].reviewerID == currentUserID) {
                              review = false;
                              break;
                            }
                        }


                        if (review && found && unresolvedQuestions[i].reviewerCount < 3 && unresolvedQuestions[i].done == true && unresolvedQuestions[i].askerID != currentUserID) {
                          questionStorageID = unresolvedQuestions[i].questionID;
                          break;
                        }

                      }
                    }


                  if(questionStorageID == -1) {
                    console.log("No question to review.");
                  }
                  else {
                    // Set state for the question id to be reviewed.
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
      <Quiz2
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

    // 1. Each rating is between 1 and 5. (Give some console.log error for now). - DONE.
    // 2. Create field for reviewerIDs (answerquestion file) - DONE,
    // record the reviewer Ids in this file and update counts - DONE.
    // In rendering of questions, check the number of reviewers is less than 3 - DONE.
    // Set and update reviewerCount in unresolved questions - DONE.
    // 3. Under each index in AnswerData, create a field to hold list of ratings. Insert rating for
    // each answer (loop through each answer) - DONE.
    // 4. After 3 reviewers, determine whether there is a strike (do some math).
    // Take pledgeToken list and take distribution of ratings for every answer. Make sure answerers can't see question.
    // function to figure out whethere there is a strike.
    // 5. Update display with the number of strikes.
    // 6. Pay something to each reviewer?? (Solidity).

    // Pull review distribution.
    var componentVariable = this;
    var reviewDistribution = [];
    console.log("ANSWER ID TOKEN LENGTH", this.state.answerIDTokens.length);
    for(var i = 0; i < this.state.answerIDTokens.length; i++) {
      reviewDistribution.push(0);
    }
    for(var i = 0; i < this.state.answerIDTokens.length; i++) {
      reviewDistribution[this.state.answerIDTokens[i].idOfAnswer] =  this.state.answerIDTokens[i].tokensAwarded;
    }

    // Check if all the ratings are between 1 and 5.
    for(var i = 0; i < reviewDistribution.length; i++) {
      // TODO: ALERT MESSAGE FOR TOKEN DISTRIBUTION.
      console.log(reviewDistribution[i]);
      if(reviewDistribution[i] < 1 || reviewDistribution[i] > 5) {
        console.log("Rating must be between 1 and 5.");
        break;
      }
    }

    var database = firebase.database();
    var selectedQuestionID = componentVariable.state.questionId;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        // Get the count to set the reviewerID and increment count. Update in unresolved list too.
        var newReviewerNumber;
        database.ref('/questions/questionData/'+ componentVariable.state.questionId + '/reviewers/reviewerCount').once("value").then(function(snapshot) {
          newReviewerNumber = Number(snapshot.val());
          database.ref('/questions/questionData/' + selectedQuestionID + '/reviewers/reviewerCount').set(newReviewerNumber + 1);
          database.ref('/questions/questionData/' + selectedQuestionID + '/reviewers/reviewerData/' + newReviewerNumber).set({
            reviewerID : componentVariable.state.curID
          });
          console.log("HERE ", componentVariable.state.curID);
          database.ref('/questions/unresolved/' + selectedQuestionID + '/reviewerCount').set(newReviewerNumber + 1);


          // Sets the rating number for every answer.
          for(var i = 0; i < reviewDistribution.length; i++) {
            var rating = reviewDistribution[i];
            database.ref('/questions/questionData/' + componentVariable.state.questionId + '/answers/answerData/' + i + '/reviewerRatings/' + newReviewerNumber).set(rating);
          }

          database.ref('/users/userData/' + componentVariable.state.curID + '/numTokens').once("value").then(function(snapshot) {
            var currentTokenNum = Number((snapshot.val()));
            var numTokens = Math.floor(Math.random()*(10-5+1)+5);
            database.ref('/users/userData/' + componentVariable.state.curID + '/numTokens').set(currentTokenNum + numTokens);
          });

          // Once 3 reviewers...
          if(newReviewerNumber == 2) {
            console.log("Enter 3 reviewers...");


            // Get the tokens pledged for a certain question.
            database.ref('/questions/questionData/' + componentVariable.state.questionId + '/answers/answerData/').once("value").then(function(answerSnap) {
              var answer = answerSnap.val();
              var pledgeList = [];
              var strike = false;

              for(var i = 0; i < answer.length; i++) {
                pledgeList.push(answer[i].tokensAwarded);
              }

              var reviewDistributions = [];
              for (var i = 0; i < answer.length; i++) {
                var specificDistribution = answer[i].reviewerRatings;
                var dist = [];
                for(var j = 0; j < specificDistribution.length; j++) {
                  dist.push(specificDistribution[j]);
                }
                reviewDistributions.push(dist);
              }

              // DO SOME MATHEMATICS
              console.log(pledgeList)
              // Review Distributions: List of List of ratings for every questions.
              // Each list should have 3 responses.
              var penalty = 0;
              for(var k = 0; k < reviewDistributions.length; k++) {
                var average = (reviewDistributions[k][0] + reviewDistributions[k][1] + reviewDistributions[k][2] - 3) * 25.0 / 3;
                var difference = pledgeList[k] - average;
                if (difference > 0) {
                  penalty += difference * difference;
                }
              }

              if(penalty >= 2500) {
                strike = true;
              }
              console.log(strike);

              // Get the id of the asker and mark them as a strike.
              if(strike) {
                database.ref('/questions/questionData/' + componentVariable.state.questionId + '/askerID').once("value").then(function(snapshot) {
                  var askerID = Number(snapshot.val());
                  database.ref('/users/userData/' + askerID + '/strike').set(true);

                });
              }

            });

          }
        });

      } else {
        window.location.href = '/signin';
      }
      alert('Successfully reviewed token allocation!');
      location.reload();
    });

    // database.ref('/questions/questionData/' + componentVariable.state.questionId + '/tokensPledged').once("value").then(function(snapshot) {
    //     // Check if pledged != computed
    //       // If: Error
    //       // Else: update firebase
    //     var pledgedTokens = Number(snapshot.val());
    //     if(pledgedTokens != computedTotalTokens) {
    //       console.log("Error, incorrect pledged amount....");
    //     } else {
    //       for(var i = 0; i < tokenDistribution.length; i++) {
    //           var id = componentVariable.state.questionId
    //           database.ref('/questions/questionData/' + id + '/answers/answerData/' + i + '/tokensAwarded').set(tokenDistribution[i]);
    //       }
    //
    //       database.ref('/questions/unresolved/' + componentVariable.state.questionId + '/done').set(true);
    //
    //       // Update on firebase after tokens distributed.
    //       for(var i = 0; i < componentVariable.state.answerIDTokens.length; i++) {
    //         var tokensAwarded = componentVariable.state.answerIDTokens[i].tokensAwarded;
    //         var answererID = componentVariable.state.answerIDTokens[i].answererID;
    //         database.ref('/users/userData/' + answererID + '/numTokens').once("value").then(function(snapshot) {
    //           var curVal = Number(snapshot.val());
    //           database.ref('/users/userData/' + answererID + '/numTokens').set(curVal + tokensAwarded);
    //         });
    //
    //       }
    //
    //     }
    // });
    //
    //
    // database.ref('/questions/questionData/' + componentVariable.state.questionId + '/tokensPledged').once("value").then(function(snapshot) {
    //     var pledgedTokens = Number(snapshot.val());
    //
    //     // First, check if correct number of tokens allocated.
    //     if(pledgedTokens != computedTotalTokens) {
    //       console.log("Error, incorrect pledged amount....");
    //     } else {
    //       // Solidity Integration giving tokens
    //       var transactionContract = componentVariable.props.transcontract;
    //       var transactionInstance;
    //
    //       componentVariable.props.web.eth.getAccounts(function(error, accounts) {
    //         if (error) {
    //           console.log(error);
    //         }
    //         var account = accounts[0];
    //
    //         console.log("before deploying")
    //         transactionContract.deployed().then(function(instance) {
    //           transactionInstance = instance;
    //           console.log("after deploying");
    //           console.log("QID:" , componentVariable.state.questionId);
    //           console.log("Token distribution: " , tokenDistribution);
    //           console.log("Account: ", account);
    //           transactionInstance.executeTransaction(tokenDistribution, componentVariable.state.questionId, {from: account}).then(function(result) {
    //             for (var i = 0; i < 500; i++) {
    //                 console.log("transaction worked!");
    //             }
    //           });
    //         });
    //       });
    //
    //     }
    //   });

      // Update tokensAwarded (sucess message?)

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
          </div>
        </div>
        <div className='tokenDisplay'>
        </div>
        <form className='questionForm' onSubmit = {this.onSubmit}>
          <div className='font'>
            {this.state.result ? this.renderResult() : this.renderQuiz()}
          </div>
          <button className='submitButton1' type='submit'>
              Submit
          </button>
        </form>
        <div className='logOutBox'>
          <button className='submitButton9' onClick={this.logoutClick}>Log Out</button>
        </div>
      </div>
    );
  }

}
