<?php require __DIR__.'/../api/guard.php'; ?>
<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dashboard</title>
<link rel="stylesheet" href="../assets/styles.css"><body class="container">
<div class="nav"><div class="brand">Dashboard CMS</div><div class="right"><a class="link" href="../">Lihat Situs</a><a class="link" href="../api/logout.php">Logout</a></div></div>

<h2>Settings</h2>
<div>
  <input id="brand" placeholder="Brand" style="padding:8px;width:320px">
  <input id="wa" placeholder="WhatsApp 62..." style="padding:8px;width:320px">
  <input id="cta" placeholder="CTA Text" style="padding:8px;width:320px">
  <button class="btn" onclick="save('settings', getSettings())">Simpan</button>
</div>

<h2>Hero Slider</h2><div id="hero"></div><button class="btn" onclick="add('hero')">Tambah</button><button class="btn" onclick="saveList('hero')">Simpan</button>

<h2>Kategori</h2><div id="categories"></div><button class="btn" onclick="add('categories')">Tambah</button><button class="btn" onclick="saveList('categories')">Simpan</button>

<h2>Sub Kategori</h2><div id="sub_categories"></div><button class="btn" onclick="add('sub_categories')">Tambah</button><button class="btn" onclick="saveList('sub_categories')">Simpan</button>

<h2>Produk Unggulan</h2><div id="featured_products"></div><button class="btn" onclick="add('featured_products')">Tambah</button><button class="btn" onclick="saveList('featured_products')">Simpan</button>

<h2>Paling Banyak Dicari</h2><div id="popular_searches"></div><button class="btn" onclick="add('popular_searches')">Tambah</button><button class="btn" onclick="saveList('popular_searches')">Simpan</button>

<h2>Produk Terbaru</h2><div id="new_products"></div><button class="btn" onclick="add('new_products')">Tambah</button><button class="btn" onclick="saveList('new_products')">Simpan</button>

<h2>Partner</h2><div id="partners"></div><button class="btn" onclick="add('partners')">Tambah</button><button class="btn" onclick="saveList('partners')">Simpan</button>

<h2>Testimoni</h2><div id="testimonials"></div><button class="btn" onclick="add('testimonials')">Tambah</button><button class="btn" onclick="saveList('testimonials')">Simpan</button>

<h2>Artikel CTA</h2>
<div>
  <input id="art_title" placeholder="Judul" style="padding:8px;width:100%">
  <textarea id="art_bullets" placeholder='Bullets (array [{"title":"","text":""},...])' style="padding:8px;width:100%;height:120px"></textarea>
  <input id="art_btn_text" placeholder="Teks Tombol" style="padding:8px;width:320px">
  <input id="art_btn_link" placeholder="Link" style="padding:8px;width:520px">
  <input id="art_image" placeholder="Gambar" style="padding:8px;width:520px">
  <button class="btn" onclick="save('article_cta', getArticle())">Simpan</button>
</div>

<h2>Footer</h2>
<div>
  <input id="wh_addr" placeholder="Alamat Gudang" style="padding:8px;width:100%">
  <input id="of_addr" placeholder="Alamat Kantor" style="padding:8px;width:100%">
  <input id="c_wa" placeholder="WA" style="padding:8px;width:220px">
  <input id="c_phone" placeholder="Telepon" style="padding:8px;width:220px">
  <input id="c_mail" placeholder="Email" style="padding:8px;width:320px">
  <input id="ig" placeholder="Instagram URL" style="padding:8px;width:520px">
  <input id="maps" placeholder="Maps URL" style="padding:8px;width:520px">
  <textarea id="links" placeholder='Links JSON {"company":[{"name":"","href":""}], "help":[...]}' style="padding:8px;width:100%;height:120px"></textarea>
  <button class="btn" onclick="save('footer', getFooter())">Simpan</button>
</div>

<script>
const fields={
  hero:['image','title','subtitle'],
  categories:['name','image'],
  sub_categories:['name','image'],
  featured_products:['name','price','image'],
  popular_searches:['name','price','image'],
  new_products:['name','price','image'],
  partners:['logo'],
  testimonials:['name','text']
};
async function load(n){return (await fetch('../api/read.php?name='+n)).json()}
async function save(n,v){const r=await fetch('../api/save.php?name='+n,{method:'POST',body:JSON.stringify(v)});alert(r.ok?'Tersimpan':'Gagal')}
function row(o,t,i){return `<div style='display:flex;gap:8px;align-items:center;margin:6px 0'>${fields[t].map(k=>`<input data-k='${k}' data-t='${t}' data-i='${i}' value='${o[k]||''}' placeholder='${k}' style='padding:8px;width:220px'>`).join('')}<button onclick='del("${t}",${i})'>Hapus</button></div>`}
function render(name,data){const el=document.getElementById(name);el.innerHTML=data.map((o,i)=>row(o,name,i)).join('');el.dataset.json=JSON.stringify(data)}
function add(name){const d=JSON.parse(document.getElementById(name).dataset.json||'[]');const o={};fields[name].forEach(k=>o[k]='');d.push(o);render(name,d)}
function del(name,i){const d=JSON.parse(document.getElementById(name).dataset.json||'[]');d.splice(i,1);render(name,d)}
function collect(name){const inputs=[...document.querySelectorAll('#'+name+' input')];const d=JSON.parse(document.getElementById(name).dataset.json||'[]');const rows=new Map();inputs.forEach(inp=>{const i=+inp.dataset.i,k=inp.dataset.k;if(!rows.has(i))rows.set(i,Object.assign({},d[i]||{}));rows.get(i)[k]=inp.value});return [...rows.values()]}
async function saveList(name){await save(name,collect(name))}
function getSettings(){return {brand:brand.value,whatsapp:wa.value,cta_text:cta.value}}
function getArticle(){return {title:art_title.value,bullets:JSON.parse(art_bullets.value||'[]'),button_text:art_btn_text.value,button_link:art_btn_link.value,image:art_image.value}}
function getFooter(){return {warehouse_address:wh_addr.value,office_address:of_addr.value,contact:{whatsapp:c_wa.value,phone:c_phone.value,email:c_mail.value},social:{instagram:ig.value,maps:maps.value},links:JSON.parse(links.value||'{}')}}
(async()=>{
  const s=await load('settings'); brand.value=s.brand||''; wa.value=s.whatsapp||''; cta.value=s.cta_text||'';
  const a=await load('article_cta'); art_title.value=a.title||''; art_bullets.value=JSON.stringify(a.bullets||[],null,2); art_btn_text.value=a.button_text||''; art_btn_link.value=a.button_link||''; art_image.value=a.image||'';
  const f=await load('footer'); wh_addr.value=f.warehouse_address||''; of_addr.value=f.office_address||''; c_wa.value=(f.contact||{}).whatsapp||''; c_phone.value=(f.contact||{}).phone||''; c_mail.value=(f.contact||{}).email||''; ig.value=(f.social||{}).instagram||''; maps.value=(f.social||{}).maps||''; links.value=JSON.stringify(f.links||{},null,2);
  for(const n of Object.keys(fields)){ render(n, await load(n)); }
})()
</script>
