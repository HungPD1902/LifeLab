"""Prepare local Google Vietnamese narration. Requires Node and imageio-ffmpeg.

This build helper uses the Google Translate website's speech endpoint, which can
change independently of the supported Google Cloud TTS API. The game never calls
that endpoint: it plays the bundled MP3s, with browser speech/captions as fallback.
"""
from concurrent.futures import ThreadPoolExecutor
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import time
from urllib.parse import urlencode
from urllib.request import urlopen
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
NODE = shutil.which('node')
source = "const fs=require('fs'),vm=require('vm');const code=fs.readFileSync('lessons.js','utf8');process.stdout.write(vm.runInNewContext(code+'\\nJSON.stringify(LESSON_VOICE)'));"
phrases = json.loads(subprocess.check_output([NODE, '-e', source], cwd=ROOT, encoding='utf-8'))
destination = ROOT / 'assets' / 'audio' / 'voice'
destination.mkdir(parents=True, exist_ok=True)
parser = argparse.ArgumentParser()
parser.add_argument('--force', action='store_true')
parser.add_argument('--only', nargs='+', help='Optional clip IDs, e.g. wire-2 socket-2')
args = parser.parse_args()

def generate(item):
    hazard, phase, text = item
    if args.only and f'{hazard}-{phase}' not in args.only:
        return
    target = destination / f'{hazard}-{phase}.mp3'
    if not args.force and target.exists() and target.stat().st_size > 1000:
        return
    query = urlencode({'ie':'UTF-8','client':'tw-ob','tl':'vi','q':text})
    for attempt in range(3):
        try:
            with urlopen('https://translate.google.com/translate_tts?'+query, timeout=20) as response:
                if 'audio' not in response.headers.get('Content-Type',''):
                    raise RuntimeError('Speech service did not return audio')
                data = response.read()
            break
        except Exception:
            if attempt == 2:
                raise
            time.sleep(.8)
    with tempfile.TemporaryDirectory(prefix='gamedoan-voice-') as temp:
        original = Path(temp) / 'source.mp3'
        original.write_bytes(data)
        subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(original),'-af','atempo=1.14','-ar','44100','-ac','1','-b:a','80k',str(target)], check=True)
    print(f'Generated {target.name}: {target.stat().st_size} bytes', flush=True)

with ThreadPoolExecutor(max_workers=3) as pool:
    list(pool.map(generate, [(hazard,phase,text) for hazard,lines in phrases.items() for phase,text in enumerate(lines)]))
