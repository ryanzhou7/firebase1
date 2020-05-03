import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Login from "./Login";
import { firestore } from "./firebase";
import {
  getTweets,
  updateTweet,
  addTweet,
  deleteTweet,
  updateTweetById,
} from "./utilities";

const style = { margin: "2em" };

function App() {
  const [docs, setDocs] = useState(() => []);
  const [newTweetTitle, setNewTweetTitle] = useState(() => "");
  const updateIdInput = useRef(null);
  const updateTitleInput = useRef(null);

  const saveTweet = (e) => {
    setNewTweetTitle(e.target.value);
  };

  const submitTweet = async (e) => {
    e.preventDefault();
    // adds it, generates an id, return back the place where I put your new doc
    const docRef = await addTweet(newTweetTitle);
  };

  useEffect(() => {
    function onSnapshot() {
      // Every time there are changes in the tweets collection call this function
      firestore.collection("tweets").onSnapshot((snapshot) => {
        setDocs(snapshot.docs);
      });
    }

    // Returns a link to unsub to these changes
    const unsubscribe = onSnapshot();

    // When this component is removed we want to unsub from the changes
    return unsubscribe;
  }, []);

  function createTweetList(docs) {
    return docs.map((tweet) => {
      const data = tweet.data();
      const { id } = tweet;
      return (
        <div key={tweet.id} style={style}>
          <div>id: {id}</div>
          <div>Title: {data.title}</div>
          <button onClick={() => updateTweet(tweet)}>Update</button>
          <button onClick={() => deleteTweet(id)}>Delete</button>
        </div>
      );
    });
  }

  return (
    <div className="App">
      <div>{createTweetList(docs)}</div>

      <div style={style}>
        <label>Id:</label>
        <input type="text" ref={updateIdInput} />
        <label>Title:</label>
        <input type="text" ref={updateTitleInput} />
        <button
          onClick={() => updateTweetById(updateIdInput, updateTitleInput)}
        >
          Update
        </button>
      </div>

      <div style={style}>
        <form onSubmit={submitTweet}>
          <input onChange={saveTweet} type="text"></input>
          <button>New Tweet</button>
        </form>
      </div>

      <Login style={style} />
    </div>
  );
}

export default App;
