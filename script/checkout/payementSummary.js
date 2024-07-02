import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../Utils/money.js";


export function renderPayementSummary(){
    //les trois etapes comme dab
    // 1- save the date
    let productpriceCents = 0;
    let ShippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId)
        productpriceCents += product.priceCents * cartItem.quantity

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        ShippingPriceCents += deliveryOption.priceCents
    });
    
    const totalBeforeTaxCents = productpriceCents * ShippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.19;
    const totalCents = taxCents + totalBeforeTaxCents;
    // 2- Generate the html


    const payementSummaryHTML = `

    <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatCurrency(productpriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(ShippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (19%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
    `;
    document.querySelector('.js-payment-summary')
    .innerHTML.payementSummaryHTML;
    // 3- make it interactive
}