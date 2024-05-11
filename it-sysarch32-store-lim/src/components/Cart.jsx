import React from 'react';

function Cart({ cart, totalPrice }) {
  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.product_name} - ${item.product_price}
          </li>
        ))}
      </ul>
      <p>Total Price: ${totalPrice}</p>
    </div>
  );
}

export default Cart;
