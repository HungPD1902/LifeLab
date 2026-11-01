$ErrorActionPreference = 'Stop'
# Reuse the existing CDP transport. Start isolated Chrome on port 9228 first.
$helperSource = Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot 'camera-input.ps1')
. ([scriptblock]::Create($helperSource.Substring(0,$helperSource.IndexOf("`ntry {"))))
function Check-Screen($name,$expression) {
    if (-not (Eval-Js $expression)) { throw $name }
    Write-Output ('PASS '+$name)
}
function Wait-Page {
    Start-Sleep -Milliseconds 150
    for ($attempt=0;$attempt -lt 50;$attempt++) {
        if (Eval-Js 'document.readyState==="complete"&&!!window.LearningApp') { return }
        Start-Sleep -Milliseconds 100
    }
    throw 'Learning app did not load'
}
function Click-Learn($selector) {
    $encoded = $selector | ConvertTo-Json -Compress
    $null = Eval-Js "document.querySelector($encoded).click()"
}
try {
    $null = Eval-Js 'localStorage.removeItem("safe-kitchen-v1");localStorage.removeItem("safe-kitchen-course-v1");history.replaceState(null,"","#library")'
    $null = Send-Cdp 'Page.reload' @{}
    Wait-Page
    Check-Screen 'library opens first and pauses gameplay' 'state==="hub"&&!$("learning-app").hidden&&$("game-screen").hidden&&remaining===120&&document.querySelectorAll(".learn-category").length===4'
    Check-Screen 'hidden game dialog cannot trap keyboard focus' '!$("overlay").children.length'
    $null = Eval-Js 'lastTick=performance.now()-10000;tick()'
    Check-Screen 'browsing the library never spends game time' 'remaining===120&&gameElapsed===0'
    Click-Learn '.learn-category[data-route="safety"]'
    Check-Screen 'safety screen has real skill and upcoming skills' 'document.querySelectorAll(".learn-skill").length===4&&document.querySelectorAll("[data-coming]").length===3'
    $null = Eval-Js 'history.back();new Promise(resolve=>setTimeout(resolve,80))'
    Check-Screen 'browser back returns to the library' 'document.querySelectorAll(".learn-category").length===4'
    $null = Eval-Js 'history.forward();new Promise(resolve=>setTimeout(resolve,80))'
    Check-Screen 'browser forward restores the safety screen' 'document.querySelectorAll(".learn-skill").length===4'
    Click-Learn '[data-action="search"]'
    $null = Eval-Js '$("skill-query").value="chay";$("skill-query").dispatchEvent(new Event("input",{bubbles:true}))'
    Check-Screen 'search matches Vietnamese without accents' 'document.querySelectorAll(".learn-skill:not([hidden])").length===1'
    Click-Learn '.learn-skill[data-route="fire"]'
    Check-Screen 'four lessons unlock in sequence' 'document.querySelectorAll(".learn-lesson-row").length===4&&document.querySelectorAll(".learn-lesson-row:disabled").length===3'
    Click-Learn '[data-action="bookmark"]'
    Check-Screen 'bookmark is stored' 'JSON.parse(localStorage.getItem("safe-kitchen-course-v1")).bookmarked'
    Click-Learn '[data-action="start-lesson"]'
    for ($i=0;$i -lt 3;$i++) { Click-Learn '[data-action="reading-next"]' }
    Check-Screen 'reading all hazard cards completes lesson one' 'JSON.parse(localStorage.getItem("safe-kitchen-course-v1")).completed.includes(1)&&document.querySelectorAll(".learn-lesson-row:disabled").length===2'
    Click-Learn '[data-action="start-lesson"]'
    for ($i=0;$i -lt 3;$i++) { Click-Learn '[data-action="reading-next"]' }
    Check-Screen 'escape lesson opens the kitchen lesson' 'JSON.parse(localStorage.getItem("safe-kitchen-course-v1")).completed.includes(2)&&!document.querySelector("[data-lesson=\"3\"]").disabled'
    Click-Learn '[data-action="start-lesson"]'
    Check-Screen 'briefing uses the actual game duration' 'location.hash==="#briefing"&&$("learning-app").textContent.includes("2 phút")'
    Click-Learn '[data-action="play-game"]'
    Check-Screen 'briefing starts playable kitchen' 'state==="search"&&$("learning-app").hidden&&!$("game-screen").hidden&&remaining>119'
    $null = Eval-Js 'lastTick=performance.now()-5000;tick();$("objects").querySelector("[data-id=obj-2404]").click();$("objects").querySelector("[data-id=obj-2404]").click()'
    for ($i=0;$i -lt 3;$i++) { $null = Eval-Js ('discover(CONFIG.hazards[{0}]);document.getElementById("skip-lesson").click()' -f $i) }
    Check-Screen 'result counts repeated mistakes and actual score' 'location.hash==="#results"&&document.querySelector(".learn-score").textContent==="80"&&resultData.mistakes===2&&resultData.elapsed>=5&&resultData.elapsed<10'
    Check-Screen 'winning unlocks the final quiz' 'JSON.parse(localStorage.getItem("safe-kitchen-course-v1")).completed.includes(3)'
    foreach ($size in @(@(390,844),@(320,568),@(844,390))) {
        $null = Send-Cdp 'Emulation.setDeviceMetricsOverride' @{width=$size[0];height=$size[1];deviceScaleFactor=1;mobile=$true}
        Check-Screen ('result actions fit '+$size[0]+'x'+$size[1]) 'document.documentElement.scrollWidth<=innerWidth&&$("learning-app").scrollWidth<=$("learning-app").clientWidth+1&&document.querySelector(".learn-actions").getBoundingClientRect().bottom<=innerHeight'
    }
    $null = Send-Cdp 'Emulation.clearDeviceMetricsOverride' @{}
    Click-Learn '[data-action="result-review"]'
    Check-Screen 'review includes discovered dangers and mistaken objects' '$("learning-app").textContent.includes("Dây điện")&&$("learning-app").textContent.includes("Chậu cây")'
    Click-Learn '[data-action="back-results"]'
    Click-Learn '[data-action="result-next"]'
    $quizChoices = @(1,1,1,0,1)
    foreach ($choice in $quizChoices) {
        Click-Learn ('[data-answer="'+$choice+'"]')
        Check-Screen 'quiz gives feedback before continuing' '!!document.querySelector(".learn-feedback")&&document.querySelectorAll("[data-answer]:disabled").length===2'
        Click-Learn '[data-action="quiz-next"]'
    }
    Check-Screen '80 percent quiz completes the four-lesson skill' 'document.querySelector(".learn-score").textContent==="80"&&JSON.parse(localStorage.getItem("safe-kitchen-course-v1")).completed.length===4&&profile.skillXp===16'
    Click-Learn '[data-action="result-replay"]'
    foreach ($choice in @(0,1,1,0,1)) { Click-Learn ('[data-answer="'+$choice+'"]'); Click-Learn '[data-action="quiz-next"]' }
    Check-Screen 'improving quiz grants only the reward difference' 'profile.skillXp===20&&$("learning-app").textContent.includes("+4 EXP")'
    Click-Learn '[data-action="result-replay"]'
    foreach ($choice in @(0,1,1,0,1)) { Click-Learn ('[data-answer="'+$choice+'"]'); Click-Learn '[data-action="quiz-next"]' }
    Check-Screen 'revisiting and replaying cannot duplicate quiz EXP' 'profile.skillXp===20&&$("learning-app").textContent.includes("+0 EXP")'
    $null = Send-Cdp 'Page.reload' @{}
    Wait-Page
    Check-Screen 'lesson progress survives reload' 'JSON.parse(localStorage.getItem("safe-kitchen-course-v1")).completed.length===4'
    $null = Eval-Js 'LearningApp.navigate("saved")'
    Check-Screen 'saved screen retains the bookmarked skill' '!!document.querySelector(".learn-skill[data-route=fire]")'
    $null = Eval-Js 'LearningApp.navigate("fire")'
    Check-Screen 'reloaded detail displays completed lessons' 'document.querySelectorAll(".learn-lesson-row.done").length===4'
    foreach ($size in @(@(390,844),@(320,568),@(844,390))) {
        $null = Send-Cdp 'Emulation.setDeviceMetricsOverride' @{width=$size[0];height=$size[1];deviceScaleFactor=1;mobile=$true}
        foreach ($screen in @('library','safety','fire','briefing','home','saved','profile')) {
            $encoded = $screen | ConvertTo-Json -Compress
            $null = Eval-Js "LearningApp.navigate($encoded)"
            Check-Screen ('layout fits '+$screen+' '+$size[0]+'x'+$size[1]) 'document.documentElement.scrollWidth<=innerWidth&&$("learning-app").scrollWidth<=$("learning-app").clientWidth+1&&document.querySelector(".learn-content").clientHeight>40'
        }
    }
    $null = Send-Cdp 'Emulation.clearDeviceMetricsOverride' @{}
    $null = Eval-Js 'localStorage.setItem("safe-kitchen-course-v1",JSON.stringify({completed:[1,2,3]}));history.replaceState(null,"","#fire")'
    $null = Send-Cdp 'Page.reload' @{}
    Wait-Page
    Click-Learn '[data-action="start-lesson"]'
    foreach ($choice in @(1,0,0,1,0)) { Click-Learn ('[data-answer="'+$choice+'"]'); Click-Learn '[data-action="quiz-next"]' }
    Check-Screen 'failed quiz does not complete the skill' 'document.querySelector(".learn-score").textContent==="0"&&!JSON.parse(localStorage.getItem("safe-kitchen-course-v1")).completed.includes(4)'
    Click-Learn '[data-action="result-next"]'
    Check-Screen 'failed quiz can be retried from question one' 'location.hash==="#quiz"&&document.querySelectorAll("[data-answer]:not(:disabled)").length===2'
    $null = Eval-Js 'localStorage.setItem("safe-kitchen-course-v1",JSON.stringify({completed:[1,2]}));history.replaceState(null,"","#fire")'
    $null = Send-Cdp 'Page.reload' @{}
    Wait-Page
    $null = Eval-Js 'LearningApp.startGame();remaining=1;$("objects").querySelector("[data-id=obj-2404]").click()'
    Check-Screen 'timeout shows result and retry opens briefing' 'state==="result"&&!resultData.won&&document.querySelector(".learn-score").textContent==="0"'
    Check-Screen 'timeout cannot unlock the final lesson' '!JSON.parse(localStorage.getItem("safe-kitchen-course-v1")).completed.includes(3)'
    Click-Learn '[data-action="result-next"]'
    Check-Screen 'retry has working start button' 'location.hash==="#briefing"&&!!document.querySelector("[data-action=play-game]")'
    Write-Output 'ALL SCREEN CHECKS PASSED'
} finally {
    $socket.Dispose()
}
