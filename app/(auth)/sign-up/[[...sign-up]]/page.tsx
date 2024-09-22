import React from 'react'
import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  return  <SignUp signInForceRedirectUrl={"/dashboard"}/>
}

export default SignUpPage