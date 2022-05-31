/**
 * API Endpoint
 *
 * * Purpose: Get items from an existing cart
 * @param {string} cartId
 *
 * Example:
 *```
 * fetch('/.netlify/functions/get-cart', {
 *   method: 'POST',
 *   body: JSON.stringify({ cartId: '12345' })
 * })
 * ```
 *
 * ! POST method is intentional for future enhancement
 *
 * TODO: Add enhancement for pagination
 */

 import postToShopify from './utils/postToShopify.js';

 export default async (request, context) => {

  const res = new Response(request.body)
  const json = await res.json()

  const  cartId  = json.cartId;

  try {
    console.log("--------------------------------");
    console.log("Retrieving existing cart...");
    console.log("--------------------------------");
    const shopifyResponse = await postToShopify({
      query: `
         query getCart($cartId: ID!) {
           cart(id: $cartId) {
             id
             lines(first: 10) {
               edges {
                 node {
                   id
                   quantity
                   merchandise {
                     ... on ProductVariant {
                       id
                       title
                       priceV2 {
                         amount
                         currencyCode
                       }
                       product {
                         title
                         handle
                         images(first: 1) {
                           edges {
                             node {
                               src
                               altText
                             }
                           }
                         }
                       }
                     }
                   }
                 }
               }
             }
             estimatedCost {
               totalAmount {
                 amount
                 currencyCode
               }
               subtotalAmount {
                 amount
                 currencyCode
               }
               totalTaxAmount {
                 amount
                 currencyCode
               }
               totalDutyAmount {
                 amount
                 currencyCode
               }
             }
           }
         }
       `,
      variables: {
        cartId,
      },
    });

    return context.json(JSON.stringify(shopifyResponse));
  } catch (error) {
    console.log(error);
  }
};
