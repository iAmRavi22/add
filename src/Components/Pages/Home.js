import React from "react";
import { Fragment } from "react";
import classes from "./Home.module.css";
import { Outlet } from "react-router-dom";
// import LoadingSpinner from "../../Loadingspinner/LoadingSpinner";

const Home = (props) => {
  return (
    <Fragment>
      <div className={classes.home}>
        <div className={classes.homeaddurl}>
          <Outlet />
        </div>
        {/* {props.showSpinner && <LoadingSpinner />} */}
        <div className={classes.urlList}>{props.content}</div>
      </div>
    </Fragment>
  );
};

export default Home;
