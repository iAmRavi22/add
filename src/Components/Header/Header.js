import React from "react";
import classes from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = (props) => {
  const getRequestValue = (val) => {
    console.log(val.target.value);
    props.onRequestValue(val.target.value);
  };

  return (
    <React.Fragment>
      <div className={classes.header}>
        <ul className={classes.headerul}>
          <li>
            <NavLink to="/home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/home/allfeeds">All Feeds</NavLink>
          </li>
          <li>
            <NavLink to="/home/addurl">AddUrl</NavLink>
          </li>

          {/* <Link to="/card">Go to Card</Link> */}
          <Link to="/home/card">Card</Link>
          <li>
            {" "}
            <div>
              <select onChange={getRequestValue} value={props.requestValue}>
                <option value={30000}>30 Seconds</option>
                <option value={60000}>1 minute</option>
                <option value={120000}>2 minutes</option>
                <option value={300000}>5 minutes</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default Header;
