"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import Loader from "src/public/components/Loader"


import SignInWithEmail from "./components/SignInWithEmail"

const SignIn = () => {
  const {user} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async () => {
      setIsLoading(false)
    }
    fetchData()
  },[])

  if(isLoading)
    return <Loader />
  
  return(
    <div style={{width:"300px", padding: "20px 15px"}}>
      <SignInWithEmail />
    </div>
  )
}

export default SignIn