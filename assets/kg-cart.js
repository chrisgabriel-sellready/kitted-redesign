/* Cart recommendations use Shopify's existing AJAX cart and explicit sizes/hands. */
document.addEventListener('click', async function (event) {
  var button = event.target.closest('[data-kg-cart-add]');
  if (!button || button.disabled) return;
  var card = button.closest('.kg-cart-recommendation');
  var select = card.querySelector('[data-kg-cart-variant]');
  var id = button.dataset.kgCartAdd === 'choose' ? select.value : button.dataset.kgCartAdd;
  if (!id) { select.focus(); select.required = true; select.reportValidity(); return; }
  var error = card.querySelector('.kg-cart-add-error');
  error.textContent = '';
  if (typeof window.kgAddItems !== 'function') return;
  var added = await window.kgAddItems([{ id: Number(id), quantity: 1 }], error, button);
  if (added && document.querySelector('main.kg-cart-page')) window.location.assign(window.routes.cart_url);
});
