import { useEffect, useRef, useState } from "react";
import Stars from './startrating'
import {useMovies} from './useMovies'
import { useLocalstorage } from "./uselocalestoragestate";
import { useKey } from "./useKey";
const KEY='ea5abd44'
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);




export default function App() {
  const [query, setQuery] = useState("");
  const [selectedid,setselectedid]=useState(null)
  const [watched, setWatched] = useLocalstorage([],'watched')

function handelwatched(movie){
setWatched(watched=>[...watched,movie])
}

function handelselectionofmovie(value){
    setselectedid((selectedid)=>selectedid===value ? null: value )
  }

  function handleclose(){
    setselectedid(null)
  }

function handledelete(movie){
  setWatched(watched.filter((element)=>element.imdbID !== movie.imdbID))
}


const {movies,error,isloading}=useMovies(query)
  return (
    <>
      <NavBar>
      
       <Search query={query} setQuery={setQuery}/>
       <Numresult movies={movies}/>
       </NavBar>
      <Main >
        <Box>
        {isloading && <Loading/> }
        {!isloading && !error && <Movielist movies={movies} 
        handelselectionofmovie={handelselectionofmovie} />}
        {error && <ErrorMessage message={error}/>}
        </Box>
        <Box>{ selectedid ? <MoviesDetails 
        selectedid={selectedid} 
        handleclose={handleclose}
        handelwatched={handelwatched}
        watched={watched}
        /> :
        <>
      <Summary watched={watched}/>
      <Watchedmovieslist watched={watched} handledelete={handledelete} />  
      </>
    }
      </Box>
      </Main>
      
    </>
  );
}





function NavBar({movies,children}){

  return <nav className="nav-bar">
      <Logo/>
       {children}
      </nav>
}
function Logo(){
  return  <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcorn</h1>
</div>
}
function Numresult({movies}){
return  <p className="num-results">
Found <strong>{movies.length}</strong> results
</p>
}

function Search({query,setQuery}){
const inputEl=useRef(null)
useKey('Enter',function(e){
  if(document.activeElement===inputEl.current) return
        setQuery('')  
        inputEl.current.focus()
      }
  )

return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  ref={inputEl}
/>
}

function Loading(){
  return (<div className="loader">Loading...</div>)
}

function ErrorMessage({message}){
  return(
    <p className="error">
<span>⛔</span>
{message}
    </p>
  )
}


function Main({children}){



return <main className="main">
       
{children}
              
</main>
}


function Box({children}){
  const [isOpen, setIsOpen] = useState(true);

 return  <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
  {isOpen && children }
</div>
}

function Movielist({movies ,handelselectionofmovie}){

  return <ul className="list list-movies">
  {movies?.map((movie) => <Movies movie={movie}  key={movie.imdbID} handelselectionofmovie={handelselectionofmovie}/>)}
</ul>
}

function Movies({movie,handelselectionofmovie}){
  return  <li onClick={()=>handelselectionofmovie(movie.imdbID)}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>🗓</span>
      <span>{movie.Year}</span>
    </p>
  </div>
</li>
}



function Summary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userrating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));
  return <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating.toFixed(2)}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating.toFixed(2)}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime} min</span>
    </p>
  </div>
</div>
}

function MoviesDetails({selectedid,handleclose,handelwatched,watched }){
const [completemoviedata,setcompletemoviedata]=useState('')
const[loading,setloading]=useState(false)
const [userrating,setuserrating]=useState('')
const usecount=useRef(0)
 
useEffect(function(){
 if(userrating)  usecount.current++
},[userrating])

const {
Plot,
Actors,
Director,
Genre,
Poster,
Released,
Runtime,
Title,
imdbRating,
Year

}=completemoviedata


const istop=imdbRating>8

console.log(istop)
const [average,setaverage]=useState(0)


function handleadd(){
const newaddedmovie={
imdbID:selectedid,
imdbRating:Number(imdbRating),
Title,
Year,
Poster,
Runtime:Number(Runtime.split(" ")[0]),
userrating,
countusersrating:usecount.current,

  }
  handelwatched(newaddedmovie)
  //handleclose()
setaverage(Number(imdbRating))
setaverage((average)=>(average+userrating)/2)
} 

useEffect(function(){
if(!Title) return
  document.title=`Movie | ${Title}` 

  return function(){
    document.title='usePopcorn'
  }
},[Title])

const iswatched=watched.map((el)=>el.imdbID).includes(selectedid)

const watchedornot=watched.find((element)=>element.imdbID===selectedid)?.userrating

useKey('Escape',handleclose)

useEffect(function(){
async function moviescomplete(){
setloading(true)
const hi= await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedid}`)
const data=await hi.json()
setcompletemoviedata(data)
setloading(false)

}

  moviescomplete()
}
,[selectedid])
  
  return <div className="details">
    { loading ? <Loading/> : <>
    <header>
        <button className="btn-back" onClick={handleclose}>&larr;</button>
   <img src={Poster} alt={`Poster is of ${completemoviedata}`}/>
   <div className="details-overview">
   <h2>{Title}</h2>
   <p>{Released} &bull; {Runtime}</p>
   <p>{Genre}</p>
   <p><span>⭐</span>{imdbRating} IMDB rating</p>
   </div>
    </header>
    <p>{average}</p>
<section>
  <div className="rating">
  {!iswatched ? <>
  <Stars maxstart={10} size={24} onsetrating={setuserrating} />
   {userrating && <button className="btn-add" onClick={handleadd}>+ Add to list</button>}
   </>
   : <p>Your Rating is already given  {watchedornot} <span>⭐</span></p>}
  </div>
  <p><em>{Plot}</em></p>
  <p>Staring {Actors}</p>
  <p>Directed by {Director}</p>
</section>
</>
}

</div> 
}

function Watchedmovieslist({watched,handledelete}){
  return <ul className="list">
  {watched.map((movie) => <Films movie={movie}  key={movie.imdbID} handledelete={handledelete} />)}
</ul>
}

function Films({movie,handledelete}){
  return  <li>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userrating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.Runtime} min</span>
    </p>
    <button className="btn-delete" onClick={()=>handledelete(movie)}>X</button>
  </div>
</li>
}