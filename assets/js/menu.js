/* =============================================
   SLURP — Menu Page JS
   Renders menu from JSON, tab navigation
   Future order hook scaffold included
   ============================================= */

(function () {
  'use strict';

  /* ── Fetch + render menu ── */
  async function initMenu() {
    let data;
    try {
      const res = await fetch('assets/data/menu.json');
      if (!res.ok) throw new Error('Failed to load menu data');
      data = await res.json();
    } catch (err) {
      console.error(err);
      document.querySelector('.menu-content').innerHTML =
        '<p style="color:var(--ink-dim);text-align:center;padding:4rem 0">Menu temporarily unavailable.</p>';
      return;
    }

    renderTabs(data.categories);
    renderCategories(data.categories);
    initTabs();
    initIntersectionObserver(data.categories);

    // Future order hook: listen for add-to-order clicks (currently no-ops)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-item-id]');
      if (!btn) return;
      const itemId = btn.dataset.itemId;
      // TODO: dispatch to cart state when ordering goes live
      console.log('[Slurp] Item selected:', itemId);
    });
  }

  /* ── Render sticky tabs ── */
  function renderTabs(categories) {
    const tabsEl = document.querySelector('.menu-tabs');
    if (!tabsEl) return;

    categories.forEach((cat, i) => {
      const btn = document.createElement('button');
      btn.className = 'menu-tab' + (i === 0 ? ' active' : '');
      btn.dataset.target = cat.id;
      btn.textContent = cat.name;
      tabsEl.appendChild(btn);
    });
  }

  /* ── Render categories + items ── */
  function renderCategories(categories) {
    const content = document.querySelector('.menu-content');
    if (!content) return;

    categories.forEach((cat) => {
      const section = document.createElement('section');
      section.className = 'menu-category';
      section.id = cat.id;

      // Category heading
      const title = document.createElement('h2');
      title.className = 'menu-category-title';
      title.textContent = cat.name;
      title.dataset.count = cat.items.length + ' items';
      section.appendChild(title);

      // Broth options for noodles
      if (cat.broth_options && cat.broth_options.length) {
        const broths = buildBrothSelector(cat.broth_options);
        section.appendChild(broths);
      }

      // Item list
      const list = document.createElement('div');
      list.className = 'menu-item-list';

      cat.items.forEach((item) => {
        list.appendChild(buildItemRow(item));
      });

      section.appendChild(list);
      content.appendChild(section);
    });
  }

  /* ── Build broth selector ── */
  function buildBrothSelector(options) {
    const wrapper = document.createElement('div');

    const note = document.createElement('p');
    note.className = 'broth-note';
    note.textContent = 'Choose your broth';
    wrapper.appendChild(note);

    const selector = document.createElement('div');
    selector.className = 'broth-selector';

    options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'broth-btn' + (i === 0 ? ' active' : '');
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        selector.querySelectorAll('.broth-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      selector.appendChild(btn);
    });

    wrapper.appendChild(selector);
    return wrapper;
  }

  /* ── Build item row ── */
  function buildItemRow(item) {
    const row = document.createElement('div');
    row.className = 'menu-item';
    // Scaffold attribute for future ordering
    row.dataset.itemId = item.id;

    const name = document.createElement('span');
    name.className = 'menu-item-name';
    name.textContent = item.name;

    const desc = document.createElement('p');
    desc.className = 'menu-item-desc';
    desc.textContent = item.description;

    const price = document.createElement('span');
    price.className = 'menu-item-price';
    price.textContent = item.price;

    // Hidden add-to-order button scaffold
    const addBtn = document.createElement('button');
    addBtn.className = 'menu-item-add';
    addBtn.setAttribute('aria-label', 'Add ' + item.name + ' to order');
    addBtn.dataset.itemId = item.id;
    addBtn.textContent = '+';

    row.appendChild(name);
    row.appendChild(price);
    row.appendChild(desc);

    // Tags
    if (item.tags && item.tags.length) {
      const tagRow = document.createElement('div');
      tagRow.className = 'menu-item-tags';
      item.tags.forEach((t) => {
        const tag = document.createElement('span');
        tag.className = 'tag ' + t;
        tag.textContent = t.charAt(0).toUpperCase() + t.slice(1);
        tagRow.appendChild(tag);
      });
      row.appendChild(tagRow);
    }

    row.appendChild(addBtn);
    return row;
  }

  /* ── Tab click handler ── */
  function initTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = document.getElementById(tab.dataset.target);
        if (!target) return;

        setActiveTab(tab.dataset.target);

        // Smooth scroll to section (offset for sticky bar)
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  function setActiveTab(id) {
    document.querySelectorAll('.menu-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.target === id);
    });
  }

  /* ── IntersectionObserver: update active tab on scroll ── */
  function initIntersectionObserver(categories) {
    const ids = categories.map((c) => c.id);
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', initMenu);

})();
