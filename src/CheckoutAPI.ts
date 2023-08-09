import { CheckoutConfiguration, DropInComponentConfig, DropInComponentInstance, Env } from "types";
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

	function handleDropIn(
		component: string,
		opts: CheckoutConfiguration & Partial<DropInComponentConfig>,
		env: Env,
	) {
		elements[component] = DropInComponent(
			component,
			opts,
			env,
		) as unknown as DropInComponentInstance;
		return elements[component];
	}

	// Initialise.
	if (options) {
		logger.log("Checkout Instance: Initialising...");
		initialise(options);
	}

	return {
		dropIn(
			component: keyof typeof DROP_IN_COMPONENTS,
			componentOptions: DropInComponentConfig,
		) {
			// Invalid component
			if (!(component in DROP_IN_COMPONENTS)) {
				throw new Error("Invalid component");
			}

			logger.log(`${DROP_IN_COMPONENTS[component]}: Initialising...`);

			// Invalid or no configuration
			if (!store.options) throw new Error("No config!");

			return handleDropIn(
				DROP_IN_COMPONENTS[component],
				{ ...store.options, ...componentOptions },
				store.environment,
			);
		},
		update(opt: CheckoutConfiguration) {
			if (!opt || typeof opt !== "object") throw new Error("Invalid configuration!");

			logger.log("Checkout Instance: Updating...");

			const updatedStore = initialise({ ...store.options, ...opt });

			if (updatedStore.options) {
				Object.keys(elements).forEach((sere) => {
					elements[sere].update(updatedStore.options);
				});
			}
		},
		destroy() {
			logger.log("Checkout Instance: Destroying...");

			// Unmount all registered drop-in-components
			Object.keys(elements).forEach((el) => {
				elements[el].unmount();
			});

			// Clear store data
			store.options = {} as CheckoutConfiguration;
			logger.log("Checkout Instance: Destroyed...");
		},
		reload() {
			logger.log("Checkout Instance: Reloading...");
			// TODO: reload list data from OPG.
			if (elements && Object.keys(elements).length > 0) {
				Object.keys(elements).forEach((el) => {
					elements[el].reload();
				});
			}
		},
		updateListId(listId: string) {
			if (!listId) throw new Error("List id is required");
			if (typeof listId !== "string") throw new Error("Invalid list id");
			this.update({ ...store.options, listId } as CheckoutConfiguration);
		},
	};
}
