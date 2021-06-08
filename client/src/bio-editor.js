import axios from "./axios";
import React from "react";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTexteditor: false,
        };
    }
    componentDidMount() {
        console.log("content-editor successfully mounted");
        // console.log("bio-editor props: ", this.props);
    }
    handleChange({ target }) {
        // console.log(target.name, target.value);
        this.setState({
            [target.name]: target.value,
        });
        console.log(target.value);
    }
    submit(e) {
        console.log("Save submit button was clicked.");
        e.preventDefault(); // <---- VERY IMPORTANT ;-)
        this.setState({
            error: null,
            showTexteditor: false,
        });
        axios
            .post("/update-bio", {
                // <- CHANGE
                bio: this.state.bio_draft,
            })
            .then((response) => {
                console.log(
                    "response from axios request to update bio: ", // <- CHANGE
                    response
                );
                console.log("response.data.bio: ", response.data.bio); // <- CHANGE
                this.props.setNewBio(response.data.bio); // <- CHANGE
            })
            .catch((err) => {
                console.log(
                    "Error when sending axios request to update bio: ", // <- CHANGE
                    err
                );
            });
    }
    toggleTextEditor() {
        this.setState({
            showTexteditor: true,
        });
    }
    setNewBio(newBio) {
        // <- CHANGE
        this.setState({
            bio: newBio, // <- CHANGE
        });
    }
    render() {
        return (
            <div>
                {/* IF Text editor IS activated: */}
                {this.state.showTexteditor && (
                    <div>
                        <label htmlFor="content_name_1">Content Name 1:</label>
                        <input
                            id="content_name_1"
                            onChange={(e) => this.handleChange(e)}
                            name="content_name_1"
                            defaultValue={this.props["content_name_1"]}
                            placeholder="eg: Japanese"
                        ></input>
                        <br />
                        <label htmlFor="content_name_2">Content Name 2:</label>
                        <input
                            id="content_name_2"
                            onChange={(e) => this.handleChange(e)}
                            name="content_name_2"
                            defaultValue={this.props["content_name_1"]}
                            placeholder="eg: English"
                        ></input>
                    </div>
                )}
                {/* IF there are NO content-names & Text editor is NOT activated: */}
                {!this.props.content_name_1 && !this.state.showTexteditor && (
                    <div>
                        <button onClick={(e) => this.toggleTextEditor()}>
                            Add Content-Names
                        </button>
                    </div>
                )}
                {/* IF there is at least one content-name & Text editor is activated: */}
                {this.props.bio && !this.state.showTexteditor && (
                    <div>
                        <button onClick={(e) => this.toggleTextEditor()}>
                            Edit Content-Names
                        </button>
                    </div>
                )}
                {/* IF there is NO content-name & Text editor IS activated: */}
                {this.state.showTexteditor && (
                    <div>
                        <button onClick={(e) => this.submit(e)}>Save</button>
                    </div>
                )}
            </div>
        );
    }
}
