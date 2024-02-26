import { useEffect } from "react";


export function useKey(key,call){
    useEffect(function(){
        const callback=function(e){
          if(e.code.toLowerCase()===key.toLowerCase()){
            call()
          }
      }
      document.addEventListener('keydown',callback)
      return function(){
        document.removeEventListener('keydown',callback)
      }
      },[key,call])
      
}