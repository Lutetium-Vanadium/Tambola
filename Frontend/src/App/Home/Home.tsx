import React, { useState } from "react";
import store from "#root/store";
import { useHistory } from "react-router-dom";
import useQuery from "#helpers/useQuery";

function Home() {
  const params = useQuery();

  const [id, setId] = useState(params.get("id") ?? "");
  const [name, setName] = useState(store.get("name"));
  const [errored, setErrored] = useState(false);

  const history = useHistory();

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    store.set("name", e.target.value);
  };

  const changeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errored) setErrored(false);
    setId(e.target.value);
  };

  const joinGame = () => {
    if (!/^[a-z0-9]+/i.test(id)) {
      setErrored(true);
      return;
    }

    history.push(id);
  };

  return (
    <div className="page">
      <h1>Tambola</h1>
      <div className="join">
        <p>Your Name</p>
        <input value={name} onChange={changeName} placeholder="Name" />
        <p>Room Id</p>
        <input value={id} onChange={changeId} placeholder="Room ID" />
        {errored && "Invalid Id"}
        <button onClick={joinGame}>Join</button>
      </div>
    </div>
  );
}

export default Home;
