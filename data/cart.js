export let cart = JSON.parse(localStorage.getItem('cart'));

// On donne une valeur par défaut au panier pour éviter qu'il soit null
if (!cart) {
    cart = [
        {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
            deliveryOptionId: '1'
        },
        {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
            deliveryOptionId: '2'
        }
    ];
} else {
    // Mise à jour pour s'assurer que toutes les entrées ont un deliveryOptionId correct
    cart = cart.map(item => {
        if (!item.deliveryOptionId) {
            item.deliveryOptionId = '1'; // Valeur par défaut ou une logique pour définir une valeur correcte
        }
        return item;
    });
    saveToStorage();
}

// Empêcher les produits de revenir après rafraîchissement
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

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
            quantity: 1,
            deliveryOptionId: '1'
        });
    }
    saveToStorage();
}

// Fonction pour supprimer un produit du panier
export function removeFromCart(productId) {
    const newCart = [];  // étape 1 : création d'un nouveau tableau

    cart.forEach((cartItem) => {  // étape 2 : on parcourt le tableau
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    saveToStorage();
}

// Fonction pour la mise à jour du produit au panier
export function updateFromCart(productId) {
    const newCart = [];  // étape 1 : création d'un nouveau tableau

    cart.forEach((cartItem) => {  // étape 2 : on parcourt le tableau
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    saveToStorage();
}
