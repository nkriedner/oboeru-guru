import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 1, // from 1-3 of the reset password steps
        };
    }
    componentDidMount() {
        console.log("reset-password successfully mounted");
        // console.log("reset-password props: ", this.props);
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }
    submit(e) {
        console.log("Reset password submit button was clicked.");
        e.preventDefault(); // <---- VERY IMPORTANT ;-)
        this.setState({
            error: null,
        });
        if (this.state.view === 1) {
            console.log("Resetting password - step 1...");
            axios
                .post("/reset-password/start", {
                    email: this.state.email,
                })
                .then(({ data }) => {
                    // console.log("data: ", data);
                    if (data.success) {
                        this.setState({
                            view: 2,
                        });
                    } else {
                        this.setState({
                            error: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(
                        "Error when resetting password in view 1: ",
                        err
                    );
                    this.setState({
                        error: true,
                    });
                });
        } else if (this.state.view === 2) {
            console.log("Resetting passwrod - step 2...");
            axios
                .post("/reset-password/verify", {
                    email: this.state.email,
                    password: this.state.password,
                    code: this.state.code,
                })
                .then(({ data }) => {
                    // console.log("data: ", data);
                    if (data.success) {
                        this.setState({
                            view: 3,
                        });
                    } else {
                        this.setState({
                            error: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(
                        "Error when resetting password in view 2: ",
                        err
                    );
                    this.setState({
                        error: true,
                    });
                });
        }
    }
    determineViewToRender() {
        if (this.state.view === 1) {
            return (
                <div>
                    <div className="flex-center">
                        <h2>Reset Password</h2>
                    </div>
                    {this.state.error && (
                        <p className="error-message">
                            Something went wrong. Probably either email or
                            password is wrong. Please try again!
                        </p>
                    )}
                    <p>Please enter the email with which you registered!</p>
                    <div>
                        <div className="input-container">
                            <div>
                                <label htmlFor="email">Email Address:</label>
                            </div>
                            <div>
                                <input
                                    onChange={(e) => this.handleChange(e)}
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <button onClick={(e) => this.submit(e)}>
                                Send verification code
                            </button>
                        </div>
                    </div>
                    <p>
                        Back to login?&nbsp;
                        <Link className="welcome-links" to="/login">
                            Login!
                        </Link>
                    </p>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div>
                    <div className="flex-center">
                        <h2>Reset Password</h2>
                    </div>
                    {this.state.error && (
                        <p className="error-message">
                            Something went wrong, seems like the verification
                            code was incorrect, please try again!
                        </p>
                    )}
                    <p>
                        Please enter the verification code sent to your email!
                    </p>
                    <div>
                        <div className="input-container">
                            <div>
                                <label htmlFor="code">Verification Code:</label>
                            </div>
                            <div>
                                <input
                                    onChange={(e) => this.handleChange(e)}
                                    id="code"
                                    type="text"
                                    name="code"
                                    defaultValue=""
                                    key=""
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-container">
                            <div>
                                <label htmlFor="password">New Password:</label>
                            </div>
                            <div>
                                <input
                                    onChange={(e) => this.handleChange(e)}
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <button onClick={(e) => this.submit(e)}>
                                Save password
                            </button>
                        </div>
                    </div>
                    <p>
                        Back to login?&nbsp;
                        <Link className="welcome-links" to="/login">
                            Login!
                        </Link>
                    </p>
                </div>
            );
        } else if (this.state.view === 3) {
            return (
                <div>
                    <div className="flex-center">
                        <h2>You successfully reset your password!</h2>
                    </div>
                    <p>
                        Continue to&nbsp;
                        <Link to="/login">Log in!</Link>
                    </p>
                </div>
            );
        }
    }
    render() {
        return this.determineViewToRender();
    }
}
