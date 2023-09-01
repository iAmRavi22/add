import React, { useEffect, useState } from "react";
import classes from "./View.module.css";
import { useParams, useNavigate } from "react-router-dom";
// import LoadingSpinner from "../../Loadingspinner/LoadingSpinner";

const View = (props) => {
  const serverUrl =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PRODUCTION_SERVER_URL
      : process.env.REACT_APP_DEVELOPMENT_SERVER_URL;
  console.log(serverUrl);
  const params = useParams();

  const [readUrls, setReadUrls] = React.useState([]);
  const [urlData, setUrlData] = React.useState([]);
  const [feedposition, setFeedPosition] = React.useState();
  const [notiPosition, setNotiPosition] = React.useState(params.position);
  const [showSpinner, setShowSpinner] = React.useState(true);

  const [edit, setEdit] = useState([]);

  console.log(urlData + "########################8888222");

  fetch(
    `${serverUrl}?name=${encodeURIComponent(
      "https://www.upwork.com/ab/feed/topics/rss?securityToken=49d93796c939b12736adffc2cff571a0f4992b1dc08c3439378cbedbe9194d23066856e0c40a668cfa914ebb181f4ce4c2b106235d599d20ae897914c9d87415&userUid=1154198811317399552&orgUid=1154198811325788161"
    )}`
  )
    .then((response) => response.json())
    .then((state) => console.log("response>>>>>>", state));

  // fetch(
  //   `${serverUrl}?name=${encodeURIComponent(
  //     "https://www.upwork.com/ab/feed/topics/rss?securityToken=49d93796c939b12736adffc2cff571a0f4992b1dc08c3439378cbedbe9194d23066856e0c40a668cfa914ebb181f4ce4c2b106235d599d20ae897914c9d87415&userUid=1154198811317399552&orgUid=1154198811325788161"
  //   )}`
  // )
  //   .then((response) => response.json())
  //   .then((state) => setEdit(state));

  // );

  console.log(props.onRequestValue);

  let navigate = useNavigate();

  const routeChange = () => {
    if (params.user) {
      let path = `/view/${params.user}/null`;
      navigate(path);
      console.log("notification set null");
    }
    setNotiPosition(null);
    if (window.sessionStorage.getItem("errorValue")) {
      setTimeout(viewFetch, 120000);
    } else {
      viewFetch();
    }
    console.log("tttttttt", urlData);
  };

  /////////////////set time for feed through notification pop up//////////////////
  if (notiPosition > 0) {
    setTimeout(routeChange, 25000);
  }

  let viewData = <div></div>;

  console.log(params.user);
  console.log(notiPosition);
  ///////////date//////////////
  const date = new Date().getTime();
  console.log(date);
  const dateConverter = (value) => {
    let d = new Date(value).getTime();
    return d;
  };

  function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  ///Read urls
  useEffect(() => {
    readUrlHandler();
  }, []);

  const readUrlHandler = () => {
    const loadedUrls = [];

    let data = JSON.parse(localStorage.getItem("urlsData"));
    if (data != null) {
      for (let key in data) {
        if (key === params.user) {
          loadedUrls.push({ id: key, url: data[key].addedUrl });
        }
      }
    }

    setReadUrls(loadedUrls);
  };

  let viewUrl = readUrls.map((urls) => urls.url)[0];
  console.log(viewUrl);

  const viewFetch = () => {
    window.sessionStorage.removeItem("errorValue");
    if (viewUrl) {
      console.log("*****");
      console.log(viewUrl);
      fetch(`${serverUrl}?name=${encodeURIComponent(viewUrl)}`)
        .then((response) => response.json())
        .then((feed) => {
          if (feed !== 329) {
            console.log(feed.items.slice(0, 10));
            let feedPositon = feed.items.findIndex(
              (e) => e.title === urlData[0]?.title
            );
            console.log(feedPositon);
            if (feedPositon) {
              setFeedPosition(feedPositon);
            }

            setUrlData(feed.items.slice(0, 10));
            setShowSpinner(false);
          } else {
            if (!window.sessionStorage.getItem("errorValue")) {
              alert("There was an error please wait for 2 mins");
            }
            window.sessionStorage.setItem("errorValue", "errorValue");
            setTimeout(viewFetch, 120000);
          }
        });
    }
  };

  useEffect(() => {
    viewFetch();
  }, [viewUrl]);

  ////////////////////////////////fetch request after 5 sec/////////////////////////////
  let intervalId;

  if (viewUrl && urlData.length > 0) {
    intervalId = setInterval(function () {
      fetch(`${serverUrl}?name=${encodeURIComponent(viewUrl)}`)
        .then((response) => response.json())
        .then((feed) => {
          if (feed !== 329) {
            console.log("Feed fetch success");

            if (feed.items[0].title !== urlData) {
              let feedPositon = feed.items.findIndex(
                (e) => e.title === urlData[0].title
              );
              console.log(feedPositon);
              if (feedPositon) {
                setFeedPosition(feedPositon);
              }
              setUrlData(feed.items.slice(0, 10));
              setNotiPosition(null);
              clearInterval(intervalId);
            } else {
              return;
            }
          } else {
            clearInterval(intervalId);
            viewFetch();
          }
        });
    }, props.onRequestValue);
  }

  console.log(urlData);
  localStorage.setItem("MyDataq", JSON.stringify(urlData));
  console.log(feedposition);

  // useEffect(() => {
  //   addData();
  // }, [edit]);

  // function addData() {
  //   if (edit !== []) {
  //     setEdit(urlData);
  //     localStorage.setItem("MyData", JSON.stringify(edit));
  //   } else {
  //     localStorage.setItem("MyData", "402");
  //   }
  // }

  if (urlData.length > 1) {
    viewData = (
      <div>
        {urlData.map((e) => (
          <div
            key={e.guid}
            className={`${
              (feedposition &&
                urlData.findIndex((item) => item.title === e.title) <
                  feedposition) ||
              (notiPosition &&
                urlData.findIndex((item) => item.title === e.title) <
                  notiPosition)
                ? classes.active
                : classes.inactive
            } `}
          >
            <h1>{e.title}</h1>
            <div>
              {/* {" "}
              <i>
                {millisToMinutesAndSeconds(date - dateConverter(e.isoDate))}{" "}
                minutes ago
              </i> */}
            </div>
            {/* <a href={e.link}>{e.link}</a>
            <br />
            <br />
            <div dangerouslySetInnerHTML={{ __html: e.content }} /> */}
            <p>{e.content}</p>
          </div>
        ))}
      </div>
    );
  }

  let content = viewData;

  return (
    <React.Fragment>
      <div className={classes.view}>
        <button
          onClick={routeChange}
          disabled={window.sessionStorage.getItem("errorValue")}
        >
          Refresh
        </button>
        <h2>Your Feed</h2>
        {/* {showSpinner && <LoadingSpinner />} */}
        {content}
      </div>
    </React.Fragment>
  );
};

export default View;
