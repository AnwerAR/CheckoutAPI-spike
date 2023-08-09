/* eslint-disable no-unused-vars */

export type CheckoutConfiguration = {
	listId: string;
	env: "test" | "live" | string;
};

export type DropInComponentConfig = {
	primaryColor: string;
	primaryTextColor: string;
	hidePayButton: boolean;
};

export interface Env {
	buildListURL(listId: string): string;
	buildCDNLink(listId: string): string;
	getEnvName(): string;
}

export interface DropInComponentInstance {
	mount(node: HTMLElement | string): DropInComponentInstance;
	unmount(): DropInComponentInstance;
	update(updatedOptions: CheckoutConfiguration | undefined): void;
	reload(): void;
	pay(): void;
}
