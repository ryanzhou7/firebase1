import React, { useEffect, useState } from "react";
import { signInWithGoogle, auth, createUserProfileDocument } from "./firebase";

function Login(props) {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // When the user logs in or out - get back
  const unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
    // If they log out when get user = null
    setUser(user);
  });

  useEffect(() => {
    // When this component unsubs
    return unsubscribeFromAuth();
  }, []);

  const onChangeInfo = (event, setState) => {
    const { value } = event.target;
    setState(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Creating a user with just the basics
    const { user } = await auth.createUserWithEmailAndPassword(email, password);

    // Create user object
    await createUserProfileDocument(user, { displayName });

    // we need to call set user
    setUser(user);
    setDisplayName("");
    setPassword("");
    setEmail("");
  };

  return (
    <div>
      <div>
        {user
          ? `You are logged in as ${user.displayName}`
          : "You are logged out"}
      </div>
      <button>Login with email</button>
      <button onClick={signInWithGoogle}>Login with Google</button>
      <button onClick={auth.signOut}>Logout</button>

      <form onSubmit={handleSubmit} style={{ margin: "2rem" }}>
        <label>Display name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => onChangeInfo(e, setDisplayName)}
        />
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => onChangeInfo(e, setEmail)}
        />
        <label>Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => onChangeInfo(e, setPassword)}
        />
        <button>Sign up</button>
      </form>
    </div>
  );
}

export default Login;
