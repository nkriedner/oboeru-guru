// import BioEditor from "./bio-editor";
import ContentEditor from "./content-editor";

export default function Profile(props) {
    console.log("profile functional component loaded");
    console.log("profile props: ", props);
    return (
        <div className="profile-flex">
            <img
                className="profile-img-big"
                alt={`${props.firstname} ${props.lastname}`}
                src={props.imgUrl}
            />
            <div className="margin-left-3">
                <h2>
                    {/* {props.firstname} {props.lastname} */}
                    Content Setting
                </h2>
                <p className="p-style-1">{props.bio}</p>
                <ContentEditor bio={props.bio} setNewBio={props.setNewBio} />
            </div>
        </div>
    );
}
