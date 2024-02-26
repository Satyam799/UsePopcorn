import { useState,useEffect } from "react"


const KEY='ea5abd44'

export function useMovies(query){
    const [movies, setMovies] = useState([]);
  const [error,seterror]=useState("")
  const [isloading,setisloding]=useState(false)

  useEffect(function(){
    const controller=new AbortController()
   // callback?.()
   async function fatchmovies(){
      try{
    setisloding(true)
    seterror('')
    const hi=await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal})
  
  if(!hi.ok)throw new Error('Somthing Went Very Wrong')
  
  const data1=await hi.json()
  
  if(data1.Response==='False') throw new Error("Movies Not Found")
  
  setMovies(data1.Search)
  seterror('')
  
      }catch(err){
        if(err.name !== 'AbortError'){
        seterror(err.message)
        }
      }finally{
        setisloding(false)
  
      }
  }
  if(query.length<3){
    setMovies([])
    return seterror('')
  }
  
  fatchmovies()
  
  return function(){
    controller.abort()
  }
  },[query])

  return {movies,error,isloading}
}