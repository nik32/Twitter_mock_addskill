import React, {useState, useEffect, useRef} from 'react';
import M from 'materialize-css';

import ProfileModal from '../components/ProfileModal';

const Person = (props) => {
    const colors = ["red", "green", "blue", "yellow", "purple", "pink"];
    let random_color = `material-icons circle ${colors[Math.floor(Math.random() * 108) % 6]}`;

    let data_target = null, class_val = "title", onClick_val = null, cursor_style = null;
    if(props.show_profile){
        cursor_style = "pointer";
        data_target = "modal2";
        class_val = "title modal-trigger";
        onClick_val = () => setProfile(true);
    }

    const [profile, setProfile] = useState(false);
    let tweet_pics_ref = useRef(null);
    useEffect( () => M.Materialbox.init(tweet_pics_ref.current), []);

    return (
        <li className="collection-item avatar">
            {profile ? <ProfileModal username = {props.person.username} closeProfile={()=> setProfile(false)}/> : null}
            <div style={{padding:"10px"}}>
            {
                props.person.profile_pic_url ? 
                    <div> {/*NOTE - This Div is necessary to avoid error when using maerailbox for the profile pic*/}
                        <img src={props.person.profile_pic_url} alt="" className="responsive-img circle materialboxed" ref={tweet_pics_ref}/>
                    </div> :
                    <i className={random_color}>person</i>
            }
            </div>
            <span className={class_val} onClick={onClick_val} data-target={data_target} style={{wordWrap: "break-word", cursor: cursor_style}}>
                {props.person.username}
            </span>
        </li>
    );
}

export default Person;