import kaboom, { Color } from 'kaboom'
import React,{useEffect} from 'react'
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

    useEffect(()=>{
        const k = kaboom({
            width:800,
            height:400,
            global:false,
            canvas:canvas.current,
            background:[0,0,0],
            scale:2
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

        k.scene("main",(level)=>{

        k.addLevel([
            "        ",
            "        ",
            "        ",
            "        ",
            "        ",
            "        ",
        ],{
            tileWidth:64,
            tileHeight:64,
            tiles:{
                " ":()=>[
                    k.sprite("grass"),
                    k.tile(),
                    k.outline(3),
                    k.pos(50,10)
                ]
            }
        })

        const map = k.addLevel([
            " &&&&&&&&",
            " &   #  &",
            " &   #  &",
            " &     %&",
            " &¤    @&",
            " &&&&&&&&",
        ],{
            tileWidth:64,
            tileHeight:64,
            tiles:{
                "#":()=>[
                    k.sprite("stone"),
                    k.tile({isObstacle:true,edges:["left","right","top","bottom"]}),
                    k.body({isStatic:true}),
                    k.area({collisionIgnore:"player"}),
                    k.anchor("center"),
                    k.pos(18,42),
                    "wall"
                ],
                "@":()=>[
                    k.sprite("goal"),
                    k.tile({isObstacle:true}),
                    k.area({scale:1}),
                    k.anchor("center"),
                    k.pos(18,42),
                    "goal",
                    {open:false}
                ],
                "¤":()=>[
                    k.sprite("apple"),
                    k.pos(18,42),
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
                    k.pos(18,42),
                    "bush"
                ],
                "%":()=>[
                    k.sprite("slime",{anim:"idle"}),
                    k.body({isStatic:true}),
                    k.tile({isObstacle:true}),
                    k.area(),
                    k.anchor("center"),
                    k.pos(18,42),
                    k.timer(),
                    k.z(1),
                    {alive:true},
                    "enemy"
                ]
            }
        })

        const player = map.spawn([
            k.sprite("fox",{anim:"idle"}),
            k.body(),
            k.area({scale:1}),
            k.anchor('center'),
            k.tile(),
            k.pos(210,42),
            "player"
        ])

        player.onCollideUpdate("apple",(apple,col)=>{
            if(col.hasOverlap()){
                k.destroy(apple)
                const goal = map.get("goal")[0]
                goal.open=true
                goal.play("open")
            }
        })

        player.onCollideUpdate("goal",(goal,col)=>{
            if(goal.open){
                if(col.hasOverlap()){
                    console.log("win")
                }
            }
        })

        player.onCollideUpdate("enemy",(enemy,col)=>{
            if(col.target.is("enemy")){
                if(col.hasOverlap()){
                    k.destroy(player)
                }
            }
        })

        k.onDestroy("player",()=>{
            k.go("main",0)
        })

        k.onCollideUpdate("wall","enemy",(wall,enemy,col)=>{
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
                    if(object.is("wall")){
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
            const enemy = map.get("enemy")[0]
            enemy.moveTo(enemy.pos.x-64,enemy.pos.y)
        }


        k.onKeyPress("right",()=>{
            player.flipX=false
            if(checkCol("right")){
                player.moveTo(player.pos.x+64,player.pos.y)
                enemyMove()
            }
        })

        k.onKeyPress("left",()=>{
            player.flipX=true
            if(checkCol("left")){
                player.moveTo(player.pos.x-64,player.pos.y)
                enemyMove()
            }
        })

        k.onKeyPress("up",()=>{
            if(checkCol("up")){
                player.moveTo(player.pos.x,player.pos.y-64)
                enemyMove()
            }
        })

        k.onKeyPress("down",()=>{
            if(checkCol("down")){
                player.moveTo(player.pos.x,player.pos.y+64)
                enemyMove()
            }
        })


        k.debug.inspect=true
    })
    k.go("main",0)
    },[])

    return <canvas ref={canvas}/>
}