import { CheckoutConfiguration, Env } from "types";

export function validateConfig(config: CheckoutConfiguration) {
	// TODO: extend validator and return appropirate messages
	if (!config || typeof config !== "object") return false;
	if (!config.listId) return false;

	return true;
}

export const logger = console;

// Sub domains
// 1. resources
// 2. api
export function prepareEnv(env: string): Env {
	const BASE_URL = "https://<entity>.<env>.oscato.com";
	let baseURL: string | undefined;
	switch (env) {
		case "test":
			baseURL = BASE_URL.replace("<env>", "sandbox");
			break;
		case "live":
			baseURL = BASE_URL.replace("<env>", "live");
			break;
		default:
			baseURL = BASE_URL.replace("<env>", env);
			break;
	}

	return {
		buildListURL(listId: string) {
			return `${baseURL?.replace("<entity>", "api")}/pci/v1/${listId}`;
		},
		buildCDNLink(componentName: string) {
			return `${baseURL?.replace(
				"<entity>",
				"resources",
			)}/web/libraries/checkout-web-sdk/${componentName}/${componentName}.js`;
		},
		getEnvName() {
			return env;
		},
	};
}

export function apiRequest(endpoint: string, options?: RequestInit): Promise<Response> {
	return fetch(endpoint, options);
}

export async function getList<T, E>(listUrl: string): Promise<{ data: T | null; error: E | null }> {
	try {
		const response = await apiRequest(listUrl, { method: "GET" });
		const data = await response.json();
		const { code, reason } = data.interaction;

		if (code === "PROCEED" && reason === "OK") {
			return { data, error: null };
		}

		return { data: null, error: data };
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return { data: null, error };
	}
}

export function loadScript(
	link: string,
	name: string,
): Promise<{ name: string; isLoaded: boolean }> | { name: string; isLoaded: boolean } {
	if (!link) {
		throw new Error("No script link");
	}

	if (document.getElementById(`${name}-script`)) {
		return { name, isLoaded: true };
	}

	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = link;
		script.id = `${name}-script`;
		document.head.appendChild(script);

		script.onload = () => {
			resolve({ name, isLoaded: true });
		};

		script.onerror = () => {
			reject(new Error(`Error loading ${name} module from ${link}`));
		};
	});
}
