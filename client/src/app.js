import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Logo from "./logo";
import Uploader from "./uploader";
import Profilepic from "./profile-pic";
import Profile from "./profile";
import axios from "axios";
import Train from "./train";
import Add from "./add";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            imgUrl: null,
            showUploader: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.updateProfilePic = this.updateProfilePic.bind(this);
        this.setNewBio = this.setNewBio.bind(this);
    }
    componentDidMount() {
        console.log("app component successfully mounted");
        axios
            .get("/user")
            .then((data) => {
                console.log("Received user data from /user route");
                // console.log(
                //     "response from axios request in app component: ",
                //     data
                // );
                this.setState({
                    firstname: data.data.first_name,
                    lastname: data.data.last_name,
                    imgUrl: data.data.imageurl,
                    bio: data.data.bio,
                });
            })
            .catch((err) => {
                console.log(
                    "Error when making axios request to /users route: ",
                    err
                );
            });
    }
    toggleUploader() {
        console.log("toggleUploader was activated!");
        this.setState({
            showUploader: !this.state.showUploader,
        });
    }
    updateProfilePic(imgUrl) {
        this.setState({
            imgUrl,
        });
        this.toggleUploader();
    }
    setNewBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }
    render() {
        return (
            <div>
                <div className="flex banner-top">
                    <Logo />
                    <div className="flex navbar">
                        <a href="/">Home</a>
                        <a href="/add">Add Content</a>
                        <a href="/train">Train</a>
                        <a href="/logout">Logout</a>
                    </div>
                    <Profilepic
                        updateProfilePic={this.updateProfilePic} //  needed?
                        toggleUploader={this.toggleUploader}
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        imgUrl={this.state.imgUrl || "/user-img.png"}
                    />
                </div>
                <BrowserRouter>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                setNewBio={this.setNewBio}
                                firstname={this.state.firstname}
                                lastname={this.state.lastname}
                                imgUrl={this.state.imgUrl || "/user-img.png"}
                                bio={this.state.bio}
                            />
                        )}
                    />
                    <Route path="/train" component={Train} />
                    <Route path="/add" component={Add} />
                </BrowserRouter>
                {this.state.showUploader && (
                    <Uploader
                        updateProfilePic={this.updateProfilePic}
                        toggleUploader={this.toggleUploader}
                    />
                )}
            </div>
        );
    }
}
