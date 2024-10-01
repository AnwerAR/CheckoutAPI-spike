# :warning: Deprecated and Decommissioned :warning:
**This repository is no longer used by any merchant. At the moment we don't support checkoutAPI-spike flow for any checkout merchants. As a matter of fact, it was created as a spike repo.**

# CheckoutAPI Spike
An experimental project

### NPM
    npm install @payoneer/checkout-api
#### CommonJS & ESM

    import { CheckoutAPI } from "@payoneer/checkout-api"
   or

    const CheckoutAPI = require("@payoneer/checkout-api");

### Usage
    const config = {
	    env: "test"
	    listId: <LIST ID HERE>
	};

    const checkout = PayoneerCheckout(config);

#### Update
    checkout.update({ listId: <NEW LIST ID> });
    checkout.updateListId(listId);

  #### Available methods


    dropIn(componentName, options);
    update(options)
    reload();
    destroy();

    // Helpers
    availableNetworks();
    neededDropInComponents();

#### Drop In Component
    const cards = checkout.dropIn("cards", options).mount(document.querySelector("#app"));

#### Available methods on components
    mount(node);
    unmount();
    reload();
    update(options);
    pay();
#### Browser

    <script src="path-to-checkout/checkout-api.js" type="text/javascript"></script>
Note: `Payoneer` object is exposed in global window scope.

    var checkout = Payoneer.CheckoutAPI(config);
