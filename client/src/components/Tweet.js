import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import axios from 'axios';
import M from 'materialize-css';
import he from "he";//used to encode and decode the string to preserve the html formatting

import ProfileModal from '../components/ProfileModal';
import loader from "../misc/loader";


const Tweet = (props) => {
    const colors = ["red", "green", "blue", "yellow", "purple", "pink"];
    let random_color = `material-icons circle ${colors[Math.floor(Math.random() * 108) % 6]}`;

    let data_target = null, class_val = "title", onClick_val = null, cursor_style = null;
    if(props.show_profile){
        cursor_style = "pointer";
        data_target = "modal2";
        class_val = "title modal-trigger";
        onClick_val = () => setProfile(true); 
    }

    const warningOnFocus = (event) => {
        if(event.target.isContentEditable && event.target.innerHTML !== "")
            event.target.innerHTML += "<div contenteditable='false' class='warning'><span style='color:darkgrey;font-size:10px;'> (Press Enter to save permanently)</span></div>"
    }
    
    const removeWarning = () => {
        let elements = document.getElementsByClassName("warning");
        while(elements.length > 0)
            elements[0].parentNode.removeChild(elements[0]);
    }

    //This will hide tweets (and disply loader) or show tweets (and hide loader)
    const hideTweets = (hide_tweets) => {
        const tweets_display_style = hide_tweets ? "none" : "block";
        const show_loader = hide_tweets;
        
        let lists = document.getElementsByClassName("row");//Tweets are in row[0] and pagination is in row[1] 
        for(let list of lists)
            list.style.display = tweets_display_style;
        loader(show_loader/*, document.getElementById("loader1") ? "loader1" : :loader2:*/);
    }

    const handleRequest = (promise_obj, follower) => {
        promise_obj
        .then(res => {
            M.toast({html: res.data.msg, classes:res.data.toastColor});
            hideTweets(false);
            if(follower) {//We will get follower only if handleRequest() is called by followPerson()
               const follow_icons = document.getElementsByClassName(follower);
               for(let follow_icon of follow_icons)
                follow_icon.style.display = "none";
            }
        })
        .catch(err => {
            console.log(err);
            M.toast({html: "Internel Error occured. Try Later. (F)", classes: "#c62828 red darken-3"});
            hideTweets(false);
        });
    }

    const followPerson = (follower, followee, pics) => {
        hideTweets(true); 
        const body = {follower, followee, pics};
        handleRequest(
            axios.post("api/follow", body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt"),
                }
            }),
            follower
        );
    }
    
    const saveEditToDB = (event, tweet_id) => {
        //1. Instead of sending request on each tweet edit (i.e. on each press of enter), we can make state var called - edits. In it we can save the new comments with their ids.
        //2. Now as soon as this state var (edits) will have some value, we can show floating button to save all edits.
        //3. Whenever, user clicks on the button, we send the "edits" object in the request and at the backend 
        //   we can either make a req to db for each edit or we can further optimize by using aggregate framework (https://stackoverflow.com/questions/17207183/way-to-update-multiple-documents-with-different-values#:~:text=You%20can%20not%20update%20two,MongoDB%20with%20the%20same%20query.)
        //4. but the above will atleast reduce the number of calls from frontend to backend. 
        if (event.keyCode === 13 && !event.shiftKey) {
            // Cancel the default action, if needed
            event.preventDefault();
            event.target.blur();

            hideTweets(true);

            //Code for request
            const u_data = {tweet: he.encode(event.target.innerHTML), tweet_id}; /*he.encode() is Used to maintain the html markup.*/
            const response_obj = axios.patch("api/patchTweet", u_data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("jwt"),
                    }
                });
            handleRequest(response_obj);

          }
    }

    //If user clears the text area then he won;t be able to enter anything due to the warning. So remove the warning if it become empty
    const handleEmptiness = (event) => {
        //The box will be empty if there is only the code for warning
        if(event.target.innerHTML == '<div contenteditable="false" class="warning"><span style="color:darkgrey;font-size:10px;"> (Press Enter to save permanently)</span></div>')
            removeWarning();
    }

    let para_ref = useRef(null);
    let follow_btn_ref = useRef(null);
    let tweet_pics_ref = useRef(null);
    useEffect( () => {
        M.Tooltip.init(para_ref.current, {margin: 0, html: "Click to Edit", exitDelay: 0});
        M.Tooltip.init(follow_btn_ref.current, {margin: 0, html: "Follow", exitDelay: 0});
        M.Materialbox.init(tweet_pics_ref.current);
    }, []);

    const [profile, setProfile] = useState(false);

    return (
        <li className="collection-item avatar">
            {profile ? <ProfileModal username = {props.post.username} closeProfile={()=> setProfile(false)}/> : null}
            {
                props.post.profile_pic_url ? 
                    <div>{/*NOTE - This Div is necessary to avoid error when using maerailbox for the profile pic*/}
                        <img src={props.post.profile_pic_url} alt="" className="responsive-img circle materialboxed" ref={tweet_pics_ref}/>
                    </div>  : 
                    <i className={random_color}>person</i>
            }
            <span className={class_val} onClick={onClick_val} data-target={data_target} style={{wordWrap: "break-word", cursor: cursor_style}}>
                {props.post.username}
            </span>
            <p className="tweet-style add tooltipped" ref={props.editable ? para_ref : null} contentEditable={props.editable} suppressContentEditableWarning={true} onFocus={warningOnFocus} onBlur={removeWarning} onKeyDown={(event) => saveEditToDB(event, props.post._id)} onKeyUp = {(e) => handleEmptiness(e)} 
            dangerouslySetInnerHTML={{__html: he.decode(props.post.tweet)}}>{/*This will set the inner html to the string provided in __html attribute. The string should contain htmls tags in form of numaric/endcoded format thus used "he" for the purpose*/}
            </p>
            {props.post.tweet_pic_url ? 
                    <div className="tweet-pic-div">{/*https://stackoverflow.com/questions/3029422/how-do-i-auto-resize-an-image-to-fit-a-div-container*/}
                        <img src={props.post.tweet_pic_url} ref={tweet_pics_ref} className="materialboxed" style={{maxWidth :"100%", maxHeight: "100%", height: "auto"}}></img>
                    </div> 
                    : null}
            <p className="tweet-style" style={{color: "darkgrey", fontSize: "12px"}}> - {moment(props.post.date_time).fromNow()}</p>
            {/* Display the link only when a person is logged in */}
            
            {props.post.not_following && localStorage.getItem("user") ? 
                <a style={{cursor: "pointer"}} className={"secondary-content tooltipped " + props.post.username} ref={follow_btn_ref} onClick={() => followPerson(props.post.username, JSON.parse(localStorage.getItem("user")).username, {follower: props.post.profile_pic_url, followee: JSON.parse(localStorage.getItem("user")).profile_pic_url})}>
                    <i className="material-icons">playlist_add</i>
                </a> : null}
        </li>
    );
}

export default Tweet;