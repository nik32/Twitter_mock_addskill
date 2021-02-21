import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';
import axios from 'axios';

import '../App.css';

const Signin = (props) => {
    const history_obj = useHistory();
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const authenticate = () => {
        const u_data = {username, password,}
        if(!username || !password)
            M.toast({html: "Please fill all the feilds", classes: "#c62828 red darken-3"});
        else{
            //NOTE 1 - we are not sending req to localhost:5000. But still it will be sent to 5000 due to proxy.
            //NOTE 2 - Don't add - / before the url when using axios. add it after the proxy in package.json
            axios.post("api/authenticate", u_data)
            .then(res => {
                M.toast({html: res.data.msg, classes:res.data.toastColor});
                if(res.data.success)
                {
                    const user_data_str = JSON.stringify(res.data.user);
                    localStorage.setItem("jwt",res.data.token);
                    localStorage.setItem("user",user_data_str);
                    props.setJwt(res.data.token);
                    props.setUser(user_data_str);
                    history_obj.replace("/userTweets");
                }
            })
            .catch(err => {
                console.log(err);
                M.toast({html: "Internel Error occured. Try Later. (F)", classes: "#c62828 red darken-3"});
            });
        }
    }

    return (
        <div className = "card custom-card-signin">
            <div className = "brand-logo"><h3>Twitter</h3></div>
                <div className="input-field">
                    <i className="custom-icon-size material-icons prefix">account_circle</i>
                    <input type="text" placeholder="Username" value = {username} onChange = {(event) => setUsername(event.target.value)} className="validate"/>
                </div>
                <div className="input-field">
                    <i className="custom-icon-size material-icons prefix">password</i>
                    <input type="password" placeholder="Password" value = {password} onChange = {(event) => setPassword(event.target.value)} className="validate"/>
                </div>
            <button className="btn waves-effect waves-light custom-button-signin" type="submit" name="action" onClick={authenticate}>Signin
                <i className="material-icons right">arrow_forward</i>
            </button>
        </div>
        );
}

export default Signin;