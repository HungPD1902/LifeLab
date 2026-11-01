$ErrorActionPreference='Stop'
$helperSource=Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot 'camera-input.ps1')
. ([scriptblock]::Create($helperSource.Substring(0,$helperSource.IndexOf("`ntry {"))))
function Touch-Pair($type,$distance,$centerX=195,$centerY=340) {
 $points=@()
 if($type -ne 'touchEnd'){$points=@(@{x=$centerX-$distance/2;y=$centerY;id=1},@{x=$centerX+$distance/2;y=$centerY;id=2})}
 $null=Send-Cdp 'Input.dispatchTouchEvent' @{type=$type;touchPoints=$points}
 Start-Sleep -Milliseconds 30
}
try {
 $null=Send-Cdp 'Page.reload' @{}
 Start-Sleep -Milliseconds 250
 $null=Send-Cdp 'Emulation.setDeviceMetricsOverride' @{width=390;height=844;deviceScaleFactor=1;mobile=$true}
 $null=Send-Cdp 'Emulation.setTouchEmulationEnabled' @{enabled=$true;maxTouchPoints=2}
 $null=Eval-Js 'LearningApp.startGame()'
 Touch-Pair 'touchStart' 80
 foreach($distance in @(100,120,160)){Touch-Pair 'touchMove' $distance}
 if(-not(Eval-Js 'roomZoom>1.9&&roomZoom<2.1&&state==="search"&&found.size===0&&wrongClicks===0')){throw 'Pinch-out did not zoom without selecting objects'}
 Write-Output 'PASS two-finger spread zooms without selecting objects'
 Touch-Pair 'touchEnd' 0
 Touch-Pair 'touchStart' 160
 foreach($distance in @(140,120,80)){Touch-Pair 'touchMove' $distance}
 Touch-Pair 'touchEnd' 0
 if(-not(Eval-Js 'Math.abs(roomZoom-1)<.01&&!pinchSequence&&cameraPinch===null&&wrongClicks===0')){throw 'Pinch-in did not return to overview'}
 Write-Output 'PASS two-finger pinch returns to overview and ends gesture'
 $null=Eval-Js 'zoomRoom(true);window.beforePinch={left:$("camera").scrollLeft,top:$("camera").scrollTop}'
 Touch-Pair 'touchStart' 100
 Touch-Pair 'touchMove' 100 160 310
 Touch-Pair 'touchEnd' 0
 if(-not(Eval-Js '$("camera").scrollLeft>beforePinch.left+20&&$("camera").scrollTop>beforePinch.top+20&&state==="search"')){throw 'Two-finger drag did not pan'}
 Write-Output 'PASS two-finger drag pans both axes'
 $target=Eval-Js '(()=>{const b=document.querySelector("[data-id=wire]");b.scrollIntoView({block:"center",inline:"center"});const r=b.getBoundingClientRect();return {x:r.x+r.width*.65,y:r.y+r.height*.18}})()'
 $null=Send-Cdp 'Input.dispatchTouchEvent' @{type='touchStart';touchPoints=@(@{x=$target.x;y=$target.y;id=3})}
 $null=Send-Cdp 'Input.dispatchTouchEvent' @{type='touchEnd';touchPoints=@()}
 if(-not(Eval-Js 'state==="lesson"&&found.has("wire")')){throw 'Tap after pinch did not select hazard'}
 Write-Output 'PASS normal tap works after pinch gestures'
 $null=Eval-Js 'window.demoZoom=roomZoom'
 Touch-Pair 'touchStart' 80
 Touch-Pair 'touchMove' 160
 Touch-Pair 'touchEnd' 0
 if(-not(Eval-Js 'roomZoom===demoZoom')){throw 'Pinch changed zoom during demo'}
 Write-Output 'PASS zoom is inactive during demo'
}finally{
 $null=Send-Cdp 'Emulation.setTouchEmulationEnabled' @{enabled=$false}
 $null=Send-Cdp 'Emulation.clearDeviceMetricsOverride' @{}
 $socket.Dispose()
}
