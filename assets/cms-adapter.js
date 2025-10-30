/* CMS Adapter: maps JSON -> DOM without changing your CSS */
(async () => {
  const fetchJSON = async (name) => (await fetch(`/data/${name}.json?_=${Date.now()}`)).json();

  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => Array.from(document.querySelectorAll(sel));

  // Configure selectors once to match your existing markup
  const S = Object.assign({
    brand: '[data-cms="brand"]',
    ctaText: '[data-cms="cta-text"]',
    ctaLink: '[data-cms="cta-link"]',

    heroWrap: '[data-cms="hero"]',
    heroTemplate: 'template[data-cms-tpl="hero"]',

    catWrap: '[data-cms="categories"]',
    catTemplate: 'template[data-cms-tpl="category"]',

    featuredWrap: '[data-cms="featured"]',
    featuredTemplate: 'template[data-cms-tpl="featured"]',

    newWrap: '[data-cms="new"]',
    newTemplate: 'template[data-cms-tpl="new"]',

    partnersWrap: '[data-cms="partners"]',
    partnerTemplate: 'template[data-cms-tpl="partner"]',

    testiWrap: '[data-cms="testimonials"]',
    testiTemplate: 'template[data-cms-tpl="testimonial"]',
  }, window.CMS_ADAPTER_SELECTORS || {});

  const tpl = (sel) => {
    const t = q(sel);
    if (!t) return (vars) => '';
    const html = t.innerHTML;
    return (vars) => html.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
  };

  // Settings
  const settings = await fetchJSON('settings');
  if (q(S.brand)) q(S.brand).textContent = settings.brand || '';
  if (q(S.ctaText)) q(S.ctaText).textContent = settings.cta_text || 'WhatsApp';
  if (q(S.ctaLink)) q(S.ctaLink).setAttribute('href', 'https://api.whatsapp.com/send?phone=' + (settings.whatsapp || ''));

  // Hero
  const hero = await fetchJSON('hero');
  if (q(S.heroWrap)) {
    const render = tpl(S.heroTemplate);
    q(S.heroWrap).innerHTML = hero.map(h => render({ image: h.image, title: h.title, subtitle: h.subtitle })).join('');
  }

  // Categories
  const cats = await fetchJSON('categories');
  if (q(S.catWrap)) {
    const render = tpl(S.catTemplate);
    q(S.catWrap).innerHTML = cats.map(c => render({ image: c.image, name: c.name })).join('');
  }

  // Featured
  const feats = await fetchJSON('featured_products');
  if (q(S.featuredWrap)) {
    const render = tpl(S.featuredTemplate);
    q(S.featuredWrap).innerHTML = feats.map(p => render({ image: p.image, name: p.name, price: p.price })).join('');
  }

  // New products
  const news = await fetchJSON('new_products');
  if (q(S.newWrap)) {
    const render = tpl(S.newTemplate);
    q(S.newWrap).innerHTML = news.map(p => render({ image: p.image, name: p.name, price: p.price })).join('');
  }

  // Partners
  const partners = await fetchJSON('partners');
  if (q(S.partnersWrap)) {
    const render = tpl(S.partnerTemplate);
    q(S.partnersWrap).innerHTML = partners.map(p => render({ logo: p.logo })).join('');
  }

  // Testimonials
  const tests = await fetchJSON('testimonials');
  if (q(S.testiWrap)) {
    const render = tpl(S.testiTemplate);
    q(S.testiWrap).innerHTML = tests.map(t => render({ name: t.name, text: t.text })).join('');
  }
})();