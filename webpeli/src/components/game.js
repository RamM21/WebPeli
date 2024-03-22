import kaboom from 'kaboom'
import React,{useEffect} from 'react'
import {AwsClient} from 'aws4fetch'
import { useAlert } from 'react-alert'
import style from './game.module.css'
import fox from '../Sprites/foxSprite.png'
import stone from '../Sprites/stone.png'
import apple from '../Sprites/apple.png'
import coin from '../Sprites/coinSprite.png'
import grass from '../Sprites/grassSprite.png'
import goal from '../Sprites/goalSprite.png'
import key from '../Sprites/keySprite.png'
import trap from '../Sprites/trapSprite.png'
import hole from '../Sprites/foxHole.png'
import bush from '../Sprites/Bush.png'
import slime from '../Sprites/slimeSprite.png'
import walk1 from '../Sfx/walk1.wav'
import walk2 from '../Sfx/walk2.wav'
import walk3 from '../Sfx/walk3.wav'
import coin1 from '../Sfx/coin1.wav'
import coin2 from '../Sfx/coin2.wav'
import coin3 from '../Sfx/coin3.wav'
import enemy1 from '../Sfx/enemy1.wav'
import enemy2 from '../Sfx/enemy2.wav'
import enemy3 from '../Sfx/enemy3.wav'
import stone1 from '../Sfx/stone1.wav'
import stone2 from '../Sfx/stone2.wav'
import stone3 from '../Sfx/stone3.wav'
import key1 from '../Sfx/key1.wav'
import key2 from '../Sfx/key2.wav'
import key3 from '../Sfx/key3.wav'
import appleSound from '../Sfx/apple.wav'
import voice from '../Sfx/voice.wav'
import select from '../Sfx/select.wav'
import stageChange from '../Sfx/stageChange.wav'

export default function Game() {
    const canvas = React.useRef(null)
    const alert = useAlert()
    const aws = new AwsClient({
        accessKeyId:process.env.REACT_APP_KEY_ACCESS,
        secretAccessKey:process.env.REACT_APP_KEY_PERMISSION,
        service:process.env.REACT_APP_SERVICE,
        region:process.env.REACT_APP_REGION
    })
    //Function to post final score to database
    async function postScore(){
        var body = {"userName":sessionStorage.getItem("userName"),"score":sessionStorage.getItem("score"),"userId":sessionStorage.getItem("userId")}
        body = JSON.stringify(body)
        var response = await aws.fetch(process.env.REACT_APP_POST_SCORE,{method:"post",body:body})
        response = await response.json()
        console.log(response)
        if(response.successful===true){
            alert.success("Score posted to scoreboard successfully")
        }
        else{
            alert.error("Something went wrong posting score, try again")
        }
    }

    useEffect(()=>{
        
        //Making game context handler
        const k = kaboom({
            width:940,
            height:460,
            global:false,
            canvas:canvas.current,
            background:[0,0,0],
            scale:1.9
        })

        //Loading sfx and sprites to use in game
        k.loadSound("walk1",walk1)
        k.loadSound("walk2",walk2)
        k.loadSound("walk3",walk3)
        k.loadSound("coin1",coin1)
        k.loadSound("coin2",coin2)
        k.loadSound("coin3",coin3)
        k.loadSound("enemy1",enemy1)
        k.loadSound("enemy2",enemy2)
        k.loadSound("enemy3",enemy3)
        k.loadSound("key1",key1)
        k.loadSound("key2",key2)
        k.loadSound("key3",key3)
        k.loadSound("stone1",stone1)
        k.loadSound("stone2",stone2)
        k.loadSound("stone3",stone3)
        k.loadSound("apple",appleSound)
        k.loadSound("voice",voice)
        k.loadSound("select",select)
        k.loadSound("stage",stageChange)

        //Setting volume for sound
        k.volume(0.2)

        k.loadSprite("stone",stone)
        k.loadSprite("apple",apple)
        k.loadSprite("hole",hole)
        k.loadSprite("bush",bush)

        k.loadSprite("grass",grass,{
            sliceX:4,
        })
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
        k.loadSprite("key",key,{
            sliceX:6,
            anims:{
                "idle":{
                    from:0,
                    to:5,
                    speed:4,
                    loop:true
                }
            }
        })
        k.loadSprite("trap",trap,{
            sliceX:5,
            anims:{
                "up":{
                    from:0,
                    to:4,
                    speed:5
                },
                "down":{
                    from:4,
                    to:0,
                    speed:5
                }
            }
        })
        k.loadSprite("coin", coin,{
            sliceX: 6,
            anims:{
                "idle":{
                    from:0,
                    to:5,
                    speed:5,
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
                    speed:4,
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
                    speed:5,
                    loop:true
                }
            }
        })

        //Start Scene
        k.scene("main",()=>{

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
                        k.sprite("grass",{frame:~~k.rand(0,3),flipX:~~k.rand()}),
                        k.tile(),
                        k.outline(3),
                        k.pos(100,6)
                    ]
                }
            })
            k.addLevel([
                " &&&&&&&&&&&",
                " &  % ??  ¤&",
                " &$ #  + # &",
                " &    !   &&",
                " & %  - ?  &",
                " &  &     @&",
                " &&&&&&&&&&&",
            ],{
                tileWidth:64,
                tileHeight:64,
                    tiles:{
                        "#":()=>[
                            k.sprite("stone"),
                            k.tile({isObstacle:true,edges:["left","right","top","bottom"]}),
                            k.anchor("center"),
                            k.pos(68,36),
                        ],
                        "@":()=>[
                            k.sprite("goal"),
                            k.tile({isObstacle:true}),
                            k.anchor("center"),
                            k.pos(68,38),
                        ],
                        "¤":()=>[
                            k.sprite("apple"),
                            k.pos(68,38),
                            k.anchor("center"),
                        ],
                        "&":()=>[
                            k.sprite("bush"),
                            k.tile({isObstacle:true,edges:["left","right","top","bottom"]}),
                            k.anchor("center"),
                            k.pos(68,38),
                        ],
                        "%":()=>[
                            k.sprite("slime",{anim:"idle"}),
                            k.tile({isObstacle:true}),
                            k.anchor("center"),
                            k.pos(68,38),
                        ],
                        "?":()=>[
                            k.sprite("coin",{anim:"idle"}),
                            k.pos(68,38),
                            k.anchor("center"),
                        ],
                        "!":()=>[
                            k.sprite("fox",{anim:"idle"}),
                            k.anchor('center'),
                            k.tile(),
                            k.pos(68,38),
                            k.z(1)
                        ],
                        "$":()=>[
                            k.sprite("key",{anim:"idle"}),
                            k.pos(68,38),
                            k.anchor("center"),
                        ],
                        "-":()=>[
                            k.sprite("trap",{frame:0}),
                            k.pos(68,38),
                            k.anchor("center"),
                        ],
                        "+":()=>[
                            k.sprite("trap",{frame:4}),
                            k.pos(68,38),
                            k.anchor("center"),
                        ]
                    }
            })
            k.debug.inspect=true
            const btn=k.add([
                k.pos(k.width()/2.08,360),
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
                k.play("select")
                k.go("game",0,0)
            })
        })

        //End scene
        k.scene("win",(finalScore)=>{

            sessionStorage.setItem("score",finalScore)
            k.debug.inspect=true
            k.add([
                k.pos(k.width()/3.1,30),
                k.area(),
                k.text("Victory",{width:240,size:60}),
                k.z(1),
                k.color(255,165,0)
            ])
            k.add([
                k.pos(k.width()/3,150),
                k.text("Final Score",{width:400}),
                k.z(1),
                k.color(255,165,0)
            ])
            k.add([
                k.pos(k.width()/2.9,200),
                k.text(finalScore,{width:200,align:"center"}),
                k.z(1),
                k.color(255,165,0),
            ])
            const menuBtn = k.add([
                k.pos(k.width()/2.22,390),
                k.rect(200,50,{radius:10}),
                k.color(255,165,0),
                k.area(),
                k.z(1),
                k.scale(1),
                k.anchor("center"),
            ])
            menuBtn.add([
                k.pos(5,5),
                k.text("Main Menu",{width:190}),
                k.color(0,0,0),
                k.anchor("center")
            ])

            menuBtn.onClick(()=>{
                k.play("select")
                sessionStorage.removeItem("score")
                sessionStorage.removeItem("levelIdx")
                k.go("main")
            })

            menuBtn.onHoverUpdate(()=>{
                menuBtn.scale=k.vec2(1.1)
            })
            menuBtn.onHoverEnd(()=>{
                menuBtn.scale=k.vec2(1)
            })

            if(sessionStorage.getItem("userId")!=null){
                const scoreBtn = k.add([
                    k.pos(k.width()/2.22,310),
                    k.rect(220,50,{radius:10}),
                    k.color(255,165,0),
                    k.area(),
                    k.z(1),
                    k.scale(1),
                    k.anchor("center"),
                ])
                scoreBtn.add([
                    k.pos(5,5),
                    k.text("Save Score",{width:210}),
                    k.color(0,0,0),
                    k.anchor("center")
                ])
    
                scoreBtn.onClick(()=>{
                    k.play("select")
                    postScore()
                })
    
                scoreBtn.onHoverUpdate(()=>{
                    scoreBtn.scale=k.vec2(1.1)
                })
                scoreBtn.onHoverEnd(()=>{
                    scoreBtn.scale=k.vec2(1)
                })
            }
            
            k.add([
                k.sprite("fox",{anim:"idle"}),
                k.pos(k.rand(k.width()),k.rand(k.height())),
                k.anchor("center"),
                "fox"
            ])
            k.add([
                k.sprite("slime",{anim:"idle"}),
                k.pos(k.rand(k.width()),k.rand(k.height())),
                k.anchor("center"),
                "slime"
            ])
            k.add([
                k.sprite("coin",{anim:"idle"}),
                k.pos(k.rand(k.width()),k.rand(k.height())),
                k.anchor("center"),
                "coin"
            ])
            k.add([
                k.sprite("stone"),
                k.pos(k.rand(k.width()),k.rand(k.height())),
                k.anchor("center"),
                "stone"
            ])

            k.loop(2,()=>{
                let fox = k.get("fox")[0]
                let slime = k.get("slime")[0]
                let coin = k.get("coin")[0]
                let stone = k.get("stone")[0]
                fox.moveTo(k.rand(k.width()),k.rand(k.height()))
                slime.moveTo(k.rand(k.width()),k.rand(k.height()))
                stone.moveTo(k.rand(k.width()),k.rand(k.height()))
                coin.moveTo(k.rand(k.width()),k.rand(k.height()))
            })

        })

        //Game Scene
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
                    k.sprite("grass",{frame:~~k.rand(0,3),flipX:~~k.rand()}),
                    k.tile(),
                    k.pos(100,6)
                ]
            }
        })

        const levels=[
            [
                " &&&&&&&&&&&",
                " & !     ?¤&",
                " &&&  &&&&&&",
                " &    ?? &@&",
                " &$&&&&&&& &",
                " &         &",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " & ! &  ¤  &",
                " &   & @  ?&",
                " &   &&   &&",
                " &         &",
                " &  ?? &$  &",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " &¤       @&",
                " &&-&&&&&&&&",
                " && $&!+ -?&",
                " &&+&&&&& &&",
                " &         &",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " & !       &",
                " &&++-++&&&&",
                " &+-++-++¤&&",
                " &?-+-$--&&&",
                " &&&&     @&",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " & !  +-+? &",
                " &&&##&&&&&&",
                " &         &",
                " &¤  &#    &",
                " &  ??$&  @&",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " &    #   &&",
                " & !  & &$ &",
                " &&&&&&#&&?&",
                " &??+   @&?&",
                " &-+- ¤    &",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " &!  -+    &",
                " &&?&&¤  &&&",
                " &&$  %#   &",
                " &@%   ??  &",
                " &&        &",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " &$   %   @&",
                " &&&  & ?  &",
                " &¤&&%&&&&&&",
                " &?+   ?#  &",
                " &+-      !&",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " &@   ?    &",
                " &&&      >&",
                " &<   !# &&&",
                " &  >&&?+-+&",
                " & $    +¤-&",
                " &&&&&&&&&&&"
            ],
            [
                " &&&&&&&&&&&",
                " &¤       @&",
                " && &&&&&&&&",
                " &? &$ #? !&",
                " & <&     >&",
                " && + <    &",
                " &&&&&&&&&&&"
            ]
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
                    k.area({scale:1}),
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
                "$":()=>[
                    k.sprite("key",{anim:"idle"}),
                    k.pos(68,38),
                    k.area({scale:1}),
                    k.anchor("center"),
                    "key"
                ],
                "-":()=>[
                    k.sprite("trap",{frame:0}),
                    k.pos(68,38),
                    k.area({scale:0.9}),
                    k.anchor("center"),
                    {active:false},
                    "trap"
                ],
                "+":()=>[
                    k.sprite("trap",{frame:4}),
                    k.pos(68,38),
                    k.area({scale:0.9}),
                    k.anchor("center"),
                    {active:true},
                    "trap"
                ],
                "!":()=>[
                    k.sprite("fox",{anim:"idle"}),
                    k.body(),
                    k.area({scale:1}),
                    k.anchor('center'),
                    k.tile(),
                    k.pos(68,38),
                    k.z(1),
                    "player"
                ]
            }
        })

        //Setting stepcount and text to scene at levels
        let stepCount = 0
        let text = []
        switch(levelIdx){
            case 0:
                stepCount=25
                text = [
                    "Hey there I'm gonna need your help to get back home",
                    "But first we need to get the apple to snack on at home",
                    "To score most points let's be efficient with the movement",
                    "The coins give extra points but having extra steps gives points too",
                    "Stepcount can be seen up left in the screen"
                ]
                break;
            case 1:
                stepCount=15
                text=[
                    "Nice going let's do that again remember try and be efficient",
                    "We got "+score+" points from the last place"
                ]
                break;
            case 2:
                stepCount=25
                text=[
                    "We got "+score+" points from the last place",
                    "There seems to be traps layed out around here",
                    "We can go through them when they are down",
                    "Stepping on them is sure to hurt"
                ]
                break;
            case 3:
                stepCount=20
                text=[
                    "We got "+score+" points from the last place",
                    "A lot more traps around here lets try to be smart here",
                    "Don't want to be full of holes by the time we get home"
                ]
                break;
            case 4:
                stepCount=20
                text=[
                    "We got "+score+" points from the last place",
                    "There seems to be some rocks on the way",
                    "We can try to push them to make a path to go through",
                    "But be careful not to block our path to home"
                ]
                break;
            case 5:
                stepCount=25
                text=[
                    "We got "+score+" points from the last place",
                    "Seems theres more rocks on the way",
                    "let's be clever about this"
                ]
                break;
            case 6:
                stepCount=35
                text=[
                    "We got "+score+" points from the last place",
                    "There seems to be some slimes in our way this time",
                    "Better not touch them it could be very bad for me",
                    "We'll use the rocks to clear our way from the slimes"
                ]
                break;
            case 7:
                stepCount=25
                text=[
                    "We got "+score+" points from the last place",
                    "More slimes",
                    "Good thing we got these rocks here"
                ]
                break;
            case 8:
                stepCount=25
                text=[
                    "We got "+score+" points from the last place",
                    "These slimes move around",
                    "Let's move around them or get rid of them with the rocks"
                ]
                break;
            case 9:
                stepCount=35
                text=[
                    "We got "+score+" points from the last place",
                    "We're on the last stretch",
                    "Time to settle home after this"
                ]
                break;
            default:
                stepCount=20
        }
        //If text make scene with character and text
        if(text.length>0){
            const fox = k.add([
                k.sprite("fox"),
                k.pos(0,250),
                k.scale(4)
            ])
            const speechBuble = k.add([
                k.rect(500,100),
                k.pos(250,350),
                k.color(0,0,0),
                k.area()
            ])
            let monolog = 0
            const txt = speechBuble.add([
                k.pos(10,0),
                k.text("",{width:460,size:25}),
                k.color(255,165,0),
                k.area(),
                k.z(1)
            ])
            
            speechBuble.onClick(()=>{
                if(monolog<text.length-1){
                    k.play("select")
                    txt.text=""
                    monolog+=1
                    num=0
                    line=Array.from(text[monolog])
                    k.loop(0.2,()=>{
                        if(line.length>num){
                            k.play("voice")
                            txt.text+=line[num]
                            num++
                        }
                        else{
                            k.loop().cancel()
                        }
                    })
                }
                else{
                    k.play("select")
                    line=""
                    k.destroy(speechBuble)
                    k.destroy(fox)
                    k.loop().cancel()
                }
            })
            const btn = speechBuble.add([
                k.rect(25,26),
                k.color(255,0,0),
                k.pos(473,2),
                k.area()
            ])
            btn.add([
                k.text("X",{width:5}),
                k.anchor("center"),
                k.color(0,0,0),
                k.pos(5,-2)
            ])
            btn.onClick(()=>{
                k.play("select")
                k.loop().cancel()
                line=""
                k.destroy(speechBuble)
                k.destroy(fox)
            })

            let line = Array.from(text[monolog])
            let num=0
            k.loop(0.2,()=>{
                if(line.length>num){
                    k.play("voice")
                    txt.text+=line[num]
                    num++
                }
                else{
                    k.loop().cancel()
                }
            })
        }

        //Set stepcount for player to see
        const steps = k.add([
            k.circle(40),
            k.pos(50,40),
            k.color(255,165,0),
            k.z(2)
        ])
        steps.add([
            k.circle(35),
            k.color(0,0,0),
            k.z(0)
        ])
        const stepText = steps.add([
            k.pos(0,3),
            k.text(stepCount,{size:50}),
            k.anchor("center"),
            k.color(255,165,0)
        ])

        //Set player character and level scores
        sessionStorage.setItem("score",score)
        const player = map.get("player")[0]
        let levelScore=0

        //Collision, destroy and check functions to do when collisions or other functions happen
        //Open goal when player collides with key
        player.onCollideUpdate("key",(key,col)=>{
            if(col.hasOverlap()){
                k.play("key"+k.randi(1,3))
                const goal = map.get("goal")[0]
                goal.open=true
                goal.play("open")
                k.destroy(key)
            }
        })

        //Add steps to stepcount when player collides with apple
        player.onCollideUpdate("apple",(apple,col)=>{
            if(col.hasOverlap()){
                k.play("apple")
                stepCount+=6
                stepText.text=stepCount
                k.destroy(apple)
            }
        })

        //Add points when player collides with coin
        player.onCollideUpdate("coin",(coin,col)=>{
            if(col.hasOverlap()){
                k.play("coin"+k.randi(1,3))
                levelScore+=200
                k.destroy(coin) 
            }
        })

        //Destroy coin if stone collides with it
        k.onCollideUpdate("coin","stone",(coin,stone,col)=>{
            if(col.hasOverlap()){
                k.destroy(coin)
            }
        })

        //Destroy apple if stone collides with it
        k.onCollideUpdate("apple","stone",(apple,stone,col)=>{
            if(col.hasOverlap()){
                k.destroy(apple)
            }
        })

        //Destroy key if stone collides with it
        k.onCollideUpdate("key","stone",(key,stone,col)=>{
            if(col.hasOverlap()){
                k.destroy("key")
            }
        })

        //On key destroy restart level
        k.onDestroy("key",()=>{
            const goal = map.get("goal")[0]
            if(!goal.open){
                k.go("game",levelIdx,score)
            }
        })

        player.onCollide("trap",(trap,col)=>{
            if(col.hasOverlap()){
                if(trap.active){
                    stepCount--
                    stepText.text=stepCount
                }
            }
        })

        //Change level and add points when player collides with goal
        player.onCollideUpdate("goal",(goal,col)=>{
            if(goal.open){
                if(col.hasOverlap()){
                    if(levelIdx+1 < levels.length){
                        k.play("stage")
                        const nextLevel = levelIdx+1
                        sessionStorage.setItem("levelIdx",nextLevel)
                        levelScore+=stepCount*50
                        k.go("game",nextLevel,score+levelScore)
                    }else{
                        k.play("stage")
                        levelScore+=stepCount*50
                        k.go("win",score+levelScore)
                    }
                }
            }
        })

        //If stepcount lower than 0, restart level
        k.onUpdate(()=>{
            if(stepCount<0){
                k.go("game",levelIdx,score)
            }
        })

        //Destroy player when collide with enemy
        player.onCollideUpdate("enemy",(enemy,col)=>{
            if(col.target.is("enemy")){
                if(col.hasOverlap()){
                    k.destroy(player)
                }
            }
        })

        //On player destroy restart level
        k.onDestroy("player",()=>{
            k.go("game",levelIdx,score)
        })

        //Destroy enemy when collide with stone
        k.onCollideUpdate("stone","enemy",(stone,enemy,col)=>{
            if(col.hasOverlap()){
                if(enemy.alive){
                    levelScore+=100
                    enemy.alive=false
                    k.play("enemy"+k.randi(1,3))
                    enemy.play("death")
                }
                k.wait(1,()=>{
                    k.destroy(enemy)
                })
            }
        })

        //Change trap active with player steps
        function trapActive(){
            for(const trap of map.get("trap")){
                if(trap.active){
                    trap.active=false
                    trap.play("down")
                }
                else{
                    trap.active=true
                    trap.play("up")
                }
            }
        }

        //Player collision check with other objects
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
                                k.play("stone"+k.randi(1,3))
                                object.moveTo(object.pos.x-64,object.pos.y)
                                stop=false
                            }
                        }if(move==="right" && x<0 && y===0){
                            if(checkStone(move,object)){
                                stop=true
                            }else{
                                k.play("stone"+k.randi(1,3))
                                object.moveTo(object.pos.x+64,object.pos.y)
                                stop=false
                            }
                        }if(move==="up" && x===0 && y>0){
                            if(checkStone(move,object)){
                                stop=true
                            }else{
                                k.play("stone"+k.randi(1,3))
                                object.moveTo(object.pos.x,object.pos.y-64)
                                stop=false
                            }
                        }if(move==="down" && x===0 && y<0){
                            if(checkStone(move,object)){
                                stop=true
                            }else{
                                k.play("stone"+k.randi(1,3))
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

        //Movable objects collision checking with other objects
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
                    if(object.is("stone")){
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
                    if(object.is("goal")){
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

        //Function to control enemy movement
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
                    if(object.is("goal")){
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


        //Movement functions
        k.onKeyPress("right",()=>{
            player.flipX=false
            if(checkCol("right")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x+64,player.pos.y)
                k.play("walk"+k.randi(1,3))
                if(map.get("enemy").length>0){
                    enemyMove()
                }
                if(map.get("trap").length>0){
                    trapActive()
                }
            }
        })
        k.onKeyPress("d",()=>{
            player.flipX=false
            if(checkCol("right")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x+64,player.pos.y)
                k.play("walk"+k.randi(1,3))
                if(map.get("enemy").length>0){
                    enemyMove()
                }
                if(map.get("trap").length>0){
                    trapActive()
                }
            }
        })

        k.onKeyPress("left",()=>{
            player.flipX=true
            if(checkCol("left")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x-64,player.pos.y)
                k.play("walk"+k.randi(1,3))
                if(map.get("enemy").length>0){
                    enemyMove()
                }
                if(map.get("trap").length>0){
                    trapActive()
                }
            }
        })
        k.onKeyPress("a",()=>{
            player.flipX=true
            if(checkCol("left")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x-64,player.pos.y)
                k.play("walk"+k.randi(1,3))
                if(map.get("enemy").length>0){
                    enemyMove()
                }
                if(map.get("trap").length>0){
                    trapActive()
                }
            }
        })

        k.onKeyPress("up",()=>{
            if(checkCol("up")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x,player.pos.y-64)
                k.play("walk"+k.randi(1,3))
                if(map.get("enemy").length>0){
                    enemyMove()
                }
                if(map.get("trap").length>0){
                    trapActive()
                }
            }
        })
        k.onKeyPress("w",()=>{
            if(checkCol("up")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x,player.pos.y-64)
                k.play("walk"+k.randi(1,3))
                if(map.get("enemy").length>0){
                    enemyMove()
                }
                if(map.get("trap").length>0){
                    trapActive()
                }
            }
        })

        k.onKeyPress("down",()=>{
            if(checkCol("down")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x,player.pos.y+64)
                k.play("walk"+k.randi(1,3))
                if(map.get("enemy").length>0){
                    enemyMove()
                }
                if(map.get("trap").length>0){
                    trapActive()
                }
            }
        })
        k.onKeyPress("s",()=>{
            if(checkCol("down")){
                stepCount--
                stepText.text=stepCount
                player.moveTo(player.pos.x,player.pos.y+64)
                k.play("walk"+k.randi(1,3))
                if(map.get("enemy").length>0){
                    enemyMove()
                }
                if(map.get("trap").length>0){
                    trapActive()
                }
            }
        })


        k.debug.inspect=true
    })

    //Starting game or going back to scene
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