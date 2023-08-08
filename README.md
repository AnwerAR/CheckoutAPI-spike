# CheckoutAPI Spike
An experimental project

### NPM
    npm install @payoneer/checkout-api
#### CommonJS & ESM

    import { CheckoutAPI } from "@payoneer/checkout-api"
   or

    const CheckoutAPI = require("@payoneer/checkout-api");

### Usage
    // Configurations
    const config = {
	    env: "test"
	    listId: <LIST ID HERE>
	};

	// Initialise
    const checkout = PayoneerCheckout(config);

#### Update
    checkout.update({ listId: <NEW LIST ID> });

#### Drop In Component
    const cards = checkout.dropIn("cards").mount(document.querySelector("#app");

#### Unmount Drop In
    cards.unmount();
#### Destroy Checkout instance

    checkout.destroy();

#### Browser

    <script src="path-to-checkout/checkout-api.js" type="text/javascript"></script>
Note: `Payoneer` object is exposed in global window scope.

    var checkout = Payoneer.CheckoutAPI(config);
