import React, { Component } from "react";
import M from "materialize-css";

import UserTweets from "../containers/UserTweets"
import People from "../containers/People";

class ProfileModal extends Component {
  
  _window = Object.freeze({TWEETS: 1, PEOPLE: 2}); 
  state = {
    curr_page: this._window.TWEETS,
  }
  //instance = null;

  componentDidMount() {
    const options = {
      onOpenStart: () => console.log("Open Start"),
      onOpenEnd: () => console.log("Open End"),
      onCloseStart: () => this.props.closeProfile(),
      onCloseEnd: () => console.log("Close End"),
      inDuration: 250,
      outDuration: 250,
      opacity: 0.75,
      dismissible: true,
      startingTop: "4%",
      endingTop: "10%",
    };
    M.Modal.init(this.Modal, options);
    M.Tabs.init(this.tab);
    //this.instance = M.Modal.getInstance(this.Modal); //if you want to use modal functions like open(), close(), destroy(), then the instance on which we call these functions will be obtained from this code line. Now we can call - this.instance.<method> to call the <method>
  }

  render() {
    return (
      <>
        <div id="modal2" className="modal" ref={Modal => this.Modal = Modal}>

        <div className="modal-content" style={{padding:"0px"}}>
          <div className = "navbar-fixed navbar-margin">
            <nav className="nav-extended">
              <div className="nav-wrapper custom-navbar">
                <div className="brand-logo center">{this.props.username}</div>
                <ul id="nav-mobile" className="right">
                  <li style={{color:"#011627"}}>Dummy</li>{/*Used this just for design purposes. Just wanted to display the tabs in next line of the username. But removing this would display them in same line. That's why the color of text is smae as that of nav bar, to hid the text*/}
                </ul>
                <div className="nav-content">
                  <ul className="tabs tabs-transparent tabs-fixed-width" ref={tab => this.tab = tab} style={{overflowX: "hidden"}}>
                    <li className="tab" onClick={ () => this.setState({curr_page: this._window.TWEETS,}) }>
                      <a className={this.state.curr_page === this._window.TWEETS ? "active" : null}>
                        Tweets
                      </a>
                    </li>
                    <li className="tab" onClick={ () => this.setState({curr_page: this._window.PEOPLE,}) }>
                      <a className={this.state.curr_page === this._window.PEOPLE ? "active" : null}>
                        People
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
          <div className="row" style={{marginTop:"10%", marginLeft: "0", marginRight: "0"}}>
            {
              this.state.curr_page === this._window.TWEETS ?
                <UserTweets username={this.props.username} /*loader={loader}*/ editable={false}/> :
                <People username={this.props.username} /*loader_name="loader4"*/ show_profile={false}/>
            }
          </div>
        </div>
      </div>
    </>
    );
  }
}

export default ProfileModal;