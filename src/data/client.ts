import { PRICING, usd } from "./pricing";

export const SITE = {
	title: "Green Cove Digital",
	description: `Custom small business websites, built remotely for businesses across the US — ${usd(PRICING.monthly)}/month, $0 down, everything included.`,
	url: "https://greencovedigital.com",
	author: "Kevin Rocker",
	locale: "en",
};

export const BUSINESS = {
	name: "Green Cove Digital",
	email: "me@kevinrocker.com",
	logo: "/favicon.svg",
	/** The LLC's legal name. Its registered address is not published anywhere. */
	legalName: "Green Cove Digital LLC",
	/**
	 * Green Cove has no physical location and no local service area — see
	 * docs/content-strategy.md, "The location problem". This is the only
	 * geography the site claims, and it goes in JSON-LD `areaServed`.
	 */
	areaServed: "US",
};

export const PERSON = {
	firstName: "Kevin",
	fullName: "Kevin Rocker",
	jobTitle: "Founder & Software Engineer",
	/** Where Kevin grew up — an about-page line, not a business location. */
	hometown: "Charlotte, NC",
};

export const OG = {
	locale: "en_US",
	image: "/assets/social.jpg",
};
