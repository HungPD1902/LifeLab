"""Trim user-selected YouTube audio sources into small browser-ready assets.

Requires imageio-ffmpeg. Pass a directory containing the three downloaded MP3s.
"""
import argparse
from pathlib import Path
import subprocess
import imageio_ffmpeg

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
destination = Path(__file__).resolve().parents[1] / 'assets' / 'audio'
destination.mkdir(parents=True, exist_ok=True)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
clips = [
    ('Ge2zHoXskC8', 'pop', 1.80, .3, 'alimiter=limit=0.8'),
    ('su6_bKJJk74', 'meow', .95, 1.1, 'alimiter=limit=0.8'),
    ('JOXUEZloyZE', 'boba-date', 0, 180, 'afade=t=in:d=0.3,afade=t=out:st=178:d=2,alimiter=limit=0.85'),
]
for video, name, start, duration, filters in clips:
    target = destination / f'{name}.mp3'
    subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(args.source / f'{video}.mp3'), '-ss', str(start), '-t', str(duration), '-af', filters, '-ac', '1' if name != 'boba-date' else '2', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '96k' if name == 'boba-date' else '80k', str(target)], check=True)
    print(f'Prepared {target.name}: {target.stat().st_size} bytes')
