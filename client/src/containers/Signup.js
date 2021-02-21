import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css';

import handleUpload from "../misc/imageUpload";

const Signup = (props) => {
    //NOTE - This history needs to be called outside any callback. So you must call it here
    //       And it dosen't affect output becuase it will give us the history object from whihc we
    //       can anytime later call push()
    const history_obj = useHistory();
    const [username,setUsername] = useState("");
    const [first,setFirst] = useState("");
    const [last,setLast] = useState("");
    const [phone,setPhone] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [file, setFile] = useState(null);
    const [profile_pic_url, setURL] = useState("");


    const addUser = () => {
        const u_data = {username, first, last, phone, email, password, profile_pic_url}
        console.log(profile_pic_url);
        if(!username || !first || !last || !phone || !email || !password)
            M.toast({html: "Please fill all the feilds", classes: "#c62828 red darken-3"});
        // The below is reg exp for verifying emial. Can be obtained from net
        else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
            M.toast({html: "Please provide a valid email ID", classes: "#c62828 red darken-3"});
        else{
            //NOTE 1 - we are not sending req to localhost:5000. But still it will be sent to 5000 due to proxy.
            //NOTE 2 - Don't add - / before the url when using axios. add it after the proxy in package.json
            axios.post("api/addUser", u_data)
            .then(res => {
                M.toast({html: res.data.msg, classes:res.data.toastColor});
                if(res.data.success)
                    history_obj.push("/signin");
            })
            .catch(err => {
                console.log(err);
                M.toast({html: "Internel Error occured. Try Later (F)", classes: "#c62828 red darken-3"})
            });
        }
    }

    return (
        <div className = "card custom-card-signup">
            <div className = "brand-logo"><h3>Twitter</h3></div>
                <div className="input-field">
                    <i className="custom-icon-size material-icons prefix">face</i>
                    <input type="text" placeholder="First Name" value = {first} onChange = {(event) => setFirst(event.target.value)} className="validate"/>
                </div>
                <div className="input-field">
                    <i className="custom-icon-size material-icons prefix">face</i>
                    <input type="text" placeholder="Last Name" value = {last} onChange = {(event) => setLast(event.target.value)} className="validate"/>
                </div>
                <div className="input-field">
                    <i className="custom-icon-size material-icons prefix">phone</i>
                    <input type="tel" placeholder="Phone" value = {phone} onChange = {(event) => setPhone(event.target.value)} className="validate"/>
                </div>
                <div className="input-field">
                    <i className="custom-icon-size material-icons prefix">email</i>
                    <input type="email" placeholder="Email" value = {email} onChange = {(event) => setEmail(event.target.value)} className="validate"/>
                </div>
                <div className="input-field">
                    <i className="custom-icon-size material-icons prefix">account_circle</i>
                    <input type="text" placeholder="Username" value = {username} onChange = {(event) => setUsername(event.target.value)} className="validate"/>
                </div>
                <div className="input-field">
                    <i className="custom-icon-size material-icons prefix">password</i>
                    <input type="password" placeholder="Password" value = {password} onChange = {(event) => setPassword(event.target.value)} className="validate"/>
                </div>
                <form className="row" style={{marginTop: "7%"}} onSubmit={(e) => handleUpload(e, file, (url) => setURL(url), () => setFile(null))}>
                    <input className="col s9" type="file" id="file" onChange={(e) => setFile(e.target.files[0]) } style={{overflow: 'hidden', marginTop: "11px"}}/>
                    <button className="col s3 btn waves-effect waves-light">Upload</button>  {/* why this works - *explantion given below*/}
                </form>
                <button className="btn waves-effect waves-light custom-button-signin" type="button" onClick={addUser}>Signup
                <i className="material-icons right">person_add</i>
            </button>
        </div>
        );
}

export default Signup;


// Why the button inside the form works and submits the form? (ans from - Cfreak) https://stackoverflow.com/questions/6617212/add-regular-button-inside-form-that-does-not-perform-a-submit
// Via MDN: <button type=submit />: The button submits the form data to the server.
// This is the default if the attribute is not specified, or if the attribute is 
// dynamically changed to an empty or invalid value. 
// <button type=button />: The button has no default behavior