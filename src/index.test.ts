import { CheckoutAPI } from "./index";

describe("index.ts", () => {
	test("Should return appropirate networkCode response", () => {
		expect(typeof CheckoutAPI).toBe("function");
	});
});
