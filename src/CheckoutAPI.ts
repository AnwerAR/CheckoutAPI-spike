import { CheckoutConfiguration, DropInComponentInstance, Env } from "types";
import DropInComponent from "DropInComponent";
import { logger, prepareEnv } from "helpers";

export const DROP_IN_COMPONENTS = Object.freeze({
	cards: "cards-component",
	lightbox: "lightbox-component",
});

export default function CheckoutAPI(options?: CheckoutConfiguration) {
	/**
	 * Configurations
	 */
	const store: {
		options: CheckoutConfiguration | undefined;
		environment: Env;
	} = {
		options: options || undefined,
		environment: prepareEnv(options?.env || "test"),
	};

	/**
	 * Active elements
	 * @param {array<CheckoutConfiguration>} elements - elements
	 */
	const elements: { [index: string]: DropInComponentInstance } = {};

	function initialise(data: CheckoutConfiguration) {
		// Set store data.
		store.options = data;
		// Set environment
		store.environment = prepareEnv(data.env || "test");

		// Do more side effects here. eg: fetch list from OPG

		return store;
	}

	function handleDropIn(component: string, opts: CheckoutConfiguration, env: Env) {
		elements[component] = DropInComponent(
			component,
			opts,
			env,
		) as unknown as DropInComponentInstance;
		return elements[component];
	}

	// Initialise.
	if (options) {
		initialise(options);
	}

	return {
		dropIn(component: keyof typeof DROP_IN_COMPONENTS) {
			// Invalid component
			if (!(component in DROP_IN_COMPONENTS)) {
				throw new Error("Invalid component");
			}

			// Invalid or no configuration
			if (!store.options) throw new Error("No config!");

			return handleDropIn(DROP_IN_COMPONENTS[component], store.options, store.environment);
		},
		update(opt: CheckoutConfiguration) {
			if (!opt || typeof opt !== "object") throw new Error("Invalid configuration!");

			const updatedStore = initialise({ ...store.options, ...opt });

			if (updatedStore.options) {
				Object.keys(elements).forEach((sere) => {
					elements[sere].update(updatedStore.options);
				});
			}

			logger.log("List id updated", updatedStore);
		},
		destroy() {
			// Unmount all registered drop-in-components
			Object.keys(elements).forEach((sere) => {
				elements[sere].unmount();
			});

			// Clear store data
			store.options = {} as CheckoutConfiguration;
		},
	};
}
