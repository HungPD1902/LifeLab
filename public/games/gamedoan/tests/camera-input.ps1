$ErrorActionPreference = 'Stop'
$tabs = Invoke-RestMethod 'http://127.0.0.1:9228/json'
$tab = $tabs | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
$socket = New-Object System.Net.WebSockets.ClientWebSocket
$null = $socket.ConnectAsync([Uri]$tab.webSocketDebuggerUrl,[Threading.CancellationToken]::None).GetAwaiter().GetResult()
$script:messageId = 0
function Send-Cdp($method,$parameters) {
    $script:messageId++
    $payload = @{id=$script:messageId;method=$method;params=$parameters} | ConvertTo-Json -Depth 15 -Compress
    $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
    $socket.SendAsync([ArraySegment[byte]]::new($bytes),[Net.WebSockets.WebSocketMessageType]::Text,$true,[Threading.CancellationToken]::None).GetAwaiter().GetResult()
    do {
        $stream = New-Object IO.MemoryStream
        do {
            $buffer = New-Object byte[] 65536
            $received = $socket.ReceiveAsync([ArraySegment[byte]]::new($buffer),[Threading.CancellationToken]::None).GetAwaiter().GetResult()
            $stream.Write($buffer,0,$received.Count)
        } while (-not $received.EndOfMessage)
        $response = [Text.Encoding]::UTF8.GetString($stream.ToArray()) | ConvertFrom-Json
        $stream.Dispose()
    } while ($response.id -ne $script:messageId)
    if ($response.error) { throw ($response.error | ConvertTo-Json -Compress) }
    return $response.result
}
function Eval-Js($expression) {
    $answer = Send-Cdp 'Runtime.evaluate' @{expression=$expression;returnByValue=$true;awaitPromise=$true}
    if ($answer.exceptionDetails) { throw ($answer.exceptionDetails | ConvertTo-Json -Depth 8 -Compress) }
    return $answer.result.value
}
function Mouse($type,$x,$y,$button='none',$buttons=0) {
    $null = Send-Cdp 'Input.dispatchMouseEvent' @{type=$type;x=$x;y=$y;button=$button;buttons=$buttons;clickCount=1}
}
try {
    $null = Send-Cdp 'Page.reload' @{}
    for ($attempt=0;$attempt -lt 50;$attempt++) {
        if (Eval-Js 'document.readyState==="complete"&&typeof centerCamera==="function"') { break }
        Start-Sleep -Milliseconds 100
    }
    $null = Eval-Js 'clearLessonTimers();$("overlay").replaceChildren();setState("search");zoomRoom(true);centerCamera()'
    $rect = Eval-Js '(()=>{const r=$("camera").getBoundingClientRect();return {left:r.left,top:r.top,width:r.width,height:r.height}})()'
    $x = $rect.left + 2; $y = $rect.top + $rect.height * .3
    Mouse 'mouseMoved' $x $y
    Mouse 'mousePressed' $x $y 'left' 1
    Mouse 'mouseMoved' ($rect.left-25) $y 'none' 1
    Mouse 'mouseReleased' ($rect.left-25) $y 'left' 0
    $before = Eval-Js '$("camera").scrollLeft'
    Mouse 'mouseMoved' ($rect.left+$rect.width*.8) $y
    $after = Eval-Js '$("camera").scrollLeft'
    if ([Math]::Abs($after-$before) -gt 1 -or (Eval-Js 'cameraDrag!==null')) {throw 'Hover still moves camera after release outside'}
    Write-Output 'PASS release outside stops dragging; hover leaves camera still'
    $null = Eval-Js 'centerCamera()'
    $before = Eval-Js '$("camera").scrollLeft'
    $x = $rect.left + $rect.width * .65
    Mouse 'mouseMoved' $x $y
    Mouse 'mousePressed' $x $y 'left' 1
    Mouse 'mouseMoved' ($x-80) $y 'none' 1
    Mouse 'mouseReleased' ($x-80) $y 'left' 0
    $after = Eval-Js '$("camera").scrollLeft'
    if ([Math]::Abs($after-$before-80) -gt 2 -or (Eval-Js 'cameraDrag!==null')) {throw 'Intentional drag does not track mouse correctly'}
    if ((Eval-Js 'state') -ne 'search') {throw 'Dragging activated an object'}
    Write-Output 'PASS intentional drag tracks mouse without activating objects'
    Mouse 'mouseMoved' ($x+40) $y
    if ([Math]::Abs((Eval-Js '$("camera").scrollLeft')-$after) -gt 1) {throw 'Hover moves camera after normal drag'}
    Write-Output 'PASS hover after normal drag leaves camera still'
    $null = Eval-Js 'centerCamera()'
    $beforeTop = Eval-Js '$("camera").scrollTop'
    Mouse 'mouseMoved' $x $y
    Mouse 'mousePressed' $x $y 'left' 1
    Mouse 'mouseMoved' ($x-30) ($y-40) 'none' 1
    Mouse 'mouseReleased' ($x-30) ($y-40) 'left' 0
    $afterTop = Eval-Js '$("camera").scrollTop'
    if ([Math]::Abs($afterTop-$beforeTop-40) -gt 2 -or (Eval-Js 'cameraDrag!==null||state!=="search"')) {throw 'Diagonal drag does not pan vertically'}
    Write-Output 'PASS diagonal drag pans vertically without selecting objects'
    $null = Eval-Js 'centerCamera();found.clear();remaining=120'
    $target = Eval-Js '(()=>{const b=$("objects").querySelector("[data-id=wire]");b.scrollIntoView({block:"center",inline:"center"});const r=b.getBoundingClientRect();return {x:r.left+r.width*.65,y:r.top+r.height*.18}})()'
    Mouse 'mouseMoved' $target.x $target.y
    Mouse 'mousePressed' $target.x $target.y 'left' 1
    Mouse 'mouseReleased' $target.x $target.y 'left' 0
    if (-not (Eval-Js 'state==="lesson"&&found.has("wire")')) {throw 'Single click cannot select a hazard'}
    Write-Output 'PASS single click still selects hazard'
    $null = Eval-Js 'clearLessonTimers();$("overlay").replaceChildren();setState("search");found.clear();centerCamera()'
    Mouse 'mouseMoved' $target.x $target.y
    Mouse 'mousePressed' $target.x $target.y 'left' 1
    Mouse 'mouseMoved' ($target.x-50) $target.y 'none' 1
    Mouse 'mouseReleased' ($target.x-50) $target.y 'left' 0
    if (-not (Eval-Js 'state==="search"&&found.size===0')) {throw 'Dragging from a hazard accidentally selects it'}
    Write-Output 'PASS dragging from a hazard does not count as a tap'
    $null = Eval-Js 'centerCamera()'
    Mouse 'mouseMoved' $target.x $target.y
    Mouse 'mousePressed' $target.x $target.y 'left' 1
    Mouse 'mouseMoved' $target.x ($target.y-40) 'none' 1
    Mouse 'mouseReleased' $target.x ($target.y-40) 'left' 0
    if (-not (Eval-Js 'state==="search"&&found.size===0&&cameraDrag===null')) {throw 'Vertical drag from a hazard accidentally selects it'}
    Write-Output 'PASS vertical drag from a hazard does not count as a tap'
    $null = Send-Cdp 'Emulation.setDeviceMetricsOverride' @{width=390;height=844;deviceScaleFactor=1;mobile=$true}
    $null = Send-Cdp 'Emulation.setTouchEmulationEnabled' @{enabled=$true;maxTouchPoints=1}
    Start-Sleep -Milliseconds 150
    $null = Eval-Js 'centerCamera();window.nativePanStarted=false;$("camera").addEventListener("pointercancel",()=>{window.nativePanStarted=true},{once:true})'
    $touch = Eval-Js '(()=>{const r=$("camera").getBoundingClientRect();return {x:r.left+r.width*.5,y:r.top+r.height*.3,left:$("camera").scrollLeft,top:$("camera").scrollTop}})()'
    $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchStart';touchPoints=@(@{x=$touch.x;y=$touch.y;id=1})}
    # Native scrolling crosses the browser's touch slop and commits on frames.
    foreach ($distance in @(15,30,50,70)) {
        $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchMove';touchPoints=@(@{x=($touch.x-$distance);y=($touch.y-$distance);id=1})}
        Start-Sleep -Milliseconds 40
    }
    Start-Sleep -Milliseconds 100
    $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchEnd';touchPoints=@()}
    Start-Sleep -Milliseconds 100
    $after = Eval-Js '({left:$("camera").scrollLeft,top:$("camera").scrollTop,searching:state==="search",dragging:cameraDrag!==null})'
    if ($after.left-$touch.left -lt 40 -or $after.top-$touch.top -lt 40 -or -not $after.searching -or $after.dragging -or -not (Eval-Js 'nativePanStarted')) {throw 'Native touch swipe does not pan both axes'}
    Write-Output 'PASS native phone touch swipe pans both axes without selecting objects'
    foreach ($axis in @('x','y')) {
        $null = Eval-Js 'centerCamera()'
        $before = Eval-Js '({left:$("camera").scrollLeft,top:$("camera").scrollTop})'
        $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchStart';touchPoints=@(@{x=$touch.x;y=$touch.y;id=1})}
        foreach ($distance in @(15,30,50,70)) {
            $moveX = if ($axis -eq 'x') {$touch.x-$distance} else {$touch.x}
            $moveY = if ($axis -eq 'y') {$touch.y-$distance} else {$touch.y}
            $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchMove';touchPoints=@(@{x=$moveX;y=$moveY;id=1})}
            Start-Sleep -Milliseconds 40
        }
        Start-Sleep -Milliseconds 100
        $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchEnd';touchPoints=@()}
        Start-Sleep -Milliseconds 100
        $after = Eval-Js '({left:$("camera").scrollLeft,top:$("camera").scrollTop,searching:state==="search",dragging:cameraDrag!==null})'
        $movement = if ($axis -eq 'x') {$after.left-$before.left} else {$after.top-$before.top}
        if ($movement -lt 40 -or -not $after.searching -or $after.dragging) {throw ('Native touch swipe failed on axis '+$axis)}
        Write-Output ('PASS native phone touch swipe works on axis '+$axis)
    }
    $null = Eval-Js 'centerCamera()'
    $target = Eval-Js '(()=>{const b=$("objects").querySelector("[data-id=wire]");b.scrollIntoView({block:"center",inline:"center"});const r=b.getBoundingClientRect();return {x:r.left+r.width*.65,y:r.top+r.height*.18}})()'
    $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchStart';touchPoints=@(@{x=$target.x;y=$target.y;id=2})}
    $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchEnd';touchPoints=@()}
    Start-Sleep -Milliseconds 150
    if (-not (Eval-Js 'state==="lesson"&&found.has("wire")')) {throw 'Touch tap after swiping cannot select a hazard'}
    $target = Eval-Js '(()=>{$("skip-lesson").scrollIntoView({block:"center"});const r=$("skip-lesson").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()'
    $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchStart';touchPoints=@(@{x=$target.x;y=$target.y;id=3})}
    $null = Send-Cdp 'Input.dispatchTouchEvent' @{type='touchEnd';touchPoints=@()}
    Start-Sleep -Milliseconds 150
    if (-not (Eval-Js 'state==="search"&&lessonTimers.length===0')) {throw 'Skip after touch tap does not resume gameplay'}
    Write-Output 'PASS phone tap after swiping selects a hazard and skip resumes gameplay'
    $null = Eval-Js 'profile={plays:0,bestReward:0,coins:0,learned:[]};save();reset()'
} finally {
    $null = Send-Cdp 'Emulation.setTouchEmulationEnabled' @{enabled=$false}
    $null = Send-Cdp 'Emulation.clearDeviceMetricsOverride' @{}
    $socket.Dispose()
}
