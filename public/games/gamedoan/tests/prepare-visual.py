"""Package the supplied aligned PNG layers; no generated or repainted artwork."""
from PIL import Image
from pathlib import Path
import json

root = Path('assets/visual')
out = root / 'sprites'
out.mkdir(exist_ok=True)
W, H = Image.open(root/'final.png').size
names = {'2401':'Khăn trên kệ','2402':'Gối sofa','2403':'Gối hoa','2404':'Chậu cây','2405':'Đồng hồ','2406':'Túi đồ ăn','2407':'Giấy trên sàn','2408':'Giấy cạnh quạt','2410':'Bộ phát Wi-Fi','2411':'Điều khiển','2412':'Tượng thỏ','2413':'Bình hoa','2414':'Sách trên bàn','2415':'Cây và hộp đồ','2416':'Mèo đang ngủ','2417':'Sách dưới sàn','2418':'Quạt điện'}
normal = []
def hit_shape(im, box):
    alpha = im.crop(box).getchannel('A').resize((64,64))
    parts = []
    for y in range(64):
        x = 0
        while x < 64:
            if alpha.getpixel((x,y)) < 24:
                x += 1
                continue
            start = x
            while x < 64 and alpha.getpixel((x,y)) >= 24:
                x += 1
            parts.append(f'M{start/64},{y/64}h{(x-start)/64}v{1/64}h{-(x-start)/64}z')
    return ''.join(parts)
safe = Image.open(root/'bg.png').convert('RGBA')
for p in sorted((root/'obj').glob('*.PNG')):
    im = Image.open(p).convert('RGBA')
    safe.alpha_composite(im)
    b = im.getbbox()
    key = p.stem[-4:]
    im.crop(b).save(out/(key+'.png'))
    x,y,r,t = b
    normal.append(dict(id='obj-'+key,title=names[key],bounds=[x/W*100,y/H*100,(r-x)/W*100,(t-y)/H*100],sprite='assets/visual/sprites/'+key+'.png',underlay='assets/visual/sprites/'+key+'-underlay.png',hitShape=hit_shape(im,b),reason='Đồ vật này không phải nguy cơ cần tìm trong tình huống hiện tại.'))
hazards = []
for key,name,safe_name in [('wire','Dây điện-1.PNG','Dây điện-2.PNG'),('socket','Ổ điện-1.PNG','Ổ điện-2.PNG'),('cigarette','Tàn thuốc.PNG',None)]:
    im = Image.open(root/'hazards'/name).convert('RGBA')
    b = im.getbbox()
    im.crop(b).save(out/(key+'.png'))
    if safe_name:
        replacement = Image.open(root/'hazards'/safe_name).convert('RGBA')
        safe.alpha_composite(replacement)
        replacement.crop(b).save(out/(key+'-safe.png'))
    x,y,r,t = b
    hazards.append(dict(id=key,bounds=[x/W*100,y/H*100,(r-x)/W*100,(t-y)/H*100],sprite='assets/visual/sprites/'+key+'.png',hitShape=hit_shape(im,b)))
safe.save(root/'safe.png')
# Local backgrounds let a tapped object lift without leaving a second copy behind.
layers = [(p.name, Image.open(p).convert('RGBA')) for p in sorted((root/'obj').glob('*.PNG'))]
layers += [(name,Image.open(root/'hazards'/name).convert('RGBA')) for name in ['Dây điện-1.PNG','Ổ điện-1.PNG','Tàn thuốc.PNG']]
base = Image.open(root/'bg.png').convert('RGBA')
for name, im in layers[:len(normal)]:
    box = im.getbbox()
    under = base.crop(box)
    for other_name, other in layers:
        if other_name != name:
            under.alpha_composite(other.crop(box))
    under.save(out/(name[-8:-4]+'-underlay.png'))
Path('visual-data.js').write_text('const ROOM_ASSETS = '+json.dumps(dict(width=W,height=H,normal=normal,hazards=hazards),ensure_ascii=False)+';\n',encoding='utf8')
