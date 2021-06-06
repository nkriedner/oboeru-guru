import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset-password";

export default function Welcome() {
    console.log("welcome functional component loaded");
    return (
        <div>
            <div className="flex-center">
                <h1>Learn to remember anything!</h1>
            </div>
            <div className="flex-center">
                {/* Logo */}
                <h1 className="welcome-logo flex-center">
                    Oboeru
                    <br />
                    Guru
                </h1>
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
