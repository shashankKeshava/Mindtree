import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import request from "superagent";

// Add Credentials
const clientID = "XXXXXXX";
const clientSecret = "XXXXX";

const url = `https://api.github.com/users?client_id=${clientID}&client_secret=${clientSecret}`;

class App extends Component {
  constructor(props) {
    super(props); // Super allows to use constructor methods i.e this.props of parent class
    this.state = {
      userList: null,
      userDetails: null,
      apiResponse: null
    };
  }

  handleCloseBio = () => {
    this.setState({
      userDetails: null
    });
  };
  handleClick = user => {
    let userBio = null;

    request.get(user.url).end((err, res) => {
      if (err) console.log("Fetch User Details Failed", err);
      else {
        userBio = (
          <div className={"basicDetails"}>
            <div className={"basicDetails-header"}>
              <h3>
                {res.body.login} User Bio
              </h3>
              <a className={"basicDetails-close"} onClick={this.handleCloseBio}>
                X
              </a>
            </div>
            <ol>
              <li className={"align-left"}>
                Id:{res.body.id}
              </li>
              <li className={"align-left"}>
                Name:{res.body.name}
              </li>
              <li className={"align-left"}>
                Company:{res.body.company}
              </li>
              <li className={"align-left"}>
                Location:{res.body.location}
              </li>
              <li className={"align-left"}>
                Public Repos:{res.body.public_repos}
              </li>
              <li className={"align-left"}>
                Followers:{res.body.followers}
              </li>
            </ol>
          </div>
        );
        this.setState({
          userDetails: userBio
        });
      }
    });
  };
  _userListing = () => {
    let users = [];
    if (!!this.state.apiResponse) {
      users = this.state.apiResponse.map(user => {
        // Bind helps to bind this and multiple parameters to the event handler, arrow frunctions (=>) can also be used to bind
        return (
          <div
            key={user.id}
            className={"userTiles"}
            onClick={this.handleClick.bind(this, user)}
          >
            <img className={"avatar"} src={user.avatar_url} />
            <b className={"login"}>
              {user.login}
            </b>
          </div>
        );
      });
    }
    return (
      <div>
        {users}
      </div>
    );
  };
  componentDidMount = () => {
    request.get(url).end((err, res) => {
      if (err) console.log(err);
      else
        this.setState({
          apiResponse: res.body
        });
    });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Mindtree Interview Coding Assignment</h1>
        </header>
        {this._userListing()}
        {this.state.userDetails}
      </div>
    );
  }
}

export default App;
