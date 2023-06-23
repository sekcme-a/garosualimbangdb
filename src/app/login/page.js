'use client'

import { TextField } from "@mui/material"
import { useState } from "react"

import IdAndPassword from "./components/IdAndPassword"

const Login = () => {
  //*****for inputs
  const [values, setValues] = useState({
    
  })
  const onValuesChange = (prop) => (event) => {
      setValues({...values, [prop]: event.target.value})
  }
  const [error, setError] = useState({
    type:"",
    message:""
  })
  const handleError = (type, message) => { setError({type: type, message: message})}
  //for inputs*****

  return(
    <IdAndPassword />
  )
}
export default Login