import Game from './components/game'
import NavBar from './components/navBar'
import SingUp from './components/singUp'
import Login from './components/login'
import ScoreBoard from './components/scoreBoard'
import Account from './components/account'
import { useEffect, useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  const[logged,setLogged]=useState(false)
  useEffect(()=>{
    if(sessionStorage.getItem("userId") != null){
      setLogged(true)
    }
  },[])

  if(logged){
  return (
    <BrowserRouter>
      <NavBar login={setLogged}/>
      <Routes>
        <Route path='/' element={<Game/>}/>
        <Route path='/scoreBoard' element={<ScoreBoard/>}/>
        <Route path='/account' element={<Account/>}/>
      </Routes>
    </BrowserRouter>
  )
  }else{
    return(
      <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Game/>}/>
        <Route path='/singUp' element={<SingUp/>}/>
        <Route path='/login' element={<Login login={setLogged}/>}/>
      </Routes>
    </BrowserRouter>
    )
  }
}

export default App;
