import React, { useEffect, useState } from 'react';
import { formatPrice } from '../utilityFunctions';

function getCurrentVariantObject(vars, id) {
  return vars.filter((v) => {
    return v.node.id === id;
  })[0];
}

function VariantForm({ vars, current, pick, setQ }) {
  return (
    <form className="addToCart">
      {vars.length > 1 &&
        vars.map((v, index) => {
          return (
            <div className="product-page-price" key={`variant${index}`}>
              <label>
                <input
                  name="Product Variant"
                  type="radio"
                  id={v.node.id}
                  defaultChecked={index === 0}
                  onChange={() => {
                    pick(v.node.id);
                  }}
                />
                {` ${v.node.title}`}
              </label>
              <br />
            </div>
          );
        })}
      <input
        type="number"
        placeholder="Quantity"
        defaultValue={1}
        min={1}
        max={getCurrentVariantObject(vars, current).node.quantityAvailable}
        onChange={(e) => {
          setQ(parseInt(e.target.value));
        }}
      />
    </form>
  );
}

export default function ProductPageContent({ product }) {
  let vars = product.variants.edges;

  // Chosen variant ID
  const [chosenVariant, setChosenVariant] = useState(vars[0].node.id);
  // Quantity of the chosen variant
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState('');

  useEffect(() => {
    let variantPrice = getCurrentVariantObject(vars, chosenVariant).node.priceV2
      .amount;

    setCost(formatPrice(variantPrice * quantity));
  }, [chosenVariant, quantity, cost]);

  let image = product.images.edges[0].node;

  let handleAddToCart = async () => {
    const localCart = window.localStorage.getItem('astroCartId');

    const body = {
      cartId: localCart || '',
      itemId: chosenVariant,
      quantity: quantity,
    };

    console.log('--- Adding to cart ---', body);

    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' } 
    };

    console.log("options : ", options);

    const cartResponse = await fetch("/api/add-to-cart", options);

    const data = await cartResponse.json();
    const json = JSON.parse(data)

    console.log('--- Adding to cart JSON response ID ---', json.id);

    window.localStorage.setItem('astroCartId', json.id);

    return data;
  };

  return (
    <section className="product-page-content">
      <div>
        <img
          src={image.src}
          alt={image.altText}
          className="product-page-image"
        />
      </div>
      <div className="product-copy">
        <h1>{product.title}</h1>
        <h2>{cost}</h2>
        <p>{product.description}</p>

        <VariantForm
          vars={vars}
          current={chosenVariant}
          pick={setChosenVariant}
          setQ={setQuantity}
        />

        {product.totalInventory > 0 ? (
          <button onClick={handleAddToCart}>Add to Cart</button>
        ) : (
          <button className="disabled" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </section>
  );
}
