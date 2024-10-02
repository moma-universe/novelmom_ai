"use client";

//remove signin
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

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
