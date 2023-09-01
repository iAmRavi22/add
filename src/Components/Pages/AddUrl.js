// import { uid } from "uid";
// import React,{useState} from "react";
// import classes from "./AddUrl.module.css"

// const AddUrl=(props)=>{

//   const [addedUrl,setAddedUrl]=useState('');
//   const [addedName,setAddedName]=useState('')

//   const getNameHandler=(e)=>{
//     const name=e.target.value;
//     setAddedName(name);
//   }

//   const getUrlHandler=(e)=>{
//     const Url=e.target.value;
//     setAddedUrl(Url);

//   }

//   const addUrlHandler=()=>{

//     if(addedUrl.includes('/rss') && addedUrl.length>0 && addedName.length>0){const uuid=uid();

//    const urlsData={
//     [uuid]:{
//      addedName:addedName,
//      addedUrl:addedUrl,
//      uuid:uuid,
//     }
//    }
//    let oldUrls=JSON.parse(localStorage.getItem("urlsData"));
//    console.log(oldUrls)
//    let newUrls1={...oldUrls,...urlsData}

//    localStorage.setItem("urlsData",JSON.stringify(newUrls1))
//     const createNewUrl={name:addedName,id:uuid,addedUrl:addedUrl,}
//     props.onUrlValue(createNewUrl)
//     props.onReadUrl()
//     setAddedName('')
//     setAddedUrl('')}
//     else{alert('Invalid Feed Url')
//     setAddedUrl('')}

//   }

//   return (
//     <React.Fragment>
//       <div className={classes.addurl}>
//           <p>Name</p>
//           <input type='text' value={addedName} onChange={getNameHandler} ></input>
//           <p>AddUrl</p>
//           <input type="text" value={addedUrl} onChange={getUrlHandler}></input>
//           <button onClick={addUrlHandler}>Submit</button>

//       </div>
//     </React.Fragment>
//   );
// };

// export default AddUrl;

import { uid } from "uid";
import React, { useState } from "react";
import classes from "./AddUrl.module.css";
import notification from "./notification.mp3";

const AddUrl = (props) => {
  const audio = new Audio(notification);
  const [addedUrl, setAddedUrl] = useState("");
  const [addedName, setAddedName] = useState("");

  const getNameHandler = (e) => {
    const name = e.target.value;
    setAddedName(name);
  };

  const getUrlHandler = (e) => {
    const Url = e.target.value;
    setAddedUrl(Url);
  };

  const addUrlHandler = () => {
    if (
      addedUrl.includes("/rss") &&
      addedUrl.length > 0 &&
      addedName.length > 0
    ) {
      const uuid = uid();

      const urlsData = {
        [uuid]: {
          addedName: addedName,
          addedUrl: addedUrl,
          uuid: uuid,
        },
      };
      let oldUrls = JSON.parse(localStorage.getItem("urlsData"));
      console.log(oldUrls);
      let newUrls1 = { ...oldUrls, ...urlsData };

      localStorage.setItem("urlsData", JSON.stringify(newUrls1));
      const createNewUrl = { name: addedName, id: uuid, addedUrl: addedUrl };
      props.onUrlValue(createNewUrl);
      props.onReadUrl();
      setAddedName("");
      setAddedUrl("");
    } else {
      alert("Invalid Feed Url");
      setAddedUrl("");
    }

    audio.play();
  };

  return (
    <React.Fragment>
      <div className={classes.addurl}>
        <p>Name</p>
        <input type="text" value={addedName} onChange={getNameHandler}></input>
        <p>AddUrl</p>
        <input type="text" value={addedUrl} onChange={getUrlHandler}></input>
        <button onClick={addUrlHandler}>Submit</button>
      </div>
    </React.Fragment>
  );
};

export default AddUrl;
