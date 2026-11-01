param([string]$BaseUrl='http://127.0.0.1:8772')
$ErrorActionPreference='Stop'
$helperSource=Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot 'camera-input.ps1')
. ([scriptblock]::Create($helperSource.Substring(0,$helperSource.IndexOf("`ntry {"))))
$instrumentation=@'
window.sfxStarts=[];window.sfxMedia=[];
const NativeContext=window.AudioContext;
window.AudioContext=class extends NativeContext{constructor(...args){super(...args);window.sfxContext=this;}};
const nativeStart=AudioBufferSourceNode.prototype.start;
AudioBufferSourceNode.prototype.start=function(...args){window.sfxStarts.push({duration:this.buffer?.duration,state:this.context.state});return nativeStart.apply(this,args);};
const nativePlay=HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play=function(...args){if(/\/(pop|meow)\.mp3/.test(this.src))this.addEventListener('playing',()=>window.sfxMedia.push(this.src),{once:true});return nativePlay.apply(this,args);};
'@
function Tap-Object($id){
    $point=Eval-Js ('(()=>{const b=$("objects").querySelector("[data-id='+$id+']"),r=b.getBoundingClientRect();for(const f of [.5,.4,.6,.3,.7])for(const g of [.5,.4,.6,.3,.7]){const x=r.left+r.width*f,y=r.top+r.height*g;if(document.elementFromPoint(x,y)===b)return{x,y};}throw Error("No visible hit target");})()')
    $null=Send-Cdp 'Input.dispatchTouchEvent' @{type='touchStart';touchPoints=@(@{x=$point.x;y=$point.y;id=1})}
    Start-Sleep -Milliseconds 100
    $null=Send-Cdp 'Input.dispatchTouchEvent' @{type='touchEnd';touchPoints=@()}
    Start-Sleep -Milliseconds 180
}
try{
    $null=Send-Cdp 'Page.navigate' @{url=($BaseUrl.TrimEnd('/')+'/index.html')}
    for($attempt=0;$attempt -lt 70;$attempt++){Start-Sleep -Milliseconds 100;if(Eval-Js 'document.readyState==="complete"&&typeof gameAudio!=="undefined"'){break}}
    $null=Eval-Js ('(()=>{'+$instrumentation+'})()')
    $null=Send-Cdp 'Emulation.setDeviceMetricsOverride' @{width=390;height=844;deviceScaleFactor=1;mobile=$true}
    $null=Send-Cdp 'Emulation.setTouchEmulationEnabled' @{enabled=$true;maxTouchPoints=2}
    $null=Eval-Js 'soundEnabled=true;gameAudio.setMuted(false);gameAudio.setVolume("effects",.75);LearningApp.startGame()'
    Tap-Object 'obj-2404'
    if(-not(Eval-Js 'wrongClicks===1&&(sfxStarts.some(s=>s.duration>.1&&s.duration<.6)||sfxMedia.some(src=>src.includes("pop.mp3")))')){throw 'Physical tap did not start pop audio'}
    Write-Output 'PASS a real phone tap starts the pop sound'
    $null=Eval-Js 'window.sfxBefore=sfxStarts.length;window.meowBefore=sfxMedia.length;(async()=>{await sfxContext.suspend();})()'
    Tap-Object 'obj-2416'
    if(-not(Eval-Js 'wrongClicks===2&&sfxContext.state==="running"&&(sfxStarts.slice(sfxBefore).some(s=>s.duration>.8&&s.duration<1.5)||sfxMedia.slice(meowBefore).some(src=>src.includes("meow.mp3")))')){throw 'Cat tap did not resume and start meow audio'}
    Write-Output 'PASS tapping the visible cat resumes interrupted audio and starts meow'
    $null=Eval-Js 'window.countBeforeSwipe=sfxStarts.length+sfxMedia.length'
    $null=Send-Cdp 'Input.dispatchTouchEvent' @{type='touchStart';touchPoints=@(@{x=180;y=400;id=2})}
    foreach($distance in @(15,30,50)){$null=Send-Cdp 'Input.dispatchTouchEvent' @{type='touchMove';touchPoints=@(@{x=(180-$distance);y=400;id=2})};Start-Sleep -Milliseconds 40}
    $null=Send-Cdp 'Input.dispatchTouchEvent' @{type='touchEnd';touchPoints=@()}
    Start-Sleep -Milliseconds 100
    if(-not(Eval-Js 'countBeforeSwipe===sfxStarts.length+sfxMedia.length')){throw 'Swiping played an object effect'}
    Write-Output 'PASS swiping does not trigger an object sound'
}finally{
    $null=Send-Cdp 'Emulation.setTouchEmulationEnabled' @{enabled=$false}
    $null=Send-Cdp 'Emulation.clearDeviceMetricsOverride' @{}
    $socket.Dispose()
}
