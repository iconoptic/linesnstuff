let linePoints : number[][] = []
let fillArea : boolean[][] = []
let slope: number, intercept: number

function reset () {
    basic.clearScreen()
    linePoints[0] = findPoints()
    led.plot(linePoints[0][0], linePoints[0][1])
    linePoints[1] = findPoints()
    led.plot(linePoints[1][0], linePoints[1][1])
    slope = (linePoints[1][1] - linePoints[0][1])/(linePoints[1][0] - linePoints[0][0])
    intercept = linePoints[1][1] - slope*linePoints[1][0]
    findFill()
    basic.pause(1000)
}

function findPoints () : number[] {
    let coord : number[] = [randint(0,4), randint(0,4)];
    if (led.point(coord[0], coord[1])) coord = findPoints()
    return coord
}

function findFill () {
    for (let i = 0; i < 5; i++) {
        fillArea[i] = []
        for (let j = 0; j < 5; j++) {
            fillArea[i][j] = false
        }
    }
    if (slope == Infinity || slope == -Infinity) {
        for (let i = linePoints[0][0]+1; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                fillArea[i][j] = true
            }
        }
    } else if (slope == 0) {
        for (let i = 0; i < 5; i++) {
            for (let j = linePoints[0][1]+1; j < 5; j++) {
                fillArea[i][j] = true
            }
        }
    } else {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if ((j > ((slope*i)+intercept))) fillArea[i][j] = true
            }
        }
    }
}

function isFilled () : boolean {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (fillArea[i][j] && !led.point(i, j)) return false
        }
    }
    return true
}

input.onButtonPressed(Button.A, function () {
    reset()
})

reset()

basic.forever(function () {
    if (!isFilled()) {
        let newPoint: number[] = findPoints()
        if (fillArea[newPoint[0]][newPoint[1]]) led.plot(newPoint[0], newPoint[1])
    } else {
        led.unplot(linePoints[0][0], linePoints[0][1])
        led.unplot(linePoints[1][0], linePoints[1][1])
        basic.pause(250)
        led.plot(linePoints[0][0], linePoints[0][1])
        led.plot(linePoints[1][0], linePoints[1][1])
        basic.pause(250)
    } 
})
