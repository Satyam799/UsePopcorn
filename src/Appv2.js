import { useEffect, useState } from "react";
import Stars from './startrating'
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const KEY='ea5abd44'
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);




export default function App() {
  const [query, setQuery] = useState("");
  const [selectedid,setselectedid]=useState(null)
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [error,seterror]=useState("")
  const [isloading,setisloding]=useState(false)
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


useEffect(function(){
  const controller=new AbortController()
  handleclose()

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
return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
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




function handleadd(){
  const newaddedmovie={
imdbID:selectedid,
imdbRating:Number(imdbRating),
Title,
Year,
Poster,
Runtime:Number(Runtime.split(" ")[0]),
userrating
  }
  handelwatched(newaddedmovie)
  handleclose()

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

useEffect(function(){
  const callback=function(e){
    if(e.code==='Escape'){
      handleclose()
    }
  }
  document.addEventListener('keydown',callback)
  return function(){ 
    document.removeEventListener('keydown',callback)
  }
  },[handleclose])


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