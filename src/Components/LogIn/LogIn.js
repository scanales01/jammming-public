import React from "react";
import './LogIn.css';

class LogIn extends React.Component {
    constructor(props) {
        super(props);

        this.logIn = this.logIn.bind(this);
    }

    logIn() {
        this.props.onLogIn();
    }

    render() {
        return(
            <div className="LogIn">
                <button className="logInButton" onClick={this.logIn}>Log In</button>
            </div>
        );
    }
}

export default LogIn;