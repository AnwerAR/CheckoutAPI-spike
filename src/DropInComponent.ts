import { loadScript, logger } from "helpers";
import { CheckoutConfiguration, Env } from "types";

export default function DropInComponent(name: string, options: CheckoutConfiguration, env: Env) {
	let element: HTMLElement;
	let parentNode: HTMLElement;

	function updateOptions(updatedOptions: CheckoutConfiguration): void {
		logger.log({ updatedOptions }, "updated", updatedOptions?.listId);
		if (updatedOptions?.listId) {
			element.setAttribute("listurl", env.buildListURL(updatedOptions?.listId));
		}
	}

	const initialise = async () => {
		element = document.createElement(name);

		const script = await loadScript(env.buildCDNLink(name), name);
		// logger.log({ script });

		if (!script.isLoaded) throw new Error("Initialisation failed.");

		element.id = `${name}-component`;

		updateOptions(options);
		logger.log("Scripts loaded and element is created");
	};

	// Init
	initialise();

	return {
		mount(node: HTMLElement) {
			node.appendChild(element);
			parentNode = node;
			return this;
		},
		unmount() {
			// TODO: clear all events as well.
			parentNode.innerHTML = "";
			return this;
		},
		update(opt: CheckoutConfiguration | undefined): void {
			if (opt) updateOptions(opt);
		},
		reload() {
			initialise();
		},
	};
}
