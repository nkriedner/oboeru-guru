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
        console.log("bio-editor successfully mounted");
        console.log("bio-editor props: ", this.props);
    }
    handleChange({ target }) {
        // console.log(target.name, target.value);
        this.setState({
            [target.name]: target.value,
        });
        // console.log(target.value);
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
                bio: this.state.bio_draft,
            })
            .then((response) => {
                console.log(
                    "response from axios request to update bio: ",
                    response
                );
                console.log("response.data.bio: ", response.data.bio);
                this.props.setNewBio(response.data.bio);
            })
            .catch((err) => {
                console.log(
                    "Error when sending axios request to update bio: ",
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
        this.setState({
            bio: newBio,
        });
    }
    render() {
        return (
            <div>
                {/* IF Text editor IS activated: */}
                {this.state.showTexteditor && (
                    <div>
                        <textarea
                            onChange={(e) => this.handleChange(e)}
                            name="bio_draft"
                            defaultValue={this.props.bio}
                        ></textarea>
                    </div>
                )}
                {/* IF there is NO bio & Text editor is NOT activated: */}
                {!this.props.bio && !this.state.showTexteditor && (
                    <div>
                        <button onClick={(e) => this.toggleTextEditor()}>
                            Add Bio
                        </button>
                    </div>
                )}
                {/* IF there is a bio & Text editor is activated: */}
                {this.props.bio && !this.state.showTexteditor && (
                    <div>
                        <button onClick={(e) => this.toggleTextEditor()}>
                            Edit Bio
                        </button>
                    </div>
                )}
                {/* IF there is NO bio & Text editor IS activated: */}
                {this.state.showTexteditor && (
                    <div>
                        <button onClick={(e) => this.submit(e)}>Save</button>
                    </div>
                )}
            </div>
        );
    }
}
