export default function Profilepic(props) {
    console.log("profile-pic functional component loaded");
    // console.log("profile-pic props: ", props);
    return (
        <div>
            <img
                onClick={props.toggleUploader}
                className="profile-img"
                alt={`${props.firstname} ${props.lastname}`}
                src={props.imgUrl}
            />
            <p className="p-style-1">
                {props.firstname} {props.lastname}
            </p>
        </div>
    );
}
