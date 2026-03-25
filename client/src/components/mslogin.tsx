import { shell } from "electron";


const MSLogin = () => {
  // When user clicks "Login with Microsoft"
  function loginWithMicrosoft() {
    // Just redirect to your backend's login route
    // Your backend handles everything from here
    console.log('logging in')
    window.location.href = "http://localhost:8000/auth/microsoft/login";

  }
  return (
    <div className="w-200 h-50 border-2 border-red-500 flex justify-center items-center">
      {/* <button onClick={() => loginWithMicrosoft()}>Login with MS</button> */}
      <a href="http://localhost:8000/auth/microsoft/login" onClick={(e) => {
        e.preventDefault()
        shell.openExternal('http://localhost:8000/auth/microsoft/login')
      }} >Login with MS</a>

    </div>
  );
};

export default MSLogin;
