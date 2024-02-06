import React,{useEffect} from 'react'

export default function Header() {

    const [text,setText]=useState("")

    return(
        <div style={{display:"flex"}}>
            <button onClick={()=>setText("button pressed")}>press button</button>
            <p>{text}</p>
        </div>
    )
}