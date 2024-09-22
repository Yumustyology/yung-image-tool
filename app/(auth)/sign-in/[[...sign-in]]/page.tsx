import React from 'react'
import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return  <SignIn signUpForceRedirectUrl={"/dashboard"}/>
}

export default SignInPage