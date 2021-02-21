import axios from 'axios';
import React, {useState, useEffect} from 'react';
import M from 'materialize-css';

import AddPostModal from '../components/AddPostModal.js';
import TweetsList from '../components/TweetsList';
import Pagination from "../components/Pagination";
import loader from "../misc/loader";

//STATIC HTML Given at end - in comments- IF YOU WANT TO PRACICE

const UserTweets = (props) => {

    const [page, setPage] = useState(0);
    const [force_render, toggleState] = useState(true);//Don't get confused by true or false. It doesn't denote anything. Boolean is used so that we can "easily change the value" of force_rerender to force react to re-render in case the user is at first page when he opens addPostModal and posts a tweet
    const [total_pages, setTotalPages] = useState(0);
    const [posts, setPosts] = useState([]);
    const [first_render, setFirstRender] = useState(true);

    useEffect( () => {
        loader(true, /*'loader2'*/);

        axios.get(`api/getUserTweets?page=${page}&username=${props.username}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("jwt"),
                }
        })
        .then(res => {
            if(res.data.success){
                setPosts(res.data.posts);
                setTotalPages(res.data.pages);
            }
            else
                M.toast({html: res.data.msg, classes: res.data.toastColor});
            
            loader(false/*, 'loader2'*/);
            if(first_render)
                setFirstRender(false);
        })
        .catch(err => {
            console.log(err);
            M.toast({html: "Internl Error occured - Could Not Fetch Posts. Try later (F)", classes: "#c62828 red darken-3"});
            loader(false/*, 'loader2'*/);
        });
        
    }, [page, force_render]);

    return (   
        [
        props.logged ? <AddPostModal refetchTweets={page !== 0 ? 
                                                        () => setPage(0) : /* In case we are at page 0, useEffect will not be called even if we call setPage becuase there is no change in page num.*/
                                                        () => toggleState(!force_render)} 
                        key="arr_elem_1"/> : null
        , 
        <div className="container" key="arr_elem_2">
            <div className="progress" /*id="loader2"*/>
                <div className="indeterminate"></div>
            </div>
            { (posts.length === 0) ? (first_render) ? null : <center><h5>No Tweets. You Seem like a quite chap. Buckup a bit!</h5></center> :
                <div className="row">
                    <div className="hide-on-small-only">
                        <TweetsList posts={posts} range={[0,4]} editable={props.editable} logged={props.logged} col_size="col s6"/>
                        <TweetsList posts={posts} range={[5,9]} editable={props.editable} logged={props.logged} col_size="col s6"/>
                    </div>
                    <div className="show-on-small hide-on-med-and-up">
                        <TweetsList posts={posts} range={[0,9]} editable={props.editable} logged={props.logged} col_size="col s12"/>
                    </div>
                    
                </div>
            }
            <div className="row">
                <Pagination page={page} setPage={setPage} total_pages={total_pages} />
            </div>
        </div>
        ]
     );
}

export default UserTweets;





{/*
    <div className="container">
            <div className="row">
                <div className = "col s6">
                    <ul className="collection">
                        <li className="collection-item avatar" key= "SD">
                        <img src="images/yuna.jpg" alt="" className="circle"/>
                        <span className="title">Title</span>
                        <p>First Line</p>
                        <a href="#!" className="secondary-content"><i className="material-icons">playlist_add</i></a>
                        </li>
                        <li className="collection-item avatar">
                        <i className="material-icons circle">person</i>
                        <span className="title">Title</span>
                        <p>First Line </p>
                        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                        </li>
                        <li className="collection-item avatar">
                        <i className="material-icons circle green">insert_chart</i>
                        <span className="title">Title</span>
                        <p>First Line </p>
                        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                        </li>
                        <li className="collection-item avatar">
                        <i className="material-icons circle red">play_arrow</i>
                        <span className="title">Title</span>
                        <p>First Line</p>
                        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                        </li>
                        <li className="collection-item avatar">
                        <i className="material-icons circle red">person</i>
                        <span className="title">Title</span>
                        <p>First Line</p>
                        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                        </li>
                    </ul>
                </div>
                <div className = "col s6">
                    <ul className="collection">
                        <li className="collection-item avatar">
                        <img src="images/yuna.jpg" alt="" className="circle"/>
                        <span className="title">Title</span>
                        <p>First Line</p>
                        <a href="#!" className="secondary-content"><i className="material-icons">playlist_add_check</i></a>
                        </li>
                        <li className="collection-item avatar">
                        <i className="material-icons circle">folder</i>
                        <span className="title">Title</span>
                        <p>First Line</p>
                        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                        </li>
                        <li className="collection-item avatar">
                        <i className="material-icons circle green">insert_chart</i>
                        <span className="title">Title</span>
                        <p>First Line </p>
                        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                        </li>
                        <li className="collection-item avatar">
                        <i className="material-icons circle red">play_arrow</i>
                        <span className="title">Title</span>
                        <p>First Line</p>
                        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                        </li>
                        <li className="collection-item avatar">
                        <i className="material-icons circle red">play_arrow</i>
                        <span className="title">Title</span>
                        <p>First Line</p>
                        <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
                        </li>
                    </ul>
                </div>
            </div>
            <ul className="pagination" style = {{textAlign: 'center'}}>
                <li className="disabled"><a href="#!"><i className="material-icons">chevron_left</i></a></li>
                <li className="active"><a href="#!">1</a></li>
                <li className="waves-effect"><a href="#!">2</a></li>
                <li className="waves-effect"><a href="#!">3</a></li>
                <li className="waves-effect"><a href="#!">4</a></li>
                <li className="waves-effect"><a href="#!">5</a></li>
                <li className="waves-effect"><a href="#!"><i className="material-icons">chevron_right</i></a></li>
            </ul>
        </div> */}