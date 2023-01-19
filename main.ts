function 자동좌회전 () {
    DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBL, Color.BLUE)
    DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CCW, 60)
    DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CW, 60)
    basic.pause(50)
}
function 자동우회전 () {
    DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBR, Color.BLUE)
    DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CCW, 60)
    DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CW, 60)
    basic.pause(50)
}
function stopspeed () {
    자동상황 = 0
    DFRobotMaqueenPlus.mototStop(Motors.ALL)
}
function 이미지인식 () {
    if (1 <= 인식된값 && 인식된값 <= 8) {
        if (체크 == 0) {
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.CYAN)
            if (자동상황 == 1) {
                체크 = 1
                DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.WHITH)
                radio.sendValue("" + player + "ajum", 인식된값)
            } else {
                체크 = 1
                radio.sendValue("" + player + "jum", 인식된값)
            }
        }
    } else {
        체크 = 0
        DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.OFF)
    }
}
function info () {
    huskylens.request()
    거리 = DFRobotMaqueenPlus.ultraSonic(PIN.P0, PIN.P1)
    huskylens.writeOSD(convertToText(거리), 15, 76)
    huskylens.writeOSD(convertToText(DFRobotMaqueenPlus.readSpeed(Motors1.M2)), 15, 122)
    인식된값 = huskylens.readBox_s(Content3.ID)
    huskylens.writeOSD(convertToText(인식된값), 270, 108)
}
input.onButtonPressed(Button.AB, function () {
    reset()
})
function 자율주행 () {
    if (DFRobotMaqueenPlus.readSpeed(Motors1.M1) < 50 || DFRobotMaqueenPlus.readSpeed(Motors1.M2) < 50) {
        DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.PINK)
        DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CCW, 속도)
        basic.pause(600)
        DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CW, 속도)
        DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CCW, 속도)
        basic.pause(300)
        DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.OFF)
    }
    if (수신값 == 2) {
        자동우회전()
        수신값 = 0
    } else if (수신값 == 4) {
        자동좌회전()
        수신값 = 0
    } else {
        if (거리 < 15) {
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.YELLOW)
            if (1 <= 회전횟수) {
                if (회전방향 == 1) {
                    자동좌회전()
                } else {
                    자동우회전()
                }
            } else {
                if (101 == randint(101, 102)) {
                    자동좌회전()
                    회전방향 = 1
                } else {
                    자동우회전()
                    회전방향 = 2
                }
            }
            회전횟수 += 1
        } else {
            회전횟수 = 0
            DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 속도)
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.GREEN)
        }
    }
}
radio.onReceivedValue(function (name, value) {
    if (name == "" + player + "auto") {
        if (value == 1) {
            자동상황 = 1
        } else if (value == 0) {
            stopspeed()
        }
    } else if (name == player) {
        수신값 = value
        if (value == 1) {
            DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 100)
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.GREEN)
        } else if (value == 3) {
            DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CCW, 100)
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.RED)
        } else if (value == 2) {
            DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CCW, 0)
            DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CCW, 100)
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBR, Color.GREEN)
        } else if (value == 4) {
            DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CCW, 100)
            DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CCW, 0)
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBL, Color.GREEN)
        } else if (value == 8) {
            for (let index = 0; index < 8; index++) {
                DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.RED)
                basic.pause(200)
                DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.OFF)
            }
        } else {
            DFRobotMaqueenPlus.mototStop(Motors.ALL)
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.OFF)
        }
    }
})
// player수정필요
function teamset () {
    radio.setGroup(3)
    player = "p3"
    basic.showNumber(3)
}
function reset () {
    자동상황 = 0
    회전횟수 = 0
    인식된값 = 0
    속도 = 65
    체크 = 0
    수신값 = 0
}
let 회전방향 = 0
let 회전횟수 = 0
let 수신값 = 0
let 속도 = 0
let 거리 = 0
let player = ""
let 체크 = 0
let 인식된값 = 0
let 자동상황 = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_TAG_RECOGNITION)
huskylens.clearOSD()
huskylens.writeOSD("d:", 0, 76)
teamset()
reset()
basic.forever(function () {
    info()
    이미지인식()
    if (자동상황 == 1) {
        자율주행()
    }
})
