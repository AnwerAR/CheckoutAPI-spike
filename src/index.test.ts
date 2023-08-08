import { CheckoutAPI } from "./index";

describe("index.ts", () => {
	test("CheckoutAPI is defined", () => {
		expect(typeof CheckoutAPI).toBe("function");
	});
});
