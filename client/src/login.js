import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("login successfully mounted");
        console.log("login props: ", this.props);
    }
    submit(e) {
        console.log("Login submit button was clicked.");
        e.preventDefault(); // <---- VERY IMPORTANT ;-)
        this.setState({
            error: null,
        });
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then(({ data }) => {
                // console.log("data: ", data);
                if (data.success) {
                    console.log("login successfull");
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }
    render() {
        return (
            <div>
                <div className="flex-center">
                    <h2>Login please!</h2>
                </div>
                {this.state.error && (
                    <p className="error-message">
                        Something went wrong. Probably either email or password
                        is wrong. Please try again!
                    </p>
                )}
                <form>
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
                    <div className="input-container">
                        <div>
                            <label htmlFor="password">Password:</label>
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
                        <button onClick={(e) => this.submit(e)}>Login</button>
                    </div>
                </form>
                <p>
                    Not registered yet?&nbsp;
                    <Link className="welcome-links" to="/">
                        Register!
                    </Link>
                </p>
                <p>
                    Forgot your password?&nbsp;
                    <Link className="welcome-links" to="/reset-password">
                        Reset password!
                    </Link>
                </p>
            </div>
        );
    }
}
