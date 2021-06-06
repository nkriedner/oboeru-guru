import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("uploader successfully mounted");
        console.log("uploader props: ", this.props);
    }
    handleChange(e) {
        console.log("e.target.name:", e.target.name); // -> file
        console.log("e.target.value:", e.target.value);
        console.log("e.target.files:", e.target.files);
        this.setState({
            [e.target.name]: e.target.files[0],
        });
    }
    submit(e) {
        e.preventDefault();
        console.log("Upload button was clicked.");
        console.log("this.state.file: ", this.state.file);
        const formData = new FormData(); // IMPORTANT: formData will give an empty object when logged
        formData.append("file", this.state.file);
        axios
            .post("upload", formData)
            .then((response) => {
                console.log("Upload response: ", response);
                this.props.updateProfilePic(response.data.imageurl);
            })
            .catch((err) => {
                console.log("Error in axios post for upload of image: ", err);
            });
    }
    render() {
        return (
            <div className="uploader">
                <span onClick={this.props.toggleUploader}>X</span>
                <div>
                    <h2>Want to change your image?</h2>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="file"
                        name="file"
                        accept="image/"
                    />
                    <button onClick={(e) => this.submit(e)}>Upload</button>
                </div>
            </div>
        );
    }
}
