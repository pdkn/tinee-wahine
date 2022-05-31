import React, { useState, useEffect } from 'react';
import CartTable from './CartTable';
import CartTotal from './CartTotal';

export default function Cart() {
  const [showProducts, setShowProducts] = useState(true);
  const [products, setProducts] = useState([]);
  const [cost, setCost] = useState({});
  const [cartId, setCartId] = useState(null);

  useEffect( () => {
    const localCart = window.localStorage.getItem('astroCartId');

    async function fetchData() {
      const options = {
        method: 'post',
        body: JSON.stringify({
          cartId: localCart,
        }),
        headers: { 'Content-Type': 'application/json' },
      }

      const response = await fetch("/api/get-cart", options);
      const res = new Response(response.body)
      console.log("res", res)
      const data = await res.json()
      console.log("data", data)
      window.localStorage.setItem('astroCartId', data.id);

      setProducts(response.cart.lines.edges);
      setCost(response.cart.estimatedCost);
    }

    //let data;

    if (localCart === null) {
      setShowProducts(false);
    } else {
      setCartId(localCart);
      fetchData();
      //return data;
    }
  }, []);

  return (
    <div>
      {showProducts && products.length > 0 ? (
        <div>
          <CartTable
            cartItems={products}
            cartId={cartId}
            removeItem={setProducts}
          />
          <CartTotal cost={cost} />
        </div>
      ) : (
        <div className="cart-page-message">
          No products to show! Get shopping!
        </div>
      )}
    </div>
  );
}
