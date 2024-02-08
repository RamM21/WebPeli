import axios from 'axios'
import { useEffect, useState } from "react"
import style from './scoreBoard.module.css'
import array from './data.json'

export default function ScoreBoard() {

    const[data,setData]=useState([])
    
    useEffect(()=>{
        /*axios.get('')
        .then(Response=>{
            setData(Response.data)
        })
        .catch(err=>{
            console.log(err)
        })*/
        setData(array)
    },[])

    return(
        <div style={{backgroundColor:"black"}}>
            <div className={style.title}>ScoreBoard</div>
            <div className={style.boxTop}>
                    <div className={style.positionTop}>Position</div>
                    <div className={style.userNameTop}>UserName</div>
                    <div className={style.scoreTop}>Score</div>
            </div>
            <div className={style.box}>
                
                {data.map((e,index)=><div className={style.scoreRow}>
                    <div className={style.position}>{index}</div>
                    {sessionStorage.getItem("userId")===e.userId ? <div className={style.usersName}>{e.userName}</div> :<div className={style.userName}>{e.userName}</div>}
                    <div className={style.score}>{e.score}</div>
                </div>)}
            </div>
        </div>
    )

}