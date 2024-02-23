import axios from 'axios'
import React,{ useEffect, useState } from "react"
import style from './scoreBoard.module.css'
import array from './data.json'

export default function ScoreBoard() {

    const[data,setData]=useState([])
    
    useEffect(()=>{
        /*axios.get(process.env.REACT_APP_GET_SCORE)
        .then(Response=>{
            setData(Response.data)
        })
        .catch(err=>{
            console.log(err)
        })*/
        setData(array)
        scroll()
    },[data])

    function scroll(){
        if(document.getElementById("user")){   
            document.getElementById("user").scrollIntoView({behavior:"smooth"})
        }
    }

    return(
        <div style={{backgroundColor:"black"}}>
            <div className={style.title}>ScoreBoard</div>
            <div className={style.boxTop}>
                    <div className={style.positionTop}>Position</div>
                    <div className={style.userNameTop}>UserName</div>
                    <div className={style.scoreTop}>Score</div>
            </div>
            <div className={style.box}>
                
                {data.map((e,index)=><div>
                        {sessionStorage.getItem("userId")===e.userId ?  
                        <div className={style.scoreRow}>
                            <div id='user' key={index} className={style.usersPosition}>{index+1}</div>
                            <div className={style.usersName}>{e.userName}</div>
                            <div className={style.usersScore}>{e.score}</div>
                        </div>
                        :
                        <div className={style.scoreRow}>
                            <div key={index} className={style.position}>{index+1}</div>
                            <div className={style.userName}>{e.userName}</div>
                            <div className={style.score}>{e.score}</div>
                        </div>}
                </div>)}
            </div>
        </div>
    )

}