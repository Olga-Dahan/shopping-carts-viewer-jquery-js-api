$(() => {

  const $cartsTable = $('#carts');
  const $productsTable = $('#products');
  const $cartForm = $('#cart-form');

  // Load and display all carts
  const loadAllCarts = () => {
    $.getJSON('https://dummyjson.com/carts', ({ carts }) => {
      const html = carts.map(cart => `
        <tr>
          <td>${cart.id}</td>
          <td>${cart.userId}</td>
          <td>${cart.totalProducts}</td>
          <td>${cart.totalQuantity}</td>
          <td><button class="show-products" data-cart="${cart.id}">Show products</button></td>
        </tr>
        <tr id="products-${cart.id}" class="hidden">
          <td colspan="5">   
            <div class="cart-product-details">
              <table>
                <thead>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                </thead>
                <tbody>
                  ${reduceProducts(cart.products)}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
    `).reduce((acc, curr) => acc + curr, '');

      $cartsTable.html(html);
    });
  };

  // Toggle products in a selected cart
  $cartsTable.on('click', '.show-products', function () {
    const cartId = $(this).data('cart');
    const $row = $(`#products-${cartId}`);
    const $button = $(this);
    $row.toggleClass('revealed-row');
    $row.slideToggle(200, function () {
      const isVisible = $row.is(':visible');
      $button.text(isVisible ? 'Hide products' : 'Show products');
    });
  });


  const reduceProducts = (products) => products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td>${product.title}</td>
      <td>${product.price}</td>
    </tr>
  `).reduce((acc, curr) => acc + curr, '')


  // Load and display products from a specific cart by ID
  const loadCartById = (cartId) => {
    $.getJSON(`https://dummyjson.com/carts/${cartId}`, ({ products }) => {
      const html = products.map(product => `
        <tr>
          <td>${product.id}</td>
          <td>${product.title}</td>
          <td>${product.price}</td>
          <td>${product.quantity}</td>
          <td id = "product-${product.id}">
            <button class="show-images" data-id="${product.id}">Show Images</button>
          </td>
        </tr>
    `).reduce((acc, curr) => acc + curr, '');

      $('.cart-products').slideDown();
      $productsTable.html(html);
    });
  };

  // Show product images on button click
  $productsTable.on('click', '.show-images', function () {
    const productId = $(this).data('id');
    const $buttonCell = $(`#product-${productId}`);

    $.getJSON(`https://dummyjson.com/products/${productId}`, ({ images }) => {
      const imgHtml = images.map(image => `<img src="${image}" style="max-height:80px; margin:5px;">`)
        .reduce((acc, curr) => acc + curr, '')

      $buttonCell.append(`<div class="product-images">${imgHtml}</div>`);
      $(this).remove(); // Prevent re-click and duplication
    });
  });


  // Form submit handler to load single cart
  $cartForm.on('submit', function (e) {
    e.preventDefault();
    const cartId = $('#cartId').val().trim();
    if (!cartId) return;
    loadCartById(cartId);
  });

  // Initial data load
  loadAllCarts();

});