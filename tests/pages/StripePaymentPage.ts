import {
  Page,
  expect
} from '@playwright/test';

import { safeClick } from '../helpers/safeClick';

import {
  STRIPE_CARD,
  STRIPE_EXPIRY,
  STRIPE_CVC
} from '../config/testData';

import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';


/* ============================================================================
PAGE OBJECT: StripePaymentPage

Handles Stripe Checkout payment

Methods:
completePayment()

============================================================================ */


export class StripePaymentPage extends BasePage {


constructor(page: Page) {
  super(page);
}



async completePayment() {


Logger.info(
  'Completing Stripe Payment'
);



//
// Wait Stripe Checkout
//

await this.page.waitForURL(
  /checkout.stripe.com/,
  {
    timeout:60000
  }
);


Logger.success(
  'Stripe Checkout Loaded'
);



//
// Wait card field
//

await this.page.locator(
  '#cardNumber'
)
.waitFor(
{
  state:'visible',
  timeout:60000
}
);



Logger.success(
  'Stripe Card Fields Visible'
);





//
// Card Number
//

await this.page.locator(
  '#cardNumber'
)
.fill(
  STRIPE_CARD
);


Logger.success(
  'Card Number Entered'
);





//
// Expiry
//

await this.page.locator(
  '#cardExpiry'
)
.fill(
  STRIPE_EXPIRY
);


Logger.success(
  'Expiry Entered'
);





//
// CVC
//

await this.page.locator(
  '#cardCvc'
)
.fill(
  STRIPE_CVC
);


Logger.success(
  'CVC Entered'
);





//
// Name
//

const name =
this.page.locator(
 '#billingName'
);


if(
 await name.count()
){

await name.fill(
 'Hardik Thanki'
);


Logger.success(
 'Billing Name Entered'
);

}




//
// Country
//

const country =
this.page.locator(
 '#billingCountry'
);


if(
 await country.count()
){


await country.selectOption(
 'IN'
);


Logger.success(
 'Country Selected India'
);

}




//
// Click subscribe/pay
//

const payButton =
this.page.getByRole(
 'button',
 {
   name:/subscribe|pay|complete|start/i
 }
);



await expect(
 payButton
)
.toBeEnabled(
{
 timeout:30000
}
);



await safeClick(
 payButton,
 'Complete Payment'
);



Logger.success(
 'Payment Submitted'
);





//
// Wait result
//

await this.page.waitForTimeout(
10000
);



Logger.url(
 this.page.url()
);





//
// Optional success message
//

const successToast =
this.page.getByText(
/payment successful/i
);

if(await successToast.count()) {

  await expect(successToast)
  .toBeVisible({
    timeout:10000
  });

  Logger.success(
    'Payment Success Message Displayed'
  );

}





Logger.celebration(
 'Payment Completed'
);



}



}