/* eslint-disable no-unused-vars */

export type CheckoutConfiguration = {
	listId: string;
	env: "test" | "live" | string;
};

export type DropInComponentConfig = {
	name: string;
};

export interface Env {
	buildListURL(listId: string): string;
	buildCDNLink(listId: string): string;
	getEnvName(): string;
}

export type DropInComponentProps<T> = {
	name: T;
	options: CheckoutConfiguration;
};

export interface DropInComponentInstance {
	mount(node: HTMLElement | string): DropInComponentInstance;
	unmount(): DropInComponentInstance;
	update(updatedOptions: CheckoutConfiguration | undefined): void;
}
