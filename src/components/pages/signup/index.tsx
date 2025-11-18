import React from "react";
import SignupContainer from "./SignupContainer";
import { SignupProvider } from "./SignupContext";

const Signup = () => {
  return (
    <SignupProvider>
      <SignupContainer />
    </SignupProvider>
  );
};

export default Signup;
