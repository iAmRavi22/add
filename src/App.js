import React, { useState, useEffect, useRef } from "react";
import { db } from "./FireBase";
import { ref, onValue, remove, update } from "firebase/database";
import Home from "./Components/Pages/Home";
import classes from "./App.module.css";
import { Route, Redirect } from "react-router-dom";
import Header from "./Components/Header/Header";
import View from "./Components/Pages/View";
import { NavLink } from "react-router-dom";
import notification from "./notification.mp3";
import Card from "./Components/Pages/Card";

function App() {
  const inputRef = useRef();
  const [showForm, setShowForm] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [readUrls, setReadUrls] = useState([]);

  const audio = new Audio(notification);

  let urlList = <h2>No Urls Found</h2>;

  useEffect(() => {
    readUrlHandler();
  }, []);

  //UPDATE
  const getNewInput = () => {
    setUrlValue(inputRef.current.value);
  };

  const addChangedUrlHandler = (urls) => {
    //shows a form with input field and a button
    setShowForm(true);
    setUpdateId({ id: urls.id, url: urls.url });
  };

  const formButtonClickFunction = () => {
    console.log(urlValue);
    if (urlValue.length > 0) {
      // sends the value of input to the server
      update(ref(db, "urls/" + `${updateId.id}`), {
        addedUrl: urlValue,
        uuid: updateId.id,
      });
      readUrlHandler();
      setShowForm(false);
    }
  };

  //DETETE!!!!
  const deleteUrlHandler = (urls) => {
    remove(ref(db, "urls/" + `${urls.id}`));
    readUrlHandler();
    setShowForm(false);
  };

  // READ !!!!!!!
  const readUrlHandler = () => {
    const loadedUrls = [];
    onValue(ref(db, "/urls"), (snapshot) => {
      const data = snapshot.val();

      if (data != null) {
        for (let key in data) {
          loadedUrls.push({
            id: key,
            name: data[key].addedName,
            url: data[key].addedUrl,
          });
        }
      }
      setReadUrls(loadedUrls);
    });
  };

  const getUrlValueHandler = (value) => {
    setReadUrls((prevUrls) => prevUrls.concat(value));
    let notiData = [];

    //FOR HITTING URL AND GETTING RESPONSE
    // fetch(`https://cors-anywhere.herokuapp.com/${value.addedUrl}`)
    // .then(response => response.text())
    // .then(data => { console.log(data) })

    let Parser = require("rss-parser");
    let parser = new Parser();

    (async () => {
      let feed = await parser.parseURL(
        `https://cors-anywhere.herokuapp.com/${value.addedUrl}`
      );
      console.log(feed);
      notiData.push(feed.items[0].title);
      console.log(notiData[0]);

      //console.log(feed.items[0].title + ":" + feed.items[0].link);
      // setShowFeedContent(
      //   <p>{feed.items[0].title + ":" + feed.items[0].link} </p>
      // );
      ////////////////////////////////////Notification////////////////////////////////
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }

      // Let's check if the user is okay to get some notification
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(feed.items[0].title, {
          body: feed.items[0].link,
        });
        audio.play();
      }

      // Otherwise, we need to ask the user for permission
      // Note, Chrome does not implement the permission static property
      // So we have to check for NOT 'denied' instead of 'default'
      else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
          // Whatever the user answers, we make sure we store the information
          if (!("permission" in Notification)) {
            Notification.permission = permission;
            audio.play();
          }

          // If the user is okay, let's create a notification
          if (permission === "granted") {
            var notification = new Notification(feed.items[0].title, {
              body: feed.items[0].link,
            });
            audio.play();
          }
        });
      } else {
        alert(`Permission is ${Notification.permission}`);
      }

      // At last, if the user already denied any notification, and you
      // want to be respectful there is no need to bother him any more.
      ////////////////////////////////////Notification////////////////////////////////
    })();

    setInterval(function () {
      let Parser = require("rss-parser");
      let parser = new Parser();

      (async () => {
        let feed = await parser.parseURL(
          `https://cors-anywhere.herokuapp.com/${value.addedUrl}`
        );
        console.log(feed.items[0].title);
        console.log("fetch success");

        if (feed.items[0].title === notiData[0]) {
          return;
        } else {
          console.log("feed changed>>>>>>>");
          let feedPositon = feed.items.findIndex(
            (e) => e.title === notiData[0]
          );
          notiData[0] = feed.items[0].title;
          console.log(notiData[0]);

          if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
          }

          // Let's check if the user is okay to get some notification
          else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(
              "+(" + (feedPositon - 1) + ")  " + feed.items[0].title,
              { body: feed.items[0].link }
            );
            audio.play();
            console.log(audio);
          }
          //feed.items[0].link,dir:'rtl'
          // Otherwise, we need to ask the user for permission
          // Note, Chrome does not implement the permission static property
          // So we have to check for NOT 'denied' instead of 'default'
          else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
              // Whatever the user answers, we make sure we store the information
              if (!("permission" in Notification)) {
                Notification.permission = permission;
                audio.play();
              }

              // If the user is okay, let's create a notification
              if (permission === "granted") {
                var notification = new Notification(
                  "+(" + (feedPositon - 1) + ")  " + feed.items[0].title,
                  { body: feed.items[0].link }
                );
                audio.play();
              }
            });
          } else {
            alert(`Permission is ${Notification.permission}`);
          }
        }

        // At last, if the user already denied any notification, and you
        // want to be respectful there is no need to bother him any more.
        ////////////////////////////////////Notification////////////////////////////////
      })();
    }, 300000);
  };

  console.log(readUrls);
  if (readUrls.length > 0) {
    urlList = (
      <ul>
        {readUrls.map((urls) => (
          <li key={urls.id}>
            <div>
              <label>Name:</label>
              <div>{urls.name}</div>
              <label>Url:</label>
              <div>{urls.url}</div>
            </div>
            <div>
              <button onClick={() => addChangedUrlHandler(urls)}>UPDATE</button>
              <button onClick={() => deleteUrlHandler(urls)}>DELETE</button>
              <NavLink to={"/view/" + urls.id}>
                <p>View</p>
              </NavLink>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  let content = urlList;

  return (
    <React.Fragment>
      <div className={classes.app}>
        <Header />
        <Route path="/" exact>
          <Redirect to="/home"></Redirect>
        </Route>
        <Route path="/home/">
          <Home
            onUrlValue={getUrlValueHandler}
            onReadUrl={readUrlHandler}
            content={content}
          ></Home>
        </Route>
        <Route path="/view/:user">
          <View />
        </Route>

        {/* <Route path="/card" element={<Card />}></Route> */}

        <Route path="/home/card">
          <Card />
        </Route>

        {/* <div className={classes.urlList}>{content}</div> */}
        {showForm && (
          <div>
            <input ref={inputRef} onChange={getNewInput}></input>
            <button onClick={formButtonClickFunction}>Change Url</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default App;
