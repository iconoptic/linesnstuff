let linePoints : number[][] = []
let slope: number, intercept: number
let counter: number

function reset () {
    basic.clearScreen()
    counter = 0
    linePoints[0] = findPoints()
    led.plot(linePoints[0][0], linePoints[0][1])
    linePoints[1] = findPoints()
    led.plot(linePoints[1][0], linePoints[1][1])
    slope = (linePoints[1][1] - linePoints[0][1])/(linePoints[1][0] - linePoints[0][0])
    intercept = ((linePoints[1][1]*1.0) - (slope*linePoints[1][0]))*1.0
    basic.pause(1000)
}

function findPoints () : number[] {
    let coord : number[] = [randint(0,4), randint(0,4)];
    if (led.point(coord[0], coord[1])) coord = findPoints()
    return coord
}

function compare (slope: number, intercept : number, coords : number[][], newPoint : number[]) : boolean {
    if ((slope == Infinity || slope == -Infinity) && newPoint[0] > coords[0][0]) {
        return true
    } else if (slope == 0 && newPoint[1] > coords[0][1] ){
        return true
    } else if (newPoint[1] > ((slope*newPoint[0]) + intercept)) {
        return true
    }
    return false
}

function checkFill (slope : number, intercept : number, coords : number[][]) : boolean {
    if (slope == Infinity || slope == -Infinity) {
        for (let i = coords[0][0]+1; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (!led.point(i, j)) return false
            }
        }
    } else if (slope == 0) {
        for (let i = 0; i < 5; i++) {
            for (let j = coords[0][1]+1; j < 5; j++) {
                if (!led.point(i, j)) return false
            }
        }
    } else {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if ((j > ((slope*i)+intercept)) && led.point(i, j)) return false
            }
        }
    }
    return true
}

input.onButtonPressed(Button.A, function () {
    reset()
})

reset()

basic.forever(function () {
    if (!checkFill(slope, intercept, linePoints)) {
        let newPoint: number[] = findPoints()
        if (compare(slope, intercept, linePoints, newPoint)) led.plot(newPoint[0], newPoint[1])
    } else {
        led.unplot(linePoints[0][0], linePoints[0][1])
        led.unplot(linePoints[1][0], linePoints[1][1])
        basic.pause(250)
        led.plot(linePoints[0][0], linePoints[0][1])
        led.plot(linePoints[1][0], linePoints[1][1])
        basic.pause(250)
    }
})
