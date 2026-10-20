"""Gera index.html a partir do HTML do Kit (artifact), mantendo o cabeçalho e o script do PWA.
Uso: python3 tools/build.py /mnt/project-files/kit-aps/kit-aps.html
Depois, aumente VERSION em sw.js."""
import re, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = open(sys.argv[1], encoding='utf8').read()
src = re.sub(r'^.*?(?=<style>)', '', src, count=1, flags=re.S)
src = re.sub(r'\s*</body>\s*</html>\s*$', '', src)
cur = (root / 'index.html').read_text(encoding='utf8')
head = cur[:cur.index('<body>\n') + 7]
pwa = cur[cur.index('\n<button class="upd"'):]
(root / 'index.html').write_text(head + src + '\n' + pwa, encoding='utf8')
