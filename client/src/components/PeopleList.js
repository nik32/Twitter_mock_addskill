import React from 'react';

import Person from './Person'

const PeopleList = (props) => {
    let padding_right = null, padding_left = null;
    if(props.col_size === "col s6") {
        padding_right = {paddingRight: "9%"}; 
        padding_left = {paddingLeft: "9%"};
    }
    return (
        [
        <div className = {props.col_size} style={padding_right} key="followers_list">
            <center style={{marginBottom: "15px", fontWeight:"bold"}}>Followers</center>
            <ul className="collection">
                {props.people.followers.map((person) => <Person person={person} key={person._id} /*loader_name={props.loader_name}*/ show_profile={props.show_profile}/>)}
            </ul>
        </div>
        ,
        <div className = {props.col_size} style={padding_left} key="followings_list">
            <center style={{marginBottom: "15px", fontWeight:"bold"}}>Followings</center>
            <ul className="collection">
                {props.people.followings.map((person) => <Person person={person} key={person._id} /*loader_name={props.loader_name}*/ show_profile={props.show_profile}/>)}
            </ul>
        </div>
        ]
    );
}

export default PeopleList;