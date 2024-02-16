import kaboom from 'kaboom'
import React,{useEffect, useState} from 'react'
import style from './game.module.css'
import fox from '../Sprites/foxSprite.png'
import stone from '../Sprites/stone.png'
import apple from '../Sprites/apple.png'
import coin from '../Sprites/coinSprite.png'
import grass from '../Sprites/grass_block.png'
import goal from '../Sprites/goalSprite.png'
import hole from '../Sprites/foxHole.png'
import bush from '../Sprites/Bush.png'
import slime from '../Sprites/slimeSprite.png'

export default function Game() {
    const canvas = React.useRef(null)
    /*function saveScore(score,level){
        sessionStorage.setItem("score",score)
        sessionStorage.setItem("levelIdx",level)
        console.log("score from storage:"+sessionStorage.getItem("score"))
    }*/
    useEffect(()=>{
        const k = kaboom({
            width:940,
            height:460,
            global:false,
            canvas:canvas.current,
            background:[0,0,0],
            scale:1.9
        })

        k.loadSprite("grass",grass)
        k.loadSprite("stone",stone)
        k.loadSprite("apple",apple)
        k.loadSprite("hole",hole)
        k.loadSprite("bush",bush)

        k.loadSprite("goal",goal,{
            sliceX:3,
            anims:{
                "open":{
                    from:0,
                    to:2,
                    speed:3
                }
            }
        })
        k.loadSprite("coin", coin,{
            sliceX: 6,
            anims:{
                "idle":{
                    from:0,
                    to:5,
                    speed:3,
                    loop:true
                }
            }
        })
        k.loadSprite("slime", slime,{
            sliceX: 6,
            anims:{
                "idle":{
                    from:0,
                    to:5,
                    speed:3,
                    loop:true
                },
                "death":{
                    from:0,
                    to:3,
                    speed:3,
                    loop:false
                }
            }
        })

        k.loadSprite("fox", fox,{
            sliceX: 6,
            anims:{
                "idle":{
                    from:0,
                    to:5,
                    speed:4,
                    loop:true
                }
            }
        })

        k.scene("main",()=>{
            k.debug.inspect=true
            const btn=k.add([
                k.pos(k.width()/2.1,350),
                k.area(),
                k.rect(200,50,{radius:10}),
                k.anchor("center"),
                k.color(255,165,0),
            ])

            btn.add([
                k.text("play",{width:90}),
                k.anchor("center"),
                k.pos(10,0),
                k.color(0,0,0),
            ])

            btn.onHoverUpdate(()=>{
                btn.scale=k.vec2(1.1)
            })
            btn.onHoverEnd(()=>{
                btn.scale=k.vec2(1)
            })

            btn.onClick(()=>{
                k.go("game",0,0)
            })
        })

        k.scene("win",(finalScore)=>{
            k.debug.inspect=true
            k.add([
                k.pos(k.width()/3,30),
                k.area(),
                k.text("Victory",{width:240,size:60}),
                k.color(255,165,0)
            ])
            k.add([
                k.pos(k.width()/3,150),
                k.text("Final Score",{width:400}),
                k.color(255,165,0)
            ])
            k.add([
                k.pos(k.width()/2.3,200),
                k.text(finalScore,{width:50}),
                k.color(255,165,0)
            ])
            const btn = k.add([
                k.pos(k.width()/2.22,390),
                k.rect(200,50,{radius:10}),
                k.color(255,165,0),
                k.area(),
                k.scale(1),
                k.anchor("center"),
                "mainMenu"
            ])
            btn.add([
                k.pos(5,5),
                k.text("Main Menu",{width:190}),
                k.color(0,0,0),
                k.anchor("center")
            ])

            btn.onClick(()=>{
                sessionStorage.removeItem("score")
                sessionStorage.removeItem("levelIdx")
                k.go("main")
            })

            btn.onHoverUpdate(()=>{
                btn.scale=k.vec2(1.1)
            })
            btn.onHoverEnd(()=>{
                btn.scale=k.vec2(1)
            })
        })

        k.scene("game",(levelIdx,score)=>{

        k.addLevel([
            "           ",
            "           ",
            "           ",
            "           ",
            "           ",
            "           ",
            "           ",
        ],{
            tileWidth:64,
            tileHeight:64,
            tiles:{
                " ":()=>[
                    k.sprite("grass"),
                    k.tile(),
                    k.outline(3),
                    k.pos(100,6)
                ]
            }
        })

        const levels=[
            [
                " &&&&&&&&&&&",
                " & ! #     &",
                " &   #     &",
                " &     <   &",
                " &¤     @  &",
                " &  ??>    &",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " & ! #     &",
                " &   #     &",
                " &      <  &",
                " &¤    <  @&",
                " &  ??     &",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " & !  ?    &",
                " &&&##&&&&&&",
                " &         &",
                " &¤     >  &",
                " &        @&",
                " &&&&&&&&&&&"
            ],
        ]
        const map = k.addLevel(levels[levelIdx],{
            tileWidth:64,
            tileHeight:64,
            tiles:{
                "#":()=>[
                    k.sprite("stone"),
                    k.tile({isObstacle:true,edges:["left","right","top","bottom"]}),
                    k.body({isStatic:true}),
                    k.area({collisionIgnore:"player"}),
                    k.anchor("center"),
                    k.pos(68,38),
                    "stone"
                ],
                "@":()=>[
                    k.sprite("goal"),
                    k.tile({isObstacle:true}),
                    k.area({scale:0.9}),
                    k.anchor("center"),
                    k.pos(68,38),
                    "goal",
                    {open:false}
                ],
                "¤":()=>[
                    k.sprite("apple"),
                    k.pos(68,38),
                    k.area({scale:1}),
                    k.anchor("center"),
                    "apple"
                ],
                "&":()=>[
                    k.sprite("bush"),
                    k.body({isStatic:true}),
                    k.tile({isObstacle:true,edges:["left","right","top","bottom"]}),
                    k.area(),
                    k.anchor("center"),
                    k.pos(68,38),
                    "bush"
                ],
                "<":()=>[
                    k.sprite("slime",{anim:"idle"}),
                    k.body({isStatic:true}),
                    k.tile({isObstacle:true}),
                    k.area(),
                    k.anchor("center"),
                    k.pos(68,38),
                    k.timer(),
                    k.z(1),
                    {alive:true,moving:true,direction:"vertical",turn:false},
                    "enemy"
                ],
                ">":()=>[
                    k.sprite("slime",{anim:"idle"}),
                    k.body({isStatic:true}),
                    k.tile({isObstacle:true}),
                    k.area(),
                    k.anchor("center"),
                    k.pos(68,38),
                    k.timer(),
                    k.z(1),
                    {alive:true,moving:true,direction:"horizontal",turn:false},
                    "enemy"
                ],
                "%":()=>[
                    k.sprite("slime",{anim:"idle"}),
                    k.body({isStatic:true}),
                    k.tile({isObstacle:true}),
                    k.area(),
                    k.anchor("center"),
                    k.pos(68,38),
                    k.timer(),
                    k.z(1),
                    {alive:true,moving:false,direction:"horizontal",turn:false},
                    "enemy"
                ],
                "?":()=>[
                    k.sprite("coin",{anim:"idle"}),
                    k.pos(68,38),
                    k.area(),
                    k.anchor("center"),
                    "coin"
                ],
                "!":()=>[
                    k.sprite("fox",{anim:"idle"}),
                    k.body(),
                    k.area({scale:1}),
                    k.anchor('center'),
                    k.tile(),
                    k.pos(68,38),
                    "player"
                ]
            }
        })

        let stepCount = 0
        switch(levelIdx){
            case 0:
                stepCount=10
                break;
            case 1:
                stepCount=12
                break;
            case 2:
                stepCount=15
                break;
        }

        const steps = k.add([
            k.circle(50),
            k.pos(50,420),
            k.color(255,165,0),
            k.outline(3)
        ])
        const stepText = steps.add([
            k.text(stepCount,{size:45}),
            k.anchor("center"),
            k.color(0,0,0)
        ])
        sessionStorage.setItem("score",score)
        const player = map.get("player")[0]
        let levelScore=0

        player.onCollideUpdate("apple",(apple,col)=>{
            if(col.hasOverlap()){
                k.destroy(apple)
                const goal = map.get("goal")[0]
                goal.open=true
                goal.play("open")
            }
        })

        player.onCollideUpdate("coin",(coin,col)=>{
            if(col.hasOverlap()){
                levelScore++
                k.destroy(coin) 
            }
        })

        k.onCollideUpdate("coin","stone",(coin,stone,col)=>{
            if(col.hasOverlap()){
                k.destroy(coin)
            }
        })

        player.onCollide("goal",(goal,col)=>{
            if(goal.open){
                if(col.hasOverlap()){
                    if(levelIdx+1 < levels.length){
                        const nextLevel = levelIdx+1
                        sessionStorage.setItem("levelIdx",nextLevel)
                        //saveScore(newScore,nextLevel)
                        k.go("game",nextLevel,score+levelScore)
                    }else{
                        //saveScore(newScore,0)
                        k.go("win",score+levelScore)
                    }
                }
            }
        })

        k.onUpdate(()=>{
            if(stepCount<0){
                k.go("game",levelIdx,score)
            }
        })

        /*k.onKeyPress("space",()=>{
            for(const collicionPlayer of player.getCollisions()){
                const object = collicionPlayer.target
                if(object.is("goal")){
                    if(object.open){
                        if(levelIdx+1 < levels.length){
                            const nextLevel = levelIdx+1
                            sessionStorage.setItem("score",Number(sessionStorage.getItem("score"))+score)
                            sessionStorage.setItem("levelIdx",nextLevel.toString())
                            k.go("game",levelIdx+1)
                        }else{
                            sessionStorage.setItem("score",Number(sessionStorage.getItem("score"))+score)
                            sessionStorage.setItem("levelIdx",0)
                            k.go("win")
                        }
                    }
                }
            }
        })*/

        player.onCollideUpdate("enemy",(enemy,col)=>{
            if(col.target.is("enemy")){
                if(col.hasOverlap()){
                    k.destroy(player)
                }
            }
        })

        k.onDestroy("player",()=>{
            k.go("game",levelIdx,score)
        })

        k.onCollideUpdate("stone","enemy",(stone,enemy,col)=>{
            if(col.hasOverlap()){
                if(enemy.alive){
                    enemy.alive=false
                    enemy.play("death")
                }
                k.wait(1,()=>{
                    k.destroy(enemy)
                })
            }
        })

        function checkCol(move){
            let stop = false
            if(player.getCollisions().length>0){
                for(const collisionPlayer of player.getCollisions()){
                    const object = collisionPlayer.target
                    if(object.is("bush")){
                        const x = player.pos.x-object.pos.x
                        const y = player.pos.y-object.pos.y
                        if(move==="left" && x>0 && y===0){
                            stop=true
                        }if(move==="right" && x<0 && y===0){
                            stop=true
                        }if(move==="up" && x===0 && y>0){
                            stop=true
                        }if(move==="down" && x===0 && y<0){
                            stop=true
                        }
                    }
                    if(object.is("stone")){
                        const x = player.pos.x-object.pos.x
                        const y = player.pos.y-object.pos.y
                        if(move==="left" && x>0 && y===0){
                            if(checkStone(move,object)){
                                stop=true
                            }else{
                                object.moveTo(object.pos.x-64,object.pos.y)
                                stop=false
                            }
                        }if(move==="right" && x<0 && y===0){
                            if(checkStone(move,object)){
                                stop=true
                            }else{
                                object.moveTo(object.pos.x+64,object.pos.y)
                                stop=false
                            }
                        }if(move==="up" && x===0 && y>0){
                            if(checkStone(move,object)){
                                stop=true
                            }else{
                                object.moveTo(object.pos.x,object.pos.y-64)
                                stop=false
                            }
                        }if(move==="down" && x===0 && y<0){
                            if(checkStone(move,object)){
                                stop=true
                            }else{
                                object.moveTo(object.pos.x,object.pos.y+64)
                                stop=false
                            }
                        }
                    }
                    if(object.is("enemy")){
                        const x = player.pos.x-object.pos.x
                        const y = player.pos.y-object.pos.y
                        if(move==="left" && x>0 && y===0){
                            stop=true
                        }if(move==="right" && x<0 && y===0){
                            stop=true
                        }if(move==="up" && x===0 && y>0){
                            stop=true
                        }if(move==="down" && x===0 && y<0){
                            stop=true
                        }
                    }
                }
                if(stop){
                    return false
                }else{
                    return true
                }
            }else{
                return true
            }
        }

        function checkStone(move,target){
            if(target.getCollisions().length>0){
                for(const collisionStone of target.getCollisions()){
                    const object = collisionStone.target
                    if(object.is("bush")){
                        let x = target.pos.x-object.pos.x
                        let y = target.pos.y-object.pos.y
                        if(move==="left" && x>0 && y===0){
                            return true
                        }if(move==="right" && x<0 && y===0){
                            return true
                        }if(move==="up" && x===0 && y>0){
                            return true
                        }if(move==="down" && x===0 && y<0){
                            return true
                        }
                    }
                }
            }else{
                return false
            }
        }

        function enemyMove(){
            for(const enemy of map.get("enemy")){
                for(const collisionEnemy of enemy.getCollisions()){
                    const object = collisionEnemy.target
                    if(object.is("bush")){
                        let x = enemy.pos.x-object.pos.x
                        let y = enemy.pos.y-object.pos.y
                        if(enemy.direction==="horizontal" && x>0 && y===0){
                            enemy.turn=true
                        }
                        if(enemy.direction==="horizontal" && x<0 && y===0){
                            enemy.turn=false
                        }
                        if(enemy.direction==="vertical" && y>0 && x===0){
                            enemy.turn=true
                        }
                        if(enemy.direction==="vertical" && y<0 && x===0){
                            enemy.turn=false
                        }
                    }
                }
                if(enemy.direction==="horizontal" && enemy.moving && enemy.alive){
                    if(enemy.turn){
                        enemy.moveTo(enemy.pos.x+64,enemy.pos.y)
                    }else{
                        enemy.moveTo(enemy.pos.x-64,enemy.pos.y)
                    }
                }
                if(enemy.direction==="vertical" && enemy.moving && enemy.alive){
                    if(enemy.turn){
                        enemy.moveTo(enemy.pos.x,enemy.pos.y+64)
                    }else{
                        enemy.moveTo(enemy.pos.x,enemy.pos.y-64)
                    }
                }
            }
        }


        k.onKeyPress("right",()=>{
            player.flipX=false
            if(checkCol("right")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x+64,player.pos.y)
                if(map.get("enemy").length>0){
                    enemyMove()
                }
            }
        })

        k.onKeyPress("left",()=>{
            player.flipX=true
            if(checkCol("left")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x-64,player.pos.y)
                if(map.get("enemy").length>0){
                    enemyMove()
                }
            }
        })

        k.onKeyPress("up",()=>{
            if(checkCol("up")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x,player.pos.y-64)
                if(map.get("enemy").length>0){
                    enemyMove()
                }
            }
        })

        k.onKeyPress("down",()=>{
            if(checkCol("down")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x,player.pos.y+64)
                if(map.get("enemy").length>0){
                    enemyMove()
                }
            }
        })


        k.debug.inspect=true
    })
    if(sessionStorage.getItem("levelIdx")>0){
        k.go("game",Number(sessionStorage.getItem("levelIdx")),Number(sessionStorage.getItem("score")))
    }else{
        sessionStorage.setItem("levelIdx",0)
        k.go("main")
    }
    },[])

    return (
        <div className={style.game}>
            <canvas className={style.canvas} ref={canvas}/>
        </div>
    )
}