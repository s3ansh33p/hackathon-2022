/* File: scripts.js
 * Author: Sean M
 * Date: 2022-10-16
 * Description: Scripts for the website (uses jQuery, Velocity.js, and Bootstrap)
 * License: MIT
 * Version: 1.0
 */

let speed = 1.5;
let percent = 1;
let intervalAnim, intervalTimer;
const startTime = 1668729600000 // new Date("2022 Nov 18 08:00:00").getTime(); precomputed
// const startTime = 1665878400000 // new Date("2022 Oct 16 08:00:00").getTime(); precomputed
const startWeb = 1665849600000 // new Date("2022 Oct 16 00:00:00").getTime(); precomputed

document.addEventListener("DOMContentLoaded", function() {
    initProgress();
    updateTimer();
    animateProgress();
});

function calculatePercent() {
    let percent = 1 - (Date.now() - startTime) / (startWeb - startTime);
    if (percent > 1) percent = 1;
    if (percent < 0) percent = 0;
    return percent;
}

function isIE(userAgent) {
    userAgent = userAgent || navigator.userAgent;
    return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
}

function initProgress() {
    let path = $('svg').find('path');
    let pathLength = path[0].getTotalLength();
    path.css({
        'stroke-dasharray': pathLength + ' ' + pathLength,
        'stroke-dashoffset': pathLength
    });
}

async function updateTimer() {
    $("#debug-t").text(`Debug: UpdateTimer()`);
    await new Promise(r => setTimeout(r, 200));
    let diff = Date.now() - startTime;
    if (diff > 0) {
        $("#days").text(0);
        $("#hours").text(0);
        $("#minutes").text(0);
        $("#seconds").text(0);
        clearInterval(intervalTimer);
    } else {
        diff = diff * -1;
        $("#days").text(Math.floor(diff / (86400000)));
        $("#hours").text(Math.floor(diff / (3600000) % 24));
        $("#minutes").text( Math.floor(diff / (60000) % 60));
        $("#seconds").text(Math.floor(diff / 1000 % 60));
    }
}

async function animateProgress() {
    await new Promise(r => setTimeout(r, 200));
    percent = calculatePercent();
    let path = $('svg').find('path');
    let pathLength = path[0].getTotalLength();

    if (!isIE()) {
        $('.path').velocity({
            'stroke-dashoffset': pathLength * (1 - percent)
        }, {
            duration: speed * 1000,
        });
    } else {
        let currentPathLength = pathLength;
        let requestAnimationFrameID = requestAnimationFrame(doAnim);

        function doAnim() {
            if (currentPathLength <= pathLength * (1 - percent)) {
                cancelAnimationFrame(requestAnimationFrameID);
                return;
            }

            $('.path').css({
                'stroke-dashoffset': currentPathLength
            });
            currentPathLength -= 2;
            requestAnimationFrameID = requestAnimationFrame(doAnim);
        }
    }
    if (percent == 1) {
        clearInterval(intervalAnim);
        return;
    }
}

intervalAnim = setInterval(animateProgress, 10000); // 10 seconds
intervalTimer = setInterval(updateTimer, 1000); // 1 second
console.log("Nothing to see here :)");
