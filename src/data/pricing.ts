/**
 * Every number the site quotes for the subscription product.
 *
 * Terms and reasoning live in docs/business-model.md — this file is only the
 * figures, so that changing a price is a one-line edit rather than a hunt
 * through page copy. Anything derivable (e.g. the twelve-month total) is
 * computed at the call site from `monthly`, never written out as its own
 * literal.
 */
export const PRICING = {
	monthly: 180,
	termMonths: 12,
	extraPage: 100,
};

/**
 * Whole-dollar USD, with thousands separators — `$150`, `$1,800`, `$5,400`.
 * Both fraction-digit bounds are set explicitly: the currency default is two
 * decimals, and pinning only the maximum leaves the result engine-dependent.
 */
export function usd(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}
