import { loadScript, logger } from "helpers";
import { CheckoutConfiguration, DropInComponentConfig, Env } from "types";

export default function DropInComponent(
	name: string,
	options: CheckoutConfiguration & Partial<DropInComponentConfig>,
	env: Env,
) {
	let newOptions: CheckoutConfiguration & Partial<DropInComponentConfig>;
	let element: HTMLElement;
	let parentNode: HTMLElement;

	function updateOptions(
		updatedOptions: CheckoutConfiguration & Partial<DropInComponentConfig>,
	): void {
		// eslint-disable-next-line no-underscore-dangle
		const _newOptions: CheckoutConfiguration & Partial<DropInComponentConfig> = {
			...options,
			...updatedOptions,
		};

		if (_newOptions?.listId) {
			logger.log(`${name}: Updating options`);
			element.setAttribute("listurl", env.buildListURL(_newOptions?.listId));
		}

		newOptions = _newOptions;
		logger.log(`${name}: Updated...`, newOptions);
	}

	const initialise = async () => {
		element = document.createElement(name);

		const script = await loadScript(env.buildCDNLink(name), name);

		// logger.log({ script });

		if (!script.isLoaded) throw new Error("Initialisation failed.");
		logger.log(`${name}: CDN script injected to DOM head with an id of #${name}-script`);

		element.id = `${name}-component`;

		updateOptions(options);
		logger.log(`${name}: Initialised...`);
	};

	/**
	 * Initialise drop-in-component
	 */
	initialise();

	return {
		mount(node: HTMLElement) {
			logger.log(`${name}: mounting to DOM`);
			node.appendChild(element);
			parentNode = node;
			logger.log(`${name}: mounted to #${node.id}`);
			return this;
		},
		unmount() {
			// TODO: clear all events as well.
			logger.log(`${name}: unmounting from DOM`);
			parentNode.innerHTML = "";
			logger.log(`${name}: unmounted`);
			return this;
		},
		update(opt: CheckoutConfiguration | undefined): void {
			if (opt) updateOptions(opt);
		},
		reload() {
			logger.log(`${name}: Reloading...`);
			initialise();
		},
		pay() {
			logger.log(`${name}: Making payment...`);
			// TODO: implement pay method.
			// Check if pay button is hidden from given drop in component.
			logger.log(`${name}: Payment instruction sent`);
		},
	};
}
