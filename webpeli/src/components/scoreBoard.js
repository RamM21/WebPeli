import {AwsClient} from 'aws4fetch'
import React,{ useEffect, useState } from "react"
import style from './scoreBoard.module.css'

export default function ScoreBoard() {

    const[data,setData]=useState([])
    const aws = new AwsClient({
        accessKeyId:process.env.REACT_APP_KEY_ACCESS,
        secretAccessKey:process.env.REACT_APP_KEY_PERMISSION,
        service:process.env.REACT_APP_SERVICE,
        region:process.env.REACT_APP_REGION
    })

    async function getScore(){
        const response = await aws.fetch(process.env.REACT_APP_GET_SCORE)
        return response.json()
    }
    
    useEffect(()=>{
        getScore()
        .then(json=>setData(json))
        .catch(err=>console.log(err))
        scroll()
    },[])

    function scroll(){
        if(document.getElementById("user")){   
            document.getElementById("user").scrollIntoView({behavior:"smooth"})
        }
    }

    return(
        <div style={{backgroundColor:"black",height:"931px"}}>
            <div className={style.title}>ScoreBoard</div>
            <div className={style.boxTop}>
                    <div className={style.positionTop}>Position</div>
                    <div className={style.userNameTop}>UserName</div>
                    <div className={style.scoreTop}>Score</div>
            </div>
            <div className={style.box}>
                
                {data.map((e,index)=><div>
                        {sessionStorage.getItem("userName")===e.userName ?  
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