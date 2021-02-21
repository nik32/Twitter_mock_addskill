import React, {useEffect, useState} from 'react';
import M from 'materialize-css';
import axios from 'axios';

import TweetsList from '../components/TweetsList';
import Pagination from "../components/Pagination";
import loader from "../misc/loader";

/*REFRENCES - 1. FOR PAGINATION - https://www.youtube.com/watch?v=soWg_UtD_AMw
*/

// <span className="comment-style" style={{color: "black"}}>- 1 Day Ago</span>
 
//TO-DO - STYLE THE TWEET CARD BETTER
const Home = (props) => {

    const [page, setPage] = useState(0);
    const [total_pages, setTotalPages] = useState(0);
    const [posts, setPosts] = useState([]);
    const [first_render, setFirstRender] = useState(true);

    useEffect( () => {
        loader(true,/* 'loader1'*/);

        //NOTE - This show timeout is only used to show the loader features
        //TO-DO - Remove timeout when using later
        setTimeout(() => {
            axios.get(`api/getAllTweets?page=${page}&username=${props.username}`)
            .then(res => {
                if(res.data.success){
                    setPosts(res.data.posts);
                    setTotalPages(res.data.pages);
                }
                else
                    M.toast({html: res.data.msg, classes: res.data.toastColor});
                loader(false/*, 'loader1'*/);
                if(first_render)
                    setFirstRender(false);
            })
            .catch(err => {
                console.log(err);
                M.toast({html: "Internl Error occured - Could Not Fetch Posts. Try later (F)", classes: "#c62828 red darken-3"});
                loader(false/*, 'loader1'*/);
            })
        }, 1000)
        
    }, [page]);

    //Even though you drill props through the TweetList & People modal component (which don't need them. They just pass it to their child).
    //You did't manage these props with global context as then every time you would have closed the modal
    //Then you had to change the global state to the authenticated user which would have been an additional step.
    //And also only 3 or 4 levels of nesting is happening so it is not that big a problem 
    return (   
        <div className="container" id="main-container">
            <div className="progress" /*id="loader1"*/>
                <div className="indeterminate"></div>
            </div>
            { 
            (posts.length === 0) ? (first_render) ? null : <center><h5>No Tweets :(</h5></center> :
                <div className="row">
                    <div className="hide-on-small-only">
                        <TweetsList posts={posts} range={[0,4]} show_profile = {props.show_profile} col_size="col s6"/>
                        <TweetsList posts={posts} range={[5,9]} show_profile = {props.show_profile} col_size="col s6"/>
                    </div>
                    <div className="show-on-small hide-on-med-and-up">
                        <TweetsList posts={posts} range={[0,9]} show_profile = {props.show_profile} col_size="col s12"/>
                    </div>
                    {/* <Pagination page={page} setPage={setPage} total_pages={total_pages} /> */}
                </div>
            }
            <div className="row">
                <Pagination page={page} setPage={setPage} total_pages={total_pages} />
            </div>
        </div>
     );
}

export default Home;