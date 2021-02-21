import axios from 'axios';
import React, {useState, useEffect} from 'react';
import M from 'materialize-css';

import PeopleList from '../components/PeopleList';
import loader from '../misc/loader';

//STATIC HTML Given at end - in comments- IF YOU WANT TO PRACICE

const People = (props) => {

    const [people, setPeople] = useState({followers: [], followings: []});
    const [first_render, setFirstRender] = useState(true);

    useEffect( () => {
        loader(true/*, props.loader_name*/);

        axios.get(`api/people?username=${props.username}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("jwt"),
                }
        })
        .then(res => {
            if(res.data.success){
                let followers = [];
                let followings = [];
                for(let person of res.data.people){
                    if(person.followee === props.username)
                        followings.push({username: person.follower, _id: person._id, profile_pic_url: person.pics.follower});
                    else
                        followers.push({username: person.followee, _id: person._id, profile_pic_url: person.pics.followee});
                }
                setPeople({followers, followings});
            }
            else
                M.toast({html: res.data.msg, classes: res.data.toastColor});
            loader(false/*, props.loader_name*/);
            if(first_render)
                setFirstRender(false);
        })
        .catch(err => {
            console.log(err);
            M.toast({html: "Internl Error occured - Could Not Fetch Posts. Try later (F)", classes: "#c62828 red darken-3"});
            loader(false/*, props.loader_name*/);
        });
        
    }, []);


    return (   
        <div className="container" id="main-container" style={{paddingLeft: "2%", paddingRight: "2%"}}>
            <div className="progress">{/*id={props.loader_name} >*/}
                <div className="indeterminate"></div>
            </div>
            { 
            (people.length === 0) ? (first_render) ? null : <center><h5>You are Connected to no one.</h5></center> :
            [   <div className="row hide-on-small-only" key="display1">
                    <PeopleList people={people} col_size="col s6" show_profile={props.show_profile}/>
                </div>,
                <div className="row show-on-small hide-on-med-and-up" key="display2">
                    <PeopleList people={people} col_size="col s12" show_profile={props.show_profile}/>
                </div>  ]
            }
        </div>
     );
}

export default People;



{/* return (
        
        <div className="container" style={{paddingLeft: "2%", paddingRight: "2%"}}>
        <div className="row">
            <div className = "col s6" style={{paddingRight: "9%"}}>
                <center style={{marginBottom: "15px", fontWeight:"bold"}}>Followers</center>
                <ul className="collection">
                    <li className="collection-item avatar" key= "SD" >
                        <div style={{padding:"10px"}}>
                        <img src="images/yuna.jpg" alt="" className="circle"/>
                        </div>
                    <span className="title">Title</span>
                    </li>
                    <li className="collection-item avatar">
                    <div style={{padding:"10px"}}>
                        <i className="material-icons circle">person</i>
                    </div>
                    <span className="title">Title</span>
                    </li>
                    <li className="collection-item avatar">
                    <div style={{padding:"10px"}}>
                        <i className="material-icons circle">person</i>
                    </div>
                    <span className="title">Title</span>
                    </li>
                </ul>
            </div>
            <div className = "col s6" style={{paddingLeft: "9%"}}>
                <center style={{marginBottom: "15px", fontWeight:"bold"}}>Following</center>
                <ul className="collection">
                    <li className="collection-item avatar">
                        <div style={{padding:"10px"}}>
                            <img src="images/yuna.jpg" alt="" className="circle"/>
                        </div>
                        <span className="title">Title</span>
                    </li>
                    <li className="collection-item avatar">
                    <div style={{padding:"10px"}}>
                        <i className="material-icons circle">person</i>
                    </div>
                    <span className="title">Title</span>
                    </li>
                    <li className="collection-item avatar">
                    <div style={{padding:"10px"}}>
                        <i className="material-icons circle">person</i>
                    </div>
                    <span className="title">Title</span>
                    </li>
                </ul>
            </div>
        </div>
    </div> 
        )*/}