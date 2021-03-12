import React, { Component } from "react";
import M from "materialize-css";
import axios from "axios";
import he from "he";

import loader from "../misc/loader";
import handleUpload from "../misc/imageUpload";

class AddPostModal extends Component {
  state = {
    tweet_pic_url: null,
    tweet_pic: null,
  } // how directly setting state (without constructor) here is working - https://hackernoon.com/the-constructor-is-dead-long-live-the-constructor-c10871bea599
  
  instance = null;

  componentDidMount() {
    const options = {
      onOpenStart: () => console.log("Open Start"),
      onOpenEnd: () => console.log("Open End"),
      onCloseStart: () => console.log("Close Start"),
      onCloseEnd: () => console.log("Close End"),
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: true,
      startingTop: "4%",
      endingTop: "10%"
    };
    M.Modal.init(this.Modal, options);
    this.instance = M.Modal.getInstance(this.Modal);
  }


  closeModal(){
    loader(false/*,'loader2'*/);
    this.instance.close();//CHECK - if destroy() works 
  }
  
  addPost = (tweet_div) => {
    loader(true/*, 'loader2'*/);//Defined in app.js
    const data = {
        // username: "nik32", //This will be fetched from server using our token
        tweet: he.encode(tweet_div.innerHTML),
        tweet_pic_url: this.state.tweet_pic_url,
        // profile_pic_url: localStorage.getItem("user").profile_pic_url
    }
    axios.post("api/postTweet", data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("jwt"),
          }
    })
    .then((res) => {
      if(res.data.success){
        tweet_div.innerHTML = "";
        this.props.refetchTweets();
      }
      M.toast({html: res.data.msg, classes: res.data.toastColor});
      this.closeModal();
    })
    .catch((err) =>{
      console.log(err);
      M.toast({html: "Internel Error occured. Try Later. (F-AddPostModal)", classes: "#c62828 red darken-3"});
      this.closeModal();
    });
  }



  render() {
    return (
      <>
        <a data-target="modal1" className="modal-trigger btn-floating btn-large waves-effect waves-light red" style={{position: "fixed", right: "75px", bottom: "50px"}}>
            <i className="material-icons">mode_edit</i>{/*Floating button */}
        </a>
        
        <div id="modal1" className="modal" ref={Modal => this.Modal = Modal}>

        <div className="modal-content" style={{padding: "5% 10%"}}>
          
          <h5>What's On Your Mind?</h5>
          <div contentEditable="true" id="tweet" style={{marginTop: "4%", marginBottom: "2px"}}></div>
          <div class="divider" style={{marginBottom: "7%"}}></div>

          <form className="row" onSubmit={(e) => handleUpload(e, this.state.tweet_pic, (tweet_pic_url) => this.setState({tweet_pic_url}), () => this.setState({tweet_pic: null}))}>
            <input className="col s9" type="file" id="file" onChange={(e) => this.setState({tweet_pic: e.target.files[0]})} style={{overflow: 'hidden', padding: "0"}} />
            <button className="btn-flat waves-effect waves-teal col s3" style={{float:"right", fontFamily: "Raleway, sans-serif", letterSpacing: "1px"}}>Upload</button>
          </form>

          <div id="tweet-pic">
            <img src={this.state.tweet_pic_url} />
          </div> 

        </div>

        <div className="modal-footer" style={{paddingRight: "7%", paddingBottom: "12%"}}>
          <a className="btn-flat waves-effect waves-red modal-close">
            Cancel
          </a>
          <a className="btn-flat waves-effect waves-green" onClick={() => this.addPost(document.getElementById("tweet")) }>
            Post
          </a>
        </div>

      </div>
    </>
    );
  }
}

export default AddPostModal;