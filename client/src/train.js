import React from "react";
import { useEffect, useState } from "react";
import axios from "./axios";

export default class Train extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardQuestion: "START ⬇️",
            cardAnswer: "START ⬇️",
            currentCard: {},
            currentLevel: "Mix",
            currentMemoList: [],
            memoList: [], // complete list
            memoListLength: 0, // stores the number of words in the current memo_list
            memoListLength1: 0,
            memoListLength2: 0,
            memoListLength3: 0,
            memoListLength4: 0,
            memoListLength5: 0,
            memoList1: [],
            memoList2: [],
            memoList3: [],
            memoList4: [],
            memoList5: [],
            memoListLengthAll: 0,
        };
    }
    componentDidMount() {
        console.log("train component successfully mounted");
        console.log("train component props: ", this.props);
        this.getMemoContent();
    }
    getMemoContent() {
        axios
            .get("/get-memo-content")
            .then((data) => {
                console.log("axios request to /get-memo-content successful");
                // console.log("memo list data:", data.data.data);

                this.setState({
                    memoList: data.data.data,
                });
                this.updateMemoListsLength();
                this.getCurrentLevelContent();
            })
            .catch((err) => {
                console.log(
                    "Error when making axios request to /get-memo-content route: ",
                    err
                );
            });
    }
    getCurrentLevelContent() {
        if (this.state.currentLevel == "Mix") {
            this.setState({
                currentMemoList: this.state.memoList,
            });
        } else {
            this.setState({
                currentMemoList:
                    this.state[`memoList${this.state.currentLevel}`],
            });
        }
        // console.log("currentMemoList:", this.state.currentMemoList);
    }
    toggleCard(e) {
        console.log("Card was clicked");
        document
            .getElementsByClassName("memo-card-inner")[0]
            .classList.toggle("is-flipped");
    }
    nextWord() {
        console.log("nextWord was activated");
        this.updateMemoListsLength(); // DELETE LATER!
        const randomNumber = this.getRandomNumber(
            this.state.currentMemoList.length
        );
        // console.log(this.state.memoList[randomNumber]);
        this.setState({
            currentCard: this.state.currentMemoList[randomNumber - 1],
        });
        // console.log("this.state.currentCard: ", this.state.currentCard);
        const newQuestion =
            this.state.currentMemoList[randomNumber - 1].content_1;

        const newAnswer =
            this.state.currentMemoList[randomNumber - 1].content_2;

        this.setState({
            showQuestion: true,
            showAnswer: false,
            cardQuestion: newQuestion,
            cardAnswer: newAnswer,
        });
    }
    getRandomNumber(numberLimit) {
        return Math.floor(Math.random() * numberLimit) + 1;
    }
    updateMemoLevel() {
        // Update memo-level in database:
        axios
            .post("/update-memo-level", {
                memo_id: this.state.currentCard["id"],
                memo_level: this.state.currentCard["memo_level"],
            })
            .then((data) => {
                console.log(
                    "Axios request to /update-memo-level route successfull"
                );
                // console.log(
                //     "data from axios request to /update-memo-level: ",
                //     data
                // );
            })
            .catch((err) => {
                console.log(
                    "Error when making axios request to /update-memo-level"
                );
            });
    }
    memoLevelUp() {
        // console.log("memo-level: ", this.state.currentCard["memo_level"]);
        // Level up the memo_level (if it is less than 5):
        if (this.state.currentCard["memo_level"] < 5) {
            // Increase the memo level of the card:
            this.state.currentCard["memo_level"]++;
            // Reduce this memo list's length
            this.setState({
                memoListLength: this.state.memoListLength - 1,
            });
        }
        console.log("memo-level : ", this.state.currentCard["memo_level"]);
        // Update memo-level in database:
        this.updateMemoLevel();
        this.getMemoContent(); // new
        this.nextWord();
    }
    memoLevelDown() {
        console.log("memo-level: ", this.state.currentCard["memo_level"]);

        if (this.state.currentCard["memo_level"] > 1) {
            // Reset the memo level of this card back to 1
            this.state.currentCard["memo_level"] = 1;
            // Reduce this memo list's length
            this.setState({
                memoListLength: this.state.memoListLength - 1,
            });
        }

        // console.log("memo-level: ", this.state.currentCard["memo_level"]);

        // Update memo-level in database:
        this.updateMemoLevel();
        this.getMemoContent(); // new
        this.nextWord();
    }
    switchMemoLevel(e) {
        console.log("switchMemoLevel was clicked");

        // console.log(e.target.textContent);

        // Remove highlighting class from previous memo level
        document
            .getElementsByClassName("active-memo-level")[0]
            .classList.remove("active-memo-level");
        // Add highlighting class to new memo level
        e.target.classList.add("active-memo-level");

        // Check buttons textcontent and re-assign current-level:
        if (e.target.textContent == "MEMO-1") {
            this.setState({
                currentLevel: "1",
            });
        } else if (e.target.textContent == "MEMO-2") {
            this.setState({
                currentLevel: "2",
            });
        } else if (e.target.textContent == "MEMO-3") {
            this.setState({
                currentLevel: "3",
            });
        } else if (e.target.textContent == "MEMO-4") {
            this.setState({
                currentLevel: "4",
            });
        } else if (e.target.textContent == "MEMO-5") {
            this.setState({
                currentLevel: "5",
            });
        } else {
            this.setState({
                currentLevel: "Mix",
            });
        }
        this.getMemoContent();
        this.nextWord();
        this.setState({
            // cardQuestion: "QUESTION",
            cardQuestion: "START ⬇️",
            // cardQuestion: "JAPANESE",
            // cardAnswer: "ANSWER",
            cardAnswer: "START ⬇️",
            // cardAnswer: "ENGLISH",
        });
    }
    updateMemoListsLength(listNumber) {
        // console.log("memoList: ", this.state.memoList);

        // Use filter to get the number of items in each item list:
        const memoListLevel1 = this.state.memoList.filter((val) => {
            return val["memo_level"] == 1;
        });
        const memoListLevel2 = this.state.memoList.filter((val) => {
            return val["memo_level"] == 2;
        });
        const memoListLevel3 = this.state.memoList.filter((val) => {
            return val["memo_level"] == 3;
        });
        const memoListLevel4 = this.state.memoList.filter((val) => {
            return val["memo_level"] == 4;
        });
        const memoListLevel5 = this.state.memoList.filter((val) => {
            return val["memo_level"] == 5;
        });
        this.setState({
            memoListLengthAll: this.state.memoList.length,
            memoListLength1: memoListLevel1.length,
            memoListLength2: memoListLevel2.length,
            memoListLength3: memoListLevel3.length,
            memoListLength4: memoListLevel4.length,
            memoListLength5: memoListLevel5.length,
            memoList1: memoListLevel1,
            memoList2: memoListLevel2,
            memoList3: memoListLevel3,
            memoList4: memoListLevel4,
            memoList5: memoListLevel5,
        });
        console.log("this.state.memoListLength3: ", this.state.memoListLength3);
    }
    render() {
        return (
            <div className="memo-card-outer-container">
                {/* Memo Level buttons: */}
                <div className="memo-level-display">
                    <div>
                        <button
                            className="active-memo-level"
                            onClick={(e) => this.switchMemoLevel(e)}
                        >
                            MEMO-Mix
                        </button>
                        <span>({this.state.memoListLengthAll})</span>
                    </div>
                    <div>
                        <button onClick={(e) => this.switchMemoLevel(e)}>
                            MEMO-1
                        </button>
                        <span>({this.state.memoListLength1})</span>
                    </div>
                    <div>
                        <button onClick={(e) => this.switchMemoLevel(e)}>
                            MEMO-2
                        </button>
                        <span>({this.state.memoListLength2})</span>
                    </div>
                    <div>
                        <button onClick={(e) => this.switchMemoLevel(e)}>
                            MEMO-3
                        </button>
                        <span>({this.state.memoListLength3})</span>
                    </div>
                    <div>
                        <button onClick={(e) => this.switchMemoLevel(e)}>
                            MEMO-4
                        </button>
                        <span>({this.state.memoListLength4})</span>
                    </div>
                    <div>
                        <button onClick={(e) => this.switchMemoLevel(e)}>
                            MEMO-5
                        </button>
                        <span>({this.state.memoListLength5})</span>
                    </div>
                </div>

                {/* Display of current memo level (above card) */}
                <div>
                    <div className="current-memo-level-display">
                        Memo-Level: {this.state.currentLevel}
                    </div>
                </div>

                {/* Memo-Card */}
                <div className="memo-card-container">
                    <div
                        className="memo-card-inner"
                        onClick={(e) => this.toggleCard(e)}
                    >
                        <div className="memo-card flex-center memo-question">
                            <h2>{this.state.cardQuestion}</h2>
                        </div>

                        <div className="memo-card flex-center memo-answer">
                            <h2>{this.state.cardAnswer}</h2>
                        </div>
                    </div>
                </div>

                <br />

                {/* NO, NEXT and YES buttons */}
                <div className="flex-center">
                    <div className="flex card-width">
                        <button
                            onClick={() => this.memoLevelDown()}
                            className="red-button"
                        >
                            ❌
                        </button>
                        <button
                            onClick={() => this.nextWord()}
                            className="yellow-button"
                        >
                            NEXT
                        </button>
                        <button onClick={() => this.memoLevelUp()}>✔️</button>
                    </div>
                </div>
            </div>
        );
    }
}
