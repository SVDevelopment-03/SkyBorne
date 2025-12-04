import React from "react";
import SignupContainer from "./SignupContainer";
import { SignupProvider } from "./SignupContext";

const Signup = ({step}:{step:string}) => {
  return (
    <SignupProvider initialStep={step}>
      <SignupContainer />
    </SignupProvider>
  );
};

export default Signup;
