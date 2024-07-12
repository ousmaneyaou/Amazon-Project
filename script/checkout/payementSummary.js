import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../Utils/money.js";



export function renderPayementSummary(){
    //les trois etapes comme dab
    // 1- save the date
    let productpriceCents = 0;
    let ShippingPriceCents = 0;
    let totalItems = 0; // Nouveau : pour stocker le nombre total d'articles

    // Parcourir les articles dans le panier
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId)
        productpriceCents += product.priceCents * cartItem.quantity
        totalItems += cartItem.quantity; // Nouveau : additionner les quantités des articles


        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        ShippingPriceCents += deliveryOption.priceCents
    });
    
    // Calcul des totaux
    const totalBeforeTaxCents = productpriceCents + ShippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.19;
    const totalCents = productpriceCents + taxCents;

    
    // 2- Generate the html

    const payementSummaryHTML = `

    <div class="payment-summary-title">
        Résumé de la commande
          </div>

          <div class="payment-summary-row">
            <div>Items (${totalItems}):</div>
            <div class="payment-summary-money">$${formatCurrency(productpriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Frais d'expédition:</div>
            <div class="payment-summary-money">$${formatCurrency(ShippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total avant taxes:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Taxe estimée (19%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Total de la commande :</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary" id="place-order-button">
            Passez votre commande
        </button>
      
    `;
   
    document.querySelector('.js-payment-summary')
    .innerHTML = payementSummaryHTML;
    // 3- make it interactive

    // Redirection vers payement.html sans rafraîchissement de la page
    document.getElementById('place-order-button').addEventListener('click', () => {
        window.location.href = 'payement.html';
    });
    
}