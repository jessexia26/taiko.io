/**
 * Created by yuanyaoqi on 16/7/27.
 */

database = {
    '少年画像':[1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,1,0,2,0,1,0,1,0,1,0,2,0,1,0,1,0,2,0,2,0,1,0,2,0,2,0,2,0,1,0,2,0,1,0,1,0,2,0,2,0,3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0,3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0],
    '星之所向':[0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,3,0,0,0,0,0,0,4,4,3,4,0,0,2,4,0,0,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,1,0,2,0,1,0,1,0,1,0,2,0,1,0,1,0,2,0,2,0,1,0,2,0,2,0,2,0,1,0,2,0,1,0,1,0,2,0,2,0,3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0,3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0],
    '不会有时差':[0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,1,1,0,0,1,2,0,0,1,0,2,0,1,0,1,0,1,0,2,0,1,0,1,0,2,0,2,0,1,0,2,0,2,0,2,0,1,0,2,0,1,0,1,0,2,0,2,0,3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0,3,0,3,0,1,0,2,0,1,2,1,0,1,2,1,0,4,0,4,0,1,0,2,0,2,1,2,0,2,1,2,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0],
}
var username;
var taikoList = []; // 鼓点数组
// 鼓点类型常量
const RED_SMALL = 1;
const BLUE_SMALL = 2;
const RED_LARGE = 3;
const BLUE_LARGE = 4;

// 鼓点数值列表
var taikoValueList = updateSongText('少年画像');

// 鼓点次序
var taikoValueOrder = 0;
var scoreNumber = 0; // 分数
var taikoCreat, taikoMove;
var dancerList = [];
var taikoEnd = false;

var bgTravel = document.getElementById("bg_travel");
var songName = "少年画像";
var scoreRecord = {
    "username":null,
    "score": 0,
    "song":songName
};

// 页面加载后播放背景音乐
window.onload = function() {
    // updateOrientation();
    bgTravel.addEventListener('ended', function() {
        // 检查 taikoEnd 是否为 true
        if (taikoEnd === true) {
            // 调用 gameEnd 函数
            gameEnd();
        }
    }, false);
};
// 开始游戏
function gameStart() {
    username = document.getElementById("username").value;
    if (username == "") {
        document.getElementById("startBox").getElementsByTagName("h4")[0].innerHTML = "请输入用户名";
    } else {
        document.getElementById("startBox").style.display = "none";
        document.getElementById("ruleBox").style.display = "block";
    }
}

// 游戏玩法
function gamePlay(songParsed = '少年画像') {
    document.getElementById("ruleBox").style.display = "none";
    document.getElementById("startBox").style.display = "none";
    document.getElementById("endBox").style.display = "none";
    document.getElementById("taikoBox").style.display = "block";
    // 清除之前的状态
    taikoList = [];
    dancerList = [];
    taikoValueOrder = 0;
    clearInterval(taikoCreat);
    clearInterval(taikoMove);
    scoreNumber = 0;
    stopBgTravel();

    document.getElementById("scoreBoard").innerHTML = scoreNumber;
    document.getElementById("pauseChoice").style.display = "none";
    // 
    updateBgTravel(songParsed);
    scoreRecord = {
        "username":null,
        "score": 0,
        "song":songParsed
    };
    songName = songParsed;
    taikoValueList = updateSongText(songParsed);
    // 背景音乐
    document.getElementById("bgmusic").pause();
    document.getElementById("endmusic").pause();
    document.getElementById("gamestart").play();
    setTimeout(function() {
        bgTravel.currentTime = 0;
        bgTravel.play();
    }, 1000);

    // 太鼓鼓点生成和移动
    var roadCtx = document.getElementById("roadCtx").getContext("2d");
    var taikoComb = document.getElementById("taikoComb");
    setTimeout(function() {
        taikoCreat = setInterval(function() {
            creatTaiko(roadCtx, taikoComb);
        }, 60000 / 138);
        taikoMove = setInterval(function() {
            taikoListMove(roadCtx);
        }, 1);
    }, 770);
}

// 暂停游戏
function gamePause() {
    clearInterval(taikoCreat);
    clearInterval(taikoMove);
    bgTravel.pause();
    document.getElementById("pauseChoice").style.display = "block";
}

// 继续游戏
function gameContinue() {
    document.getElementById("pauseChoice").style.display = "none";
    var roadCtx = document.getElementById("roadCtx").getContext("2d");
    var taikoComb = document.getElementById("taikoComb");
    taikoCreat = setInterval(function() {
        creatTaiko(roadCtx, taikoComb);
    }, 60000 / 138);
    taikoMove = setInterval(function() {
        taikoListMove(roadCtx);
    }, 1);
    bgTravel.play();
}

// 模拟键盘按键
function simulateKeyPress(keyCode) {
    var event = new KeyboardEvent('keydown', {
        keyCode: keyCode,
        which: keyCode
    });
    document.dispatchEvent(event);
}

// 处理键盘事件
document.onkeydown = function(event) {
    var taikored = document.getElementsByClassName("taikoRed");
    var taikoblue = document.getElementsByClassName("taikoBlue");
    var dong = document.getElementById("dongmusic");
    var ka = document.getElementById("kamusic");

    var key = event.keyCode;
    if (key == 67) { // C键
        imgDisplay(taikoblue[0]);
        ka.currentTime = 0;
        ka.play();
        taikoCheck("Blue");
    } else if (key == 86) { // V键
        imgDisplay(taikored[0]);
        dong.currentTime = 0;
        dong.play();
        taikoCheck("Red");
    } else if (key == 66) { // B键
        imgDisplay(taikored[1]);
        dong.currentTime = 0;
        dong.play();
        taikoCheck("Red");
    } else if (key == 78) { // N键
        imgDisplay(taikoblue[1]);
        ka.currentTime = 0;
        ka.play();
        taikoCheck("Blue");
    }
};

document.onkeyup = function(event) {
    var taikored = document.getElementsByClassName("taikoRed");
    var taikoblue = document.getElementsByClassName("taikoBlue");

    var key = event.keyCode;
    if (key == 67) {
        imgDisAppear(taikoblue[0]);
    } else if (key == 86) {
        imgDisAppear(taikored[0]);
    } else if (key == 66) {
        imgDisAppear(taikored[1]);
    } else if (key == 78) {
        imgDisAppear(taikoblue[1]);
    }
};

// 创建太鼓鼓点
function creatTaiko(ctx, imgnode) {
    var newTaiko;
    if (taikoValueOrder >= taikoValueList.length) {
        clearInterval(taikoCreat);
        return;
    }
    if (taikoValueList[taikoValueOrder] == 0) {
        taikoValueOrder++;
        return;
    }
    if (taikoValueList[taikoValueOrder] == 1) {
        newTaiko = new taikoPrototype(ctx, imgnode, 1, 18, "咚~~");
    }
    if (taikoValueList[taikoValueOrder] == 2) {
        newTaiko = new taikoPrototype(ctx, imgnode, 2, 18, "咔~~");
    }
    if (taikoValueList[taikoValueOrder] == 3) {
        newTaiko = new taikoPrototype(ctx, imgnode, 3, 8, "咚(大)~");
    }
    if (taikoValueList[taikoValueOrder] == 4) {
        newTaiko = new taikoPrototype(ctx, imgnode, 4, 8, "咔(大)~");
    }
    taikoList.push(newTaiko);
    taikoValueOrder++;
}

// 太鼓鼓点对象
function taikoPrototype(ctx, imgnode, value, drawY, text) {
    switch (value) {
        case 1:
            this.color = "Red";
            this.size = "Small";
            this.drawW = 50;
            break;
        case 2:
            this.color = "Blue";
            this.size = "Small";
            this.drawW = 50;
            break;
        case 3:
            this.color = "Red";
            this.size = "Big";
            this.drawW = 70;
            break;
        case 4:
            this.color = "Blue";
            this.size = "Big";
            this.drawW = 70;
            break;
    }
    this.ctx = ctx;
    this.imgNode = imgnode;
    this.cutX = (value - 1) * 250;
    this.cutY = 0;
    this.cutW = 250;
    this.drawX = 645;
    this.drawY = drawY;
    this.speed = 1;
    this.draw = function() {
        this.ctx.beginPath();
        this.ctx.drawImage(this.imgNode, this.cutX, this.cutY, this.cutW, this.cutW, this.drawX, this.drawY, this.drawW, this.drawW);
        this.ctx.stroke();
        this.ctx.fillStyle = "white";
        this.ctx.font="30px Long Cang";
        this.ctx.fillText(text, this.drawX + this.drawW / 2 - 18, 113);
    }
    this.move = function() {
        this.drawX -= this.speed;
    }
}

// 鼓点移动
function taikoListMove(ctx) {
    ctx.clearRect(0, 0, 645, 120);
    for (var i = 0; i < taikoList.length; i++) {
        if (taikoList[i].drawX > -taikoList[i].drawW) {
            taikoList[i].draw();
            taikoList[i].move();
        } else {
            taikoList.splice(i, 1);
            i--; // 确保删除后不跳过下一个元素
        }
    }
    // 检查是否所有鼓点已经移出屏幕并且taikoValueList已经遍历完毕
    if (taikoList.length === 0 && taikoValueOrder >= taikoValueList.length) {
        taikoEnd = true;
    }
}

// 判定鼓点
function taikoCheck(taikovalue) {
    var taikocheckvalue = false; // 默认击中状态为false
    var scoreBoard = document.getElementById("scoreBoard");
    var taikosmile = document.getElementById("taikoSmile");
    var taikoCheckDistance;
    for (var i = 0; i < taikoList.length; i++) {
        if (taikoList[i].size == "Small") {
            taikoCheckDistance = 22; // 小鼓点的判断中心
        } else {
            taikoCheckDistance = 12; // 大鼓点的判断中心
        }
        // 判定是否为可
        if (taikoList[i].drawX > taikoCheckDistance - 50 && taikoList[i].drawX < taikoCheckDistance + 50 && taikoList[i].color == taikovalue) {
            taikocheckvalue = true; // 击中状态改变
            // 短暂消显示太鼓笑脸
            taikosmile.style.display = "block";
            setTimeout(function() {
                taikosmile.style.display = "none";
            }, 100);
            // 进阶判定是否为良
            if (taikoList[i].drawX > taikoCheckDistance - 30 && taikoList[i].drawX < taikoCheckDistance + 30) {
                judgement(0); // 显示judgement图案及文字
                scoreNumber += 100;
            } else {
                judgement(1);
                scoreNumber += 50;
            }
            taikoList.splice(i, 1); // 清除该鼓点
            scoreBoard.innerHTML = scoreNumber; // 更改分数
        }
    }
    if (!taikocheckvalue) {
        var judgementCtx = document.getElementById("judgementCtx").getContext("2d");
        var judgementText = document.getElementById("judgementText");
        judgementCtx.beginPath();
        judgementCtx.drawImage(judgementText, 0, 50, 63, 25, 12, 100, 76, 30);
        judgementCtx.stroke();
        setTimeout(function() {
            judgementCtx.clearRect(0, 0, 650, 250);
        }, 200);
    } // 未击中时 短暂显示"不可"
}

// 显示judgement图案及文字
function judgement(a) {
    // a=0时,显示"良"及黄色光环,a=1时,显示"可"及白色光环
    var i = 0; // 起始帧数为0
    var judgementCtx = document.getElementById("judgementCtx").getContext("2d");
    var judgementText = document.getElementById("judgementText");
    var judgementHalo = document.getElementById("judgementHalo");
    judgementDraw();

    function judgementDraw() {
        judgementCtx.clearRect(0, 0, 650, 250);
        judgementCtx.beginPath();
        judgementCtx.drawImage(judgementHalo, i * 140, a * 140, 140, 140, -19, 93, 140, 140);
        judgementCtx.stroke();
        judgementCtx.beginPath();
        judgementCtx.drawImage(judgementText, 0, a * 25, 63, 25, 12, 100, 76, 30);
        judgementCtx.stroke();
        i++;
        if (i < 4) {
            setTimeout(judgementDraw, 100); // 帧数小于4时,继续调用函数
        }
        if (i == 4) {
            judgementCtx.clearRect(0, 0, 650, 250); // 帧数等于4时,动画结束,清除画布
        }
    }
}

// 显示图片
function imgDisplay(img) {
    img.style.display = "block";
}

// 隐藏图片
function imgDisAppear(img) {
    img.style.display = "none";
}

// 游戏结束
function gameEnd() {
    clearInterval(taikoCreat);
    clearInterval(taikoMove);
    document.getElementById("taikoBox").style.display = "none";
    document.getElementById("endBox").style.display = "block";
    // 停止播放
    bgTravel.pause();
    bgTravel.currentTime = 0;
    document.getElementById("endmusic").play();
    queryScore();
}

// 保存用户分数
function saveScore() {
    scoreRecord["username"] = username;
    scoreRecord["song"] = songName;
    scoreRecord["score"] = scoreNumber;
}

// 获取排行榜
function queryScore() {
    saveScore();
    document.getElementById("user_name").textContent = "用户名:  " + scoreRecord["username"];
    document.getElementById("finalScore").textContent = "最后得分:  " + scoreRecord["score"];
    document.getElementById("songName").textContent = "歌曲名:  " + scoreRecord["song"];   
}

// 换歌
// Function to stop and reset bgTravel audio
function stopBgTravel() {
    if ((bgTravel.paused ==false)|| (bgTravel.currentTime!=0)){
        bgTravel.pause();
        bgTravel.currentTime = 0;
    }
}

// Function to update bgTravel with new audio file
function updateBgTravel(value) {
    console.log(value)
    bgTravel.src = './songs/' + value + '.mp3';
}

function updateSongText(value) {
    console.log(database[value])
    return database[value]
}

function changeSong(event) {
    var selectedOption = event.target.selectedOptions[0];
    var selectedValue = selectedOption.value;
    var selectedText = selectedOption.textContent;

    console.log('Selected value:', selectedValue);
    console.log('Selected text:', selectedText);
    return gamePlay(selectedText)
}

// Adding event listener to the select element
document.addEventListener('DOMContentLoaded', function () {
    var selectElement = document.getElementById('songSelect');
    selectElement.addEventListener('change', changeSong);
});



function isMobile() { 
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        if (window.screen.width < 900){
            return true;
        }
        else{
            return false;
        }

    }
    
  }

  function updateOrientation() {
    if (isMobile()) {
        if (window.innerHeight > window.innerWidth) {
            // Portrait mode on mobile
            document.getElementById('content').classList.remove('normal');
            document.getElementById('content').classList.add('landscape');
        } else {
            // Landscape mode on mobile
            document.getElementById('content').classList.remove('landscape');
            document.getElementById('content').classList.add('normal');
        }
    }
}
