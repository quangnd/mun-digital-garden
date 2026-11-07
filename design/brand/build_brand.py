from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from PIL import Image, ImageDraw, ImageFont
import subprocess, shutil, json

ROOT=Path(__file__).resolve().parents[2]
BRAND=ROOT/'design'/'brand'
BRAND.mkdir(parents=True,exist_ok=True)
PAPER='#F7F3EB'; INK='#292724'; CLAY='#9B4937'; MUTED='#6D655C'; LINE='#DCD4C8'
SERIF='/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf'
BOLD='/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf'
SANS='/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf'

def text_paths(text,fontpath,size,x,y,color,tracking=0):
    f=TTFont(fontpath); gs=f.getGlyphSet(); cmap=f.getBestCmap(); scale=size/f['head'].unitsPerEm
    out=[]; start=x
    for char in text:
        name=cmap[ord(char)]; pen=SVGPathPen(gs)
        gs[name].draw(TransformPen(pen,(scale,0,0,-scale,x,y)))
        d=pen.getCommands()
        if d: out.append(f'<path fill="{color}" d="{d}"/>')
        x+=f['hmtx'][name][0]*scale+tracking
    return ''.join(out),x-start

def svg(name,w,h,body,title):
    content=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n'
    (BRAND/name).write_text(content)
    return content

def wordmark(color,dot):
    paths,width=text_paths('mun',SERIF,104,8,105,color,-4)
    return paths+f'<circle cx="{width+23:.2f}" cy="99" r="6.5" fill="{dot}"/>'

svg('wordmark-light.svg',266,136,wordmark(INK,CLAY),'mun.')
svg('wordmark-dark.svg',266,136,wordmark(PAPER,'#D98C73'),'mun.')
svg('wordmark-mono.svg',266,136,wordmark(INK,INK),'mun.')
paths,_=text_paths('m',BOLD,53,6,47,PAPER)
# The compact mark uses a bold glyph, omitting the dot for small-size clarity.
iconbody=f'<rect width="64" height="64" rx="14" fill="{CLAY}"/>'+paths
svg('favicon.svg',64,64,iconbody,'Mun Digital Garden')

def render(src,dst,w,h):
    subprocess.run(['inkscape',str(src),'--export-type=png',f'--export-filename={dst}',f'--export-width={w}',f'--export-height={h}'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)

render(BRAND/'favicon.svg',BRAND/'icon-512.png',512,512)
im=Image.open(BRAND/'icon-512.png').convert('RGBA')
for size,name in [(16,'favicon-16.png'),(32,'favicon-32.png'),(48,'favicon-48.png'),(180,'apple-touch-icon.png'),(192,'icon-192.png')]:
    im.resize((size,size),Image.Resampling.LANCZOS).save(BRAND/name)
im.save(BRAND/'favicon.ico',sizes=[(16,16),(32,32),(48,48)])
render(BRAND/'wordmark-light.svg',BRAND/'wordmark-light.png',798,408)

og=f'<rect width="1200" height="630" fill="{PAPER}"/><path d="M88 466H1112" stroke="{LINE}" stroke-width="2"/>'
p,word_width=text_paths('mun',SERIF,154,87,250,INK,-6);og+=p+f'<circle cx="{87+word_width+19:.2f}" cy="240" r="9" fill="{CLAY}"/>'
p,_=text_paths('DIGITAL GARDEN',SANS,19,91,302,CLAY,4);og+=p
p,_=text_paths('Một khu vườn cho những ý tưởng.',SERIF,37,88,408,INK);og+=p
p,_=text_paths('Ghi lại. Kết nối. Nghĩ tiếp.',SANS,21,88,520,MUTED);og+=p
svg('social-card.svg',1200,630,og,'Mun Digital Garden · Một khu vườn cho những ý tưởng.')
render(BRAND/'social-card.svg',BRAND/'social-card.png',1200,630)

# A static contact sheet shows the exact exported assets, not approximations.
board=Image.new('RGB',(1400,1010),PAPER);d=ImageDraw.Draw(board)
def font(n,serif=False):return ImageFont.truetype(SERIF if serif else SANS,n)
d.text((58,38),'MUN DIGITAL GARDEN',font=font(16),fill=CLAY)
d.text((58,76),'Nhận diện tối giản cho một khu vườn ý tưởng.',font=font(28,True),fill=INK)
d.line((58,140,1342,140),fill=LINE,width=2)
d.text((58,165),'WORDMARK',font=font(13),fill=MUTED)
wm=Image.open(BRAND/'wordmark-light.png').convert('RGBA');wm.thumbnail((410,210))
board.paste(wm,(58,195),wm)
d.text((550,165),'FAVICON / APP ICON',font=font(13),fill=MUTED)
ic=im.resize((140,140),Image.Resampling.LANCZOS);board.paste(ic,(550,218),ic)
for i,size in enumerate([16,32,48]):
    x=760+i*158
    d.rounded_rectangle((x,230,x+132,292),radius=7,fill='#EDE7DD',outline=LINE)
    tiny=im.resize((size,size),Image.Resampling.LANCZOS)
    board.paste(tiny,(x+14,261-size//2),tiny)
    d.text((x+14,311),f'{size} px · thực',font=font(13),fill=MUTED)
d.text((58,422),'BẢNG MÀU',font=font(13),fill=MUTED)
for i,(name,c) in enumerate([('Giấy',PAPER),('Mực',INK),('Đất nung',CLAY),('Chữ phụ',MUTED)]):
    x=58+i*118;d.rectangle((x,460,x+96,512),fill=c,outline=LINE)
    d.text((x,526),name,font=font(14),fill=INK);d.text((x,550),c,font=font(12),fill=MUTED)
d.text((58,611),'TRÊN NỀN TỐI',font=font(13),fill=MUTED)
d.rounded_rectangle((58,647,470,904),radius=6,fill='#24211E')
render(BRAND/'wordmark-dark.svg',BRAND/'wordmark-dark.png',532,272)
dark=Image.open(BRAND/'wordmark-dark.png').convert('RGBA');dark.thumbnail((310,158));board.paste(dark,(106,691),dark)
d.text((550,422),'ẢNH CHIA SẺ LIÊN KẾT · 1200 × 630',font=font(13),fill=MUTED)
social=Image.open(BRAND/'social-card.png').convert('RGB');social.thumbnail((790,415));board.paste(social,(550,461))
d.rectangle((550,461,1339,875),outline=LINE,width=1)
d.text((58,952),'Đề xuất v1 · Typography, khoảng trắng và một dấu chấm.',font=font(15),fill=MUTED)
board.save(BRAND/'brand-preview.png')
shutil.copy('/usr/share/doc/fonts-noto-core/copyright',BRAND/'FONT-LICENSES.txt')
print(json.dumps({'directory':str(ROOT),'files':len(list(BRAND.iterdir())),'preview':str(BRAND/'brand-preview.png')}))
