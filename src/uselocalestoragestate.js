import { useState,useEffect } from "react"

export function useLocalstorage(intialval,key){
    const [value, setvalue] = useState(function(){
        const intiall=JSON.parse(localStorage.getItem(key))
        return intiall===null ? intialval : intiall
      });
    useEffect(function(){
        localStorage.setItem(key,JSON.stringify(value))
      },[value,key])

      return [value,setvalue]
}