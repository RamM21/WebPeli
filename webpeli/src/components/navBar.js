import React from 'react'
import { Link } from 'react-router-dom'
import style from './navBar.module.css'

export default function NavBar(props) {

    function logout(){
        sessionStorage.removeItem("userId")
        sessionStorage.removeItem("userName")
        props.login(false)
    }

    var userId = sessionStorage.getItem("userId")
    if(userId){
        return(
            <div className={style.box}>
                <Link className={style.home} to='/'>Home</Link>
                <Link className={style.scoreBoard} to='/scoreBoard'>ScoreBoard</Link>
                <div className={style.rightBox}>
                    <Link to='/account' className={style.account}>Account</Link>
                    <Link to='/'><button className={style.logout} onClick={()=>logout()}>Logout</button></Link>
                </div>
            </div>
        )
    }else{
        return(
            <div className={style.box}>
                <Link className={style.home} to='/'>Home</Link>
                <div className={style.rightBox}>
                    <Link className={style.singUp} to='/singUp'>Sign Up</Link>
                    <Link className={style.login} to='/login'>Login</Link>
                </div>
            </div>
        )
    }
}