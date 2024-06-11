export const cart = [];

// Fonction pour ajouter un produit au panier
export function addToCart(productId) {
    let foundItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            foundItem = cartItem;
        }
    });

    if (foundItem) {
        foundItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }
}