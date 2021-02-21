import React from 'react';

import Tweet from './Tweet'

const TweetsList = (props) => {
    return (
        <div className = {props.col_size}>
            <ul className="collection">
                {
                    props.posts.map((post, indx) => {
                        if(indx >= props.range[0]  && indx <= props.range[1]) 
                            return <Tweet post={post} editable={props.editable} logged = {props.logged} show_profile = {props.show_profile} key={post._id}/>;
                        return null;
                    })
                }
            </ul>
        </div>
    );
}

export default TweetsList;