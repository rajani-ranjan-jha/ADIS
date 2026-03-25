import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";

function Test() {
  const [count, setCount] = useState(0);

  async function fetchData() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/battery");
      const data = await res.json()
      if (res.ok) {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function fetchData2() {
    try {
      const res = await fetch("http://127.0.0.1:8000");
      const data = await res.json()
      if (res.ok) {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <div>
        <button className="bg-white text-blue" onClick={() => {fetchData2()}}>check</button>
        <button onClick={() => {fetchData()}}>get battery status</button>
      </div>
    </>
  );
}

export default Test;
