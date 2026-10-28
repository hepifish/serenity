import sys, copy
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates
from fontTools import subset

def contours(glyph, glyf):
    coords, ends, flags = glyph.getCoordinates(glyf)
    out, start = [], 0
    for e in ends:
        out.append(([tuple(c) for c in coords[start:e + 1]], list(flags[start:e + 1])))
        start = e + 1
    return out

def setc(glyph, glyf, cs):
    pts, fl, ends = [], [], []
    for p, f in cs:
        pts += p; fl += f; ends.append(len(pts) - 1)
    glyph.coordinates = GlyphCoordinates(pts); glyph.flags = bytearray(fl)
    glyph.endPtsOfContours = ends; glyph.numberOfContours = len(ends); glyph.program = None
    from fontTools.ttLib.tables import ttProgram
    glyph.program = ttProgram.Program(); glyph.program.fromBytecode(b"")
    glyph.recalcBounds(glyf)

def patch(src, wght, out, scale):
    f = instantiateVariableFont(TTFont(src), {"wght": wght})
    glyf = f["glyf"]; cmap = f.getBestCmap()
    xh = f["OS/2"].sxHeight; cap = f["OS/2"].sCapHeight
    capc = contours(glyf[cmap[ord("Î")]], glyf)
    acc = [c for c in capc if min(y for _, y in c[0]) > cap * 0.95]
    ax = [x for c in acc for x, _ in c[0]]; ay = [y for c in acc for _, y in c[0]]
    acx = (min(ax) + max(ax)) / 2; aby = min(ay)
    for ch in "âî":
        g = glyf[cmap[ord(ch)]]
        cs = contours(g, glyf)
        old = [c for c in cs if min(y for _, y in c[0]) > xh * 1.02]
        base = [c for c in cs if c not in old]
        ox = [x for c in old for x, _ in c[0]]; oy = [y for c in old for _, y in c[0]]
        tcx = (min(ox) + max(ox)) / 2; tby = min(oy)
        moved = [([(tcx + (x - acx) * scale, tby + (y - aby) * scale) for x, y in p], fl) for p, fl in acc]
        setc(g, glyf, base + moved)
    f.save(out + ".ttf")
    opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = []; opts.name_IDs = ["*"]
    fs = TTFont(out + ".ttf"); sub = subset.Subsetter(opts); sub.populate(unicodes=[0xE2, 0xEE]); sub.subset(fs)
    fs.flavor = "woff2"; fs.save(out + ".woff2")

# usage: python3 -I patch-circumflex.py <dir with CormorantGaramond[wght].ttf + Italic> <out dir> <accent scale, 1.0>
src_dir, out_dir, scale = sys.argv[1], sys.argv[2], float(sys.argv[3])
for style, fn in [("", "CormorantGaramond[wght].ttf"), ("-italic", "CormorantGaramond-Italic[wght].ttf")]:
    for w in (300, 400, 500):
        patch(f"{src_dir}/{fn}", w, f"{out_dir}/circumflex-{w}{style}", scale)
print("ok")
