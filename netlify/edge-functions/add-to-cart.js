/**
 * Add to Cart API Endpoint
 *
 * * Purpose: Add a single item to the cart
 * @param {string} cartId (Optional)
 * @param {string} itemId - Usually it's the product variant id
 * @param {number} quantity - Minimum 1
 *
 * @returns {object} cart that contains lines of items inside
 * See './utils/createCartWithItem' for the data structure
 *
 * Examples:
 *
 * If a cart does not exist yet,
 * ```
 * fetch('/.netlify/functions/add-to-cart', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     cardId: '', // cardId can also be omitted if desired
 *     itemId: 'Z2lkOi8vc2hvcGlmFyaWFudC8zOTc0NDEyMDEyNzY5NA==',
 *     quantity: 4
 *   })
 * })
 * ```
 *
 * Add item to an existing cart
 * ```
 * fetch('/.netlify/functions/add-to-cart', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     cartId: 'S9Qcm9kdWN0VmFyaWFudC8zOTc0NDEyMDEyNzY5NA',
 *     itemId: 'Z2lkOi8vc2hvcGlmFyaWFudC8zOTc0NDEyMDEyNzY5NA==',
 *     quantity: 4
 *   })
 * })
 * ```
 */
import createCartWithItem from './utils/createCartWithItem.js';
import addItemToCart from './utils/addItemToCart.js';


export default async (request, context) => {
  
  const res = new Response(request.body)
  const json = await res.json()

  const { cartId, itemId, quantity } = json

  console.log('json', json)
  // const cartId = body.get("cartId")
  // const itemId  = body.get("itemId")
  // const quantity = body.get("quantity")
  

  if (cartId && cartId !== "undefined") {
    console.log('--------------------------------')
    console.log('Adding item to existing cart...')
    console.log('--------------------------------')

    const shopifyResponse = await addItemToCart({
      cartId,
      itemId,
      quantity,
    })
    return context.json(JSON.stringify(shopifyResponse.cartLinesAdd.cart));
  } else {
    console.log('--------------------------------')
    console.log('Creating new cart with item...')
    console.log('--------------------------------')
    const createCartResponse = await createCartWithItem({
      itemId,
      quantity,
    })
    console.log('--------------------------------')
    console.log(JSON.stringify(createCartResponse.cartCreate.cart))
    console.log('--------------------------------')
    return context.json(JSON.stringify(createCartResponse.cartCreate.cart));
  }
}
