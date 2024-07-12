import { cart, removeFromCart, updateDeliveryOption, updateCartQuantity } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../Utils/money.js';
import { renderPayementSummary } from './payementSummary.js';

// Utilisation de dayjs
const today = dayjs();
const deliveryDate = today.add(7, 'days');
const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');

export function renderOrderSummary() {
    // Initialisation de la variable pour contenir le HTML généré
    let cartSummaryHTML = '';

    // Parcours des articles dans le panier
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        // Trouver le produit correspondant
        let matchingProduct = getProduct(productId);

        // Vérifier si le produit correspondant est trouvé
        if (matchingProduct) {
            const deliveryOptionId = cartItem.deliveryOptionId || '1'; // Utiliser une valeur par défaut si non définie


            const deliveryOption = getDeliveryOption(deliveryOptionId);

            

            // Vérifier si l'option de livraison est trouvée avant d'accéder à deliveryDate
            if (deliveryOption) {
                const today = dayjs();
                const deliveryDate = today.add(deliveryOption.deliveryDate, 'days'); // Correction ici
                const dateString = deliveryDate.format('dddd, MMMM D');

                // Générer le HTML pour chaque article dans le panier
                cartSummaryHTML += `
                    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                        <div class="delivery-date">
                        Date de livraison: ${dateString}
                        </div>

                        <div class="cart-item-details-grid">
                            <img class="product-image" src="${matchingProduct.image}">

                            <div class="cart-item-details">
                                <div class="product-name">
                                    ${matchingProduct.name}
                                </div>
                                <div class="product-price">
                                    $${(matchingProduct.priceCents / 100).toFixed(2)}
                                </div>
                                <div class="product-quantity">
                                    <span>
                                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                                    </span>
                                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                                        Update
                                    </span>
                                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                                        Delete
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        TotalCart: <span class="totalcart-label">
                                        ${(cartItem.quantity * (matchingProduct.priceCents / 100)).toFixed(2)}</span>
                                    </span>
                                </div>
                            </div>

                            <div class="delivery-options">
                                <div class="delivery-options-title">
                                Choisir une option de livraison:
                                </div>
                                
                                ${deliveryOptionHTML(matchingProduct, cartItem)}
                                
                                <div>
                                    <span>
                                        DeliveryPrice: <span class="totalcart-label">${deliveryOptionId}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                console.error(`Delivery option with id ${deliveryOptionId} not found for product id ${productId}`);
            }
        } else {
            console.error(`Product with id ${productId} not found`);
        }
    });

    // Fonction pour générer le HTML des options de livraison
    function deliveryOptionHTML(matchingProduct, cartItem) {
        let html = '';

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDate, 'days'); // Correction ici
            const dateString = deliveryDate.format('dddd, MMMM D');
            const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
                <div class="delivery-option js-delivery-option"
                     data-product-id="${matchingProduct.id}"
                     data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio" ${isChecked ? 'checked' : ''}
                           class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} Shipping
                        </div>
                    </div>
                </div>
            `;
        });
        return html;
    }

    // Insérer le HTML généré dans l'élément du DOM
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    // Pour la suppression
    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            if (container) {
                container.remove();
                renderPayementSummary();
            }
        });
    });

    // Pour la mise à jour
    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const quantityLabel = document.querySelector(`.js-cart-item-container-${productId} .quantity-label`);
            const currentQuantity = parseInt(quantityLabel.textContent, 10);
            const newQuantity = prompt("Enter new quantity:", currentQuantity);
            if (newQuantity !== null && !isNaN(newQuantity) && newQuantity > 0) {
                updateCartQuantity(productId, parseInt(newQuantity, 10));
                renderOrderSummary();
                renderPayementSummary();
            }
        });
    });
    // Livraison
    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const { productId, deliveryOptionId } = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                renderPayementSummary();
            });
        });
}
