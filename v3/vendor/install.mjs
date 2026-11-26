import {execFileSync} from 'node:child_process';
import {mkdtempSync,copyFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const target=fileURLToPath(new URL('.',import.meta.url));
const temp=mkdtempSync(join(tmpdir(),'atlas-vendor-'));
try{execFileSync('npm',['pack','maplibre-gl@5.15.0','--pack-destination',temp],{stdio:'inherit'});execFileSync('tar',['-xzf',join(temp,'maplibre-gl-5.15.0.tgz'),'-C',temp]);for(const f of ['maplibre-gl.js','maplibre-gl.css'])copyFileSync(join(temp,'package','dist',f),join(target,f));const license=['LICENSE.txt','LICENSE','LICENSE.md'].find(f=>existsSync(join(temp,'package',f)));if(!license)throw Error('Upstream license missing');copyFileSync(join(temp,'package',license),join(target,'LICENSE.txt'));}finally{rmSync(temp,{recursive:true,force:true});}
