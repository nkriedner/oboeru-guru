import React from "react";
import axios from "./axios";

export default class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showQuestion: true,
            showList: false,
        };
    }
    componentDidMount() {
        console.log("add component successfully mounted");
        console.log("add component props: ", this.props);

        // Make axios request to /get-memo-content route:
        this.getMemoContent();
    }
    getMemoContent() {
        axios
            .get("/get-memo-content")
            .then((data) => {
                console.log("axios request to /get-memo-content successful");
                console.log("memo list data:", data.data.data);

                this.setState({
                    memoList: data.data.data,
                });
            })
            .catch((err) => {
                console.log(
                    "Error when making axios request to /get-memo-content route: ",
                    err
                );
            });
    }
    handleChange({ target }) {
        console.log(target.name, target.value);
        this.setState({
            [target.name]: target.value,
        });
        // console.log(target.value);
    }
    submit(e) {
        console.log("Save submit button was clicked.");
        // Clear input fields for new input:
        document.getElementById("content_1").value = "";
        document.getElementById("content_2").value = "";
        e.preventDefault(); // <---- VERY IMPORTANT ;-)
        axios
            .post("/add-memo-content", {
                content_1: this.state.content_1,
                content_2: this.state.content_2,
            })
            .then((response) => {
                console.log(
                    "response from axios request to add memo content: ",
                    response
                );
                console.log("response.data: ", response.data);
                // this.props.setNewBio(response.data.bio);
            })
            .catch((err) => {
                console.log(
                    "Error when making axios post request to add memo content: ",
                    err
                );
            });
    }
    showList(e) {
        // Remove highlighting class from previous memo level
        document
            .getElementsByClassName("active-memo-level")[0]
            .classList.remove("active-memo-level");
        // Add highlighting class to new memo level
        e.target.classList.add("active-memo-level");

        this.getMemoContent();

        this.setState({
            showlist: true,
        });
    }
    hideList(e) {
        // Remove highlighting class from previous memo level
        document
            .getElementsByClassName("active-memo-level")[0]
            .classList.remove("active-memo-level");
        // Add highlighting class to new memo level
        e.target.classList.add("active-memo-level");

        this.setState({
            showlist: false,
        });
    }
    render() {
        return (
            <div>
                <div className="memo-level-display">
                    <div>
                        <button
                            onClick={(e) => this.hideList(e)}
                            className="active-memo-level"
                        >
                            ADD
                        </button>
                    </div>
                    <div>
                        <button onClick={(e) => this.showList(e)}>
                            LIST ALL
                        </button>
                    </div>
                </div>
                {this.state.error && (
                    <p className="error-message">
                        Something went wrong, please try again!
                    </p>
                )}
                {!this.state.showlist && (
                    <form className="content-add-form">
                        <textarea
                            id="content_1"
                            onChange={(e) => this.handleChange(e)}
                            name="content_1"
                            // placeholder="Content 1"
                            placeholder="Japanese"
                            required
                        ></textarea>
                        <textarea
                            id="content_2"
                            onChange={(e) => this.handleChange(e)}
                            name="content_2"
                            // placeholder="Content 2"
                            placeholder="English"
                            required
                        ></textarea>
                        <button type="submit" onClick={(e) => this.submit(e)}>
                            Add content
                        </button>
                    </form>
                )}
                {this.state.showlist && (
                    <>
                        {/* <div className="list-content flex-center">
                            <h1>Oboeru Content</h1>
                        </div> */}
                        <div className="flex-center">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Japanese</th>
                                        <th>English</th>
                                        <th>LVL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.memoList.map(
                                        (memoContent, index) => {
                                            {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            {
                                                                memoContent[
                                                                    "content_1"
                                                                ]
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                memoContent[
                                                                    "content_2"
                                                                ]
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                memoContent[
                                                                    "memo_level"
                                                                ]
                                                            }
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        );
    }
}
