'use client'

import { createContext, useState, useEffect,  useContext } from "react";
import { firestore as db } from "firebase/firebase";
import { firebaseHooks } from "firebase/hooks";
import Loader from "src/public/components/Loader";
import { useRouter } from "next/navigation";

const dataContext = createContext()

export default function useData(){
    return useContext(dataContext)
}

export function DataProvider(props){  

  const [user, setUser] = useState(null)
  

  const value={
    user, setUser
  }

// if(isLoading)
//   return <Loader />

return <dataContext.Provider value={value} {...props} />
}
