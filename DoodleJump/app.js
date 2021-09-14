document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')    //a javascript method to pick elements from HTML
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let platformcount = 5
    let platforms = []       //empty array
    let upTimerId
    let downTimerId 
    let isGameOver = false  
    let isJumping = true
    let isGoingRight = false
    let isGoingLeft = false
    let leftTimerId
    let rightTimerId
    let score = 0

    class Platform {
        constructor(newplatformGap) {
            this.bottom = newplatformGap
            this.left = Math.random() * 315     //returns random no. from 0 to 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    // position the spaceship
    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    

    //multiple pltforms 
    function createPlatforms(){
        for (let i=0; i<platformcount; i++){
            let platformGap = 600 / platformcount
            let newplatformGap = 100 + i * platformGap
            let newPlatform = new Platform(newplatformGap)
            platforms.push(newPlatform) //each time of loop - pushes newly created platform into the array
            console.log(platforms)
        }
    }

    function movePlatforms () {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
            
                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatforms = new Platform(600)
                    platforms.push(newPlatforms)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'

            if (doodlerBottomSpace > startPoint + 200) {
                fall()
                isJumping = false
            }
        }, 20)
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function() {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0 ) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) 
                    && (doodlerBottomSpace <= platform.bottom + 15)
                    && ((doodlerLeftSpace + 60 ) >= platform.left) 
                    && (doodlerLeftSpace <= platform.left + 85)
                    && !isJumping
                ) {
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                    isJumping = true
                }
            })
        }, 20)
    }

    function gameOver() {
        console.log('game over')
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    // Hooking up Keyboard keys
    function control(e) {
        if (e.key === 'ArrowLeft') {
            //move left
            moveLeft()
        }
        else if (e.key === 'ArrowRight') {
            //move right
            moveRight()
        }
        else if (e.key === "ArrowUp") {
            //move Straight
            moveStraight()
        }
    }

    //Doodler moves left
    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()   
        },20)
    }

    //Doodler moves right
    function moveRight(){
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function () {
            if (doodlerLeftSpace <= 360) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        },20)
    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }



    function start(){
        if (!isGameOver){
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms,20)
            jump()
            document.addEventListener('keyup',control )
        }
    }

    //attach to button
    start()
})