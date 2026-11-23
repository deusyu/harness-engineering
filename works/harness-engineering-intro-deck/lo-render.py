"""Render a PPTX to PDF through LibreOffice UNO (headless) for layout checks.

usage: python3 lo-render.py IN.pptx OUT.pdf [--probe] [--no-autospace]
  --no-autospace  turn off Asian/Latin autospacing, which LibreOffice enables on every imported
                  paragraph and OOXML cannot express; PowerPoint does not apply it
  --probe         print the paragraph autospacing/punctuation settings found
"""
import subprocess, sys, time, os, uno
from com.sun.star.beans import PropertyValue

def pv(n, v):
    p = PropertyValue(); p.Name = n; p.Value = v; return p

src, out = map(os.path.abspath, sys.argv[1:3])
probe = '--probe' in sys.argv
noauto = '--no-autospace' in sys.argv
port = 2002 + os.getpid() % 1000
proc = subprocess.Popen(['soffice', '--headless', '--invisible', '--norestore',
                         f'-env:UserInstallation=file:///tmp/lo-uno-{port}',
                         f'--accept=socket,host=127.0.0.1,port={port};urp;'])
local = uno.getComponentContext()
resolver = local.ServiceManager.createInstanceWithContext('com.sun.star.bridge.UnoUrlResolver', local)
for _ in range(60):
    try:
        ctx = resolver.resolve(f'uno:socket,host=127.0.0.1,port={port};urp;StarOffice.ComponentContext'); break
    except Exception:
        time.sleep(0.5)
desktop = ctx.ServiceManager.createInstanceWithContext('com.sun.star.frame.Desktop', ctx)
doc = desktop.loadComponentFromURL(uno.systemPathToFileUrl(src), '_blank', 0, (pv('Hidden', True),))
seen = {}
pages = doc.DrawPages
for i in range(pages.Count):
    page = pages.getByIndex(i)
    for j in range(page.Count):
        sh = page.getByIndex(j)
        if not sh.supportsService('com.sun.star.drawing.Text'):
            continue
        en = sh.Text.createEnumeration()
        while en.hasMoreElements():
            para = en.nextElement()
            if probe:
                k = (para.ParaIsCharacterDistance, para.ParaIsHangingPunctuation, para.ParaIsForbiddenRules)
                seen[k] = seen.get(k, 0) + 1
            if noauto:
                para.ParaIsCharacterDistance = False
if probe:
    print('(CharacterDistance, HangingPunct, ForbiddenRules) -> paragraphs:', seen)
doc.storeToURL(uno.systemPathToFileUrl(out), (pv('FilterName', 'impress_pdf_Export'),))
doc.close(True)
try:
    desktop.terminate()
except Exception:
    pass
proc.wait(timeout=30)
