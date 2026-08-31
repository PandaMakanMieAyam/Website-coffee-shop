// Simple interactions: year, mobile nav, filters, modal
document.addEventListener('DOMContentLoaded', () => {
  // set years
  const y = new Date().getFullYear();
  document.getElementById('year') && (document.getElementById('year').textContent = y);
  document.getElementById('year2') && (document.getElementById('year2').textContent = y);
  document.getElementById('year3') && (document.getElementById('year3').textContent = y);

  // mobile nav toggles
  const setupNavToggle = (btnId, navId) => {
    const btn = document.getElementById(btnId);
    const nav = document.getElementById(navId);
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  };
  setupNavToggle('navToggle','nav');
  setupNavToggle('navToggle2','nav2');

  // menu filter
  const filters = document.querySelectorAll('.filter');
  const itemsContainer = document.getElementById('menuGrid');
  if (filters && itemsContainer) {
    filters.forEach(btn => btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      const items = itemsContainer.querySelectorAll('.menu-item');
      items.forEach(it => {
        if (f === 'all' || it.dataset.type === f) {
          it.style.display = '';
        } else {
          it.style.display = 'none';
        }
      });
    }));
  }

  // modal for menu items
  const modal = document.getElementById('itemModal');
  const modalClose = document.getElementById('modalClose');
  const modalBack = document.getElementById('modalBack');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrice = document.getElementById('modalPrice');

  const openModal = (img, name, desc, price) => {
    modalImg.src = img;
    modalImg.alt = name;
    modalTitle.textContent = name;
    modalDesc.textContent = desc;
    modalPrice.textContent = 'Rp ' + Number(price).toLocaleString('id-ID');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.menu-item').forEach(el => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img').src;
      const name = el.dataset.name || el.querySelector('h4')?.textContent || 'Item';
      const desc = el.dataset.desc || 'Deskripsi tidak tersedia.';
      const price = el.dataset.price || '0';
      openModal(img, name, desc, price);
    });
  });

  modalClose && modalClose.addEventListener('click', closeModal);
  modalBack && modalBack.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // simple scroll reveal
  const reveals = document.querySelectorAll('.card, .split, .menu-item, .about-hero, .intro');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.style.transform = 'none';
        ent.target.style.opacity = 1;
        obs.unobserve(ent.target);
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => {
    r.style.transform = 'translateY(14px)';
    r.style.opacity = 0;
    obs.observe(r);
  });

  // subtle hero parallax on mouse move
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const bg = hero.querySelector('.hero-bg');
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      bg.style.transform = `translate(${px * 6}px, ${py * 6}px) scale(1.06)`;
    });
    hero.addEventListener('mouseleave', () => {
      const bg = hero.querySelector('.hero-bg');
      bg.style.transform = 'scale(1.06)';
    });
  }

  // === Enhance menu items: keyboard, hover class, aria ===
  (function enhanceMenuItems() {
    const items = document.querySelectorAll('.menu-item');

    if (!items || items.length === 0) return;

    items.forEach(el => {
      // Make focusable + accessible if HTML hasn't been changed
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      el.setAttribute('aria-label', el.dataset.name || el.querySelector('h4')?.textContent || 'Menu item');

      // mouse hover class for more advanced CSS animation
      el.addEventListener('mouseenter', () => el.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => el.classList.remove('is-hover'));

      // keyboard: open on Enter or Space
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click(); // reuse click handler that opens modal
        }
      });

      // small visual feedback on focus
      el.addEventListener('focus', () => el.classList.add('is-hover'));
      el.addEventListener('blur', () => el.classList.remove('is-hover'));
    });
  })();
});
