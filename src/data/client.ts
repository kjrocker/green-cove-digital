import { PRICING, usd } from "./pricing";

export const SITE = {
	title: "Green Cove Digital",
	description: `Custom small business websites from Charlotte, NC — ${usd(PRICING.monthly)}/month, $0 down, everything included.`,
	url: "https://greencovedigital.com",
	author: "Kevin Rocker",
	locale: "en",
};

export const BUSINESS = {
	name: "Green Cove Digital",
	email: "me@kevinrocker.com",
	logo: "/favicon.svg",
	address: {
		city: "Charlotte",
		state: "NC",
	},
};

export const PERSON = {
	firstName: "Kevin",
	fullName: "Kevin Rocker",
	jobTitle: "Founder & Software Engineer",
};

export const OG = {
	locale: "en_US",
	image: "/assets/social.jpg",
};
