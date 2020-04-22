import { firestore } from "./firebase";

/* Firestore  */
async function getTweets() {
  return firestore.collection("tweets").get();
}

async function updateTweet(tweet) {
  const tweetData = {
    title: tweet.data().title,
  };

  // Suppose to return a callback for when it's updated?
  return firestore.collection("tweets").doc(tweet.id).set(tweetData);
}

async function updateTweetById(idInputRef, titleInputRef) {
  const { value: id } = idInputRef.current;
  const { value: title } = titleInputRef.current;
  const tweetData = {
    title: title,
  };
  firestore.doc(`tweets/${id}`).set(tweetData);
}

async function addTweet(title) {
  return firestore.collection("tweets").add({ title: title });
}

async function deleteTweet(id) {
  await firestore.doc(`tweets/${id}`).delete();
}

export { getTweets, updateTweet, addTweet, deleteTweet, updateTweetById };
