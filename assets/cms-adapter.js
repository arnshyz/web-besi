/* CMS Adapter: maps JSON -> DOM without changing your CSS */
(async () => {
  const ARRAY_DATA = new Set([
    'hero',
    'categories',
    'sub_categories',
    'featured_products',
    'popular_searches',
    'new_products',
    'partners',
    'testimonials'
  ]);

  const fetchJSON = async (name) => {
    try {
      const response = await fetch(`/data/${name}.json?_=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('CMS load failed for', name, error);
      return ARRAY_DATA.has(name) ? [] : {};
    }
  };

  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => Array.from(document.querySelectorAll(sel));

  const S = Object.assign({
    brand: '[data-cms="brand"]',
    ctaText: '[data-cms="cta-text"]',
    ctaLink: '[data-cms="cta-link"]',

    heroRoot: '[data-hero]',
    heroWrap: '[data-cms="hero"]',
    heroTemplate: 'template[data-cms-tpl="hero"]',

    catWrap: '[data-cms="categories"]',
    catTemplate: 'template[data-cms-tpl="category"]',

    subCatWrap: '[data-cms="sub-categories"]',
    subCatTemplate: 'template[data-cms-tpl="sub-category"]',

    featuredWrap: '[data-cms="featured-products"]',
    featuredTemplate: 'template[data-cms-tpl="featured"]',

    newWrap: '[data-cms="new-products"]',
    newTemplate: 'template[data-cms-tpl="new"]',

    popularWrap: '[data-cms="popular-products"]',
    popularTemplate: 'template[data-cms-tpl="popular"]',

    partnersWrap: '[data-cms="partners"]',
    partnerTemplate: 'template[data-cms-tpl="partner"]',

    testiWrap: '[data-cms="testimonials"]',
    testiTemplate: 'template[data-cms-tpl="testimonial"]',

    articleTitle: '[data-cms="article-title"]',
    articleBullets: '[data-cms="article-bullets"]',
    articleButton: '[data-cms="article-button"]',
    articleButtonText: '[data-cms="article-button-text"]',
    articleImage: '[data-cms="article-image"]',

    warehouseAddress: '[data-cms="warehouse-address"]',
    officeAddress: '[data-cms="office-address"]',
    contactWhatsapp: '[data-cms="contact-whatsapp"]',
    contactPhone: '[data-cms="contact-phone"]',
    contactEmail: '[data-cms="contact-email"]',
    socialInstagram: '[data-cms="social-instagram"]',
    socialMaps: '[data-cms="social-maps"]',
    footerLinks: '[data-cms="footer-links"]',
  }, window.CMS_ADAPTER_SELECTORS || {});

  const tpl = (sel) => {
    const template = q(sel);
    if (!template) return () => '';
    const html = template.innerHTML;
    return (vars) => html.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] ?? ''));
  };

  const renderList = (wrapSel, templateSel, data, mapper = (item) => item) => {
    const wrap = q(wrapSel);
    if (!wrap) return;
    const render = tpl(templateSel);
    wrap.innerHTML = data.map((item) => render(mapper(item))).join('');
  };

  const assignText = (sel, text) => {
    qa(sel).forEach((el) => {
      el.textContent = text;
    });
  };

  const assignSpanText = (sel, text) => {
    qa(sel).forEach((el) => {
      const span = el.querySelector('span');
      if (span) span.textContent = text;
    });
  };

  const assignHref = (sel, href, fallbackText) => {
    qa(sel).forEach((el) => {
      if (href) {
        el.setAttribute('href', href);
      } else {
        el.removeAttribute('href');
      }
      if (fallbackText && !href) {
        el.textContent = fallbackText;
      }
    });
  };

  // Settings & CTA
  const settings = await fetchJSON('settings');
  const whatsappLink = settings.whatsapp ? `https://api.whatsapp.com/send?phone=${settings.whatsapp}` : '#';
  assignText(S.brand, settings.brand || 'Besi Nusantara');
  assignText(S.ctaText, settings.cta_text || 'Hubungi Kami');
  assignHref(S.ctaLink, whatsappLink);

  // Hero Slider
  const hero = await fetchJSON('hero');
  renderList(S.heroWrap, S.heroTemplate, hero, (slide) => ({
    image: slide.image || '',
    title: slide.title || '',
    subtitle: slide.subtitle || '',
    link: slide.link || whatsappLink,
  }));
  window.initHeroSlider?.(q(S.heroRoot));

  // Categories
  const categories = await fetchJSON('categories');
  renderList(S.catWrap, S.catTemplate, categories, (item) => ({
    name: item.name || '',
    image: item.image || '',
    link: item.link || '#',
  }));

  // Sub categories
  const subCategories = await fetchJSON('sub_categories');
  renderList(S.subCatWrap, S.subCatTemplate, subCategories, (item) => ({
    name: item.name || '',
    image: item.image || '',
    link: item.link || '#',
  }));

  // Featured products
  const featured = await fetchJSON('featured_products');
  renderList(S.featuredWrap, S.featuredTemplate, featured, (item) => ({
    name: item.name || '',
    image: item.image || '',
    price: item.price || '',
    link: item.link || whatsappLink,
  }));

  // New products carousel
  const newProducts = await fetchJSON('new_products');
  renderList(S.newWrap, S.newTemplate, newProducts, (item) => ({
    name: item.name || '',
    image: item.image || '',
    price: item.price || '',
    link: item.link || whatsappLink,
  }));
  window.initCarousel?.(document.querySelector('[data-carousel="new-products"]'));

  // Popular products carousel
  const popularProducts = await fetchJSON('popular_searches');
  renderList(S.popularWrap, S.popularTemplate, popularProducts, (item) => ({
    name: item.name || '',
    image: item.image || '',
    price: item.price || '',
    link: item.link || whatsappLink,
  }));
  window.initCarousel?.(document.querySelector('[data-carousel="popular-products"]'));

  // Partners
  const partners = await fetchJSON('partners');
  renderList(S.partnersWrap, S.partnerTemplate, partners, (item) => ({
    logo: item.logo || '',
    link: item.link || '#',
  }));

  // Testimonials
  const testimonials = await fetchJSON('testimonials');
  renderList(S.testiWrap, S.testiTemplate, testimonials, (item) => ({
    name: item.name || '',
    text: item.text || '',
  }));

  // Article CTA
  const article = await fetchJSON('article_cta');
  const bullets = Array.isArray(article.bullets) ? article.bullets : [];
  assignText(S.articleTitle, article.title || '');
  const bulletWrap = q(S.articleBullets);
  if (bulletWrap) {
    bulletWrap.innerHTML = bullets.map((bullet) => `
      <li class="p-4 bg-white rounded-xl shadow flex flex-col gap-1">
        <span class="font-semibold text-[#1f4d75]">${bullet.title || ''}</span>
        <span class="text-gray-600 text-sm">${bullet.text || ''}</span>
      </li>
    `).join('');
  }
  assignText(S.articleButtonText, article.button_text || 'Pelajari lebih lanjut');
  const btn = q(S.articleButton);
  if (btn) {
    if (article.button_link) {
      btn.setAttribute('href', article.button_link);
    } else {
      btn.setAttribute('href', '#');
    }
  }
  const img = q(S.articleImage);
  if (img && article.image) {
    img.setAttribute('src', article.image);
    img.setAttribute('alt', article.title || 'Artikel unggulan');
  }

  // Footer content
  const footer = await fetchJSON('footer');
  assignText(S.warehouseAddress, footer.warehouse_address || '');
  assignText(S.officeAddress, footer.office_address || '');

  const whatsappNumber = footer?.contact?.whatsapp || '';
  const phoneNumber = footer?.contact?.phone || '';
  const emailAddress = footer?.contact?.email || '';

  assignHref(S.contactWhatsapp, whatsappNumber ? `https://api.whatsapp.com/send?phone=${whatsappNumber}` : '');
  assignHref(S.contactPhone, phoneNumber ? `tel:${phoneNumber}` : '');
  assignHref(S.contactEmail, emailAddress ? `mailto:${emailAddress}` : '');
  assignSpanText(S.contactPhone, phoneNumber || '');
  assignSpanText(S.contactEmail, emailAddress || '');

  qa(S.contactWhatsapp).forEach((node) => {
    const label = node.querySelector('span');
    if (label) label.textContent = whatsappNumber ? `+${whatsappNumber}` : 'WhatsApp';
  });

  assignHref(S.socialInstagram, footer?.social?.instagram || '');
  assignHref(S.socialMaps, footer?.social?.maps || '');

  const footerLinksWrap = q(S.footerLinks);
  if (footerLinksWrap && footer.links) {
    const groups = Object.entries(footer.links);
    footerLinksWrap.innerHTML = groups.map(([group, links]) => {
      const items = (links || []).map((link) => `<a href="${link.href || '#'}" class="hover:text-white block">${link.name || ''}</a>`).join('');
      return `<div><p class="text-xs uppercase tracking-wide text-slate-400 mb-2">${group}</p>${items}</div>`;
    }).join('');
  }
})();
