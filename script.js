const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const whatsappNumber = '212706828446';
const quantityOutput = document.querySelector('#quantity-value');
const orderTotal = document.querySelector('#order-total');
const stickyPrice = document.querySelector('#sticky-price');
const stickyQuantity = document.querySelector('#sticky-quantity');
const checkoutQuantity = document.querySelector('#checkout-quantity');
const checkoutTotal = document.querySelector('#checkout-total');
const orderForm = document.querySelector('#order-form');
const orderFeedback = document.querySelector('#order-feedback');
const unitPrice = 199;
let quantity = 1;

function updateOrderDetails() {
  const total = quantity * unitPrice;
  const amount = total + ' DH';
  const quantityLabel = quantity === 1 ? 'عبوة واحدة' : 'عدد العبوات: ' + quantity;
  if (quantityOutput) quantityOutput.textContent = String(quantity);
  if (orderTotal) orderTotal.textContent = amount;
  if (stickyPrice) stickyPrice.textContent = amount;
  if (stickyQuantity) stickyQuantity.textContent = quantityLabel + ' · FOCUS';
  if (checkoutQuantity) checkoutQuantity.textContent = quantityLabel;
  if (checkoutTotal) checkoutTotal.textContent = amount;
}

document.querySelectorAll('[data-quantity-step]').forEach((button) => {
  button.addEventListener('click', () => {
    const step = Number(button.dataset.quantityStep);
    quantity = Math.min(99, Math.max(1, quantity + step));
    updateOrderDetails();
  });
});
updateOrderDetails();

orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  const fields = new FormData(orderForm);
  const fullName = String(fields.get('customerName') || '').trim();
  const phone = String(fields.get('customerPhone') || '').trim();
  const city = String(fields.get('city') || '').trim();
  const address = String(fields.get('address') || '').trim();
  const notes = String(fields.get('notes') || '').trim();
  const total = quantity * unitPrice;
  const messageLines = [
    'طلب جديد من موقع AL-BARAKA COSMETIQUE',
    'المنتج: FOCUS',
    'الاسم: ' + fullName,
    'هاتف الزبون: ' + phone,
    'المدينة: ' + city,
    'العنوان: ' + address,
    notes ? 'ملاحظة: ' + notes : '',
    'الكمية: ' + quantity + ' عبوة',
    'المجموع: ' + total + ' درهم'
  ].filter(Boolean);
  const whatsappLink = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(messageLines.join('\n'));
  window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  if (orderFeedback) orderFeedback.textContent = 'تفتحات رسالة واتساب فيها تفاصيل الطلب؛ راجعها قبل الإرسال.';
});

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mainNav?.classList.toggle('is-open', !isOpen);
});
mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  });
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();


const heroArt = document.querySelector('.hero-art');
const heroBottle = document.querySelector('.hero-bottle');
if (heroArt && heroBottle && window.matchMedia('(pointer:fine)').matches) {
  heroArt.addEventListener('pointermove', (event) => {
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const rotateY = -7 + x * 8;
    const rotateX = 2 - y * 5;
    heroBottle.style.transform = 'perspective(1100px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(32px)';
  });
  heroArt.addEventListener('pointerleave', () => {
    heroBottle.style.transform = '';
  });
}
