"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUp,
  UserButton,
} from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="container">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default SignUpPage;
