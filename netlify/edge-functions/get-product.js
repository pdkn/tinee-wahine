/**
 * Get Product API Endpoint
 *
 * * Purpose: Retrieve data on a specific product
 * @param {string} itemHandle - kebab-cased-product-name
 *
 * Example:
 * ```
 * fetch('/.netlify/functions/get-product', {
 *   method: 'POST',
 *   body: JSON.stringify({ itemHandle: 'my-product' })
 * })
 * ```
 */

 import postToShopify from './utils/postToShopify.js';

 export default async (request, context) => {
  const { itemHandle } = JSON.parse(request.body)

  try {
    console.log('--------------------------------')
    console.log('Retrieving product details...')
    console.log('--------------------------------')
    const shopifyResponse = await postToShopify({
      query: `
        query getProduct($handle: String!) {
          productByHandle(handle: $handle) {
            id
            handle
            description
            title
            totalInventory
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  quantityAvailable
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
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
      `,
      variables: {
        handle: itemHandle,
      },
    })

    return context.json(JSON.stringify(shopifyResponse));
  } catch (error) {
    console.log(error)
  }
}
