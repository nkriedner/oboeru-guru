import React from "react";
import axios from "./axios";
// To use the Link component from HashRouter:
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("registration successfully mounted");
        // console.log("registration props: ", this.props);
    }
    submit(e) {
        console.log("Register submit button was clicked.");
        e.preventDefault(); // <---- VERY IMPORTANT ;-)
        axios
            .post("/registration", {
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                email: this.state.email,
                password: this.state.password,
            })
            .then(({ data }) => {
                // console.log("data: ", data);
                if (data.success) {
                    console.log("replacing locaction with /");
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
                    <h2>Register to enter!</h2>
                </div>
                {this.state.error && (
                    <p className="error-message">
                        Something went wrong, please try again!
                    </p>
                )}
                <form>
                    <div className="input-container">
                        <div>
                            <label htmlFor="firstname">First Name:</label>
                        </div>
                        <div>
                            <input
                                onChange={(e) => this.handleChange(e)}
                                id="firstname"
                                type="text"
                                name="firstname"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-container">
                        <div>
                            <label htmlFor="lastname">Last Name:</label>
                        </div>
                        <div>
                            <input
                                onChange={(e) => this.handleChange(e)}
                                id="lastname"
                                type="text"
                                name="lastname"
                                required
                            />
                        </div>
                    </div>
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
                        <button onClick={(e) => this.submit(e)}>
                            Register
                        </button>
                    </div>
                </form>
                <p>
                    Already a member?&nbsp;
                    <Link className="welcome-links" to="/login">
                        Log in!
                    </Link>
                </p>
            </div>
        );
    }
}
