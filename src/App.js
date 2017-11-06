import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import request from "superagent";
import Pagination from "rc-pagination";

// Add Credentials of Client ID and Client Secret
const clientID = "38481dd283afc97431c0";
const clientSecret = "f8edbfdcd42e084b2dcf5b22cc6f42a8a6cc3205";

let page = 0;
let url =null;

class App extends Component {
  constructor(props) {
    super(props); // Super allows to use constructor methods i.e this.props of parent class
    this.state = {
      userList: null,
      userDetails: null,
      apiResponse: null,
      page: {
        defaultCurrent: 1,
        current: 0,
        pageSize: 46,
        total: 100
      }
    };
  }
 
  handlePageChange = (current, pageSize) => {
    let lastId = this.state.apiResponse[this.state.apiResponse.length - 1].id;
    console.log(lastId);
    this.setState({
      page:{
        current:current
      }
    })
    /*request.get(url).end((err, res) => {
      if (err) console.log(err);
      else
        this.setState({
          apiResponse: res.body,
          page: {
            current: current
          }
        });
    });*/
  };

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
     url=`https://api.github.com/users?since=${this.state.page.current}&client_id=${clientID}&client_secret=${clientSecret}`;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Mindtree Interview Coding Assignment</h1>
        </header>
        {this._userListing()}
        {this.state.userDetails}
        <Pagination
          simple
          defaultCurrent={this.state.page.defaultCurrent}
          currrent={this.state.page.current}
          total={this.state.page.total}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default App;
