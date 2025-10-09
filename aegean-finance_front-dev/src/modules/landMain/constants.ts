import type { StaticImageData } from "next/image";
import reverseFundingBlue from "../../assets/landingMain/reverse-funding-blue.png";
import reverseLandingBlue from "../../assets/landingMain/reverse-landing-blue.png";
import unfederalReverseBlue from "../../assets/landingMain/unfederal-reverse-blue.png";

type LabelType = {
	id: number;
	labelIcon: StaticImageData;
	width: string;
	height: string;
};

export const socialsLinks = [
	{
		id: 0,
		name: "Join the discord",
		href: "#",
	},
	{
		id: 1,
		name: "Join the Telegram",
		href: "#",
	},
	{
		id: 2,
		name: "Follow our twitter",
		href: "#",
	},
];

export const stakes = [
	{
		id: 0,
		heading: "$RSRV",
		description:
			"Stake $rsrv and receive a guaranteed percentage based on lock up time-period",
	},
	{
		id: 1,
		heading: "LP`s",
		description: "Stake ETH/eRSDL or ETH/RSRV LP's for maximum rewards",
	},
	{
		id: 0,
		heading: "$eRSDL/$RSRV",
		description:
			"Purchase $eRSDL or $RSRV bonds to play one of the most innovative long games",
	},
];

export const columnsInfo = [
	{
		id: 0,
		name: "ReserveLending",
		image: "/columnImage.png",
		headingIcon: "/firstColumnHeadingIcon.svg",
		description:
			"ReserveLending™ is one of the leading protocols for lending and borrowing in the DeFi space. As an asset-liability in the DeFi space. As an asset-liability DeFi lending tool and fork of Compound™",
	},
	{
		id: 1,
		name: "ReserveFunding",
		image: "/columnImage.png",
		headingIcon: "/secondColumnHeadingIcon.svg",
		description:
			"ReserveFunding is a fund of fund that allows crypto holders to provide cash to non-bank lenders leveraging SaaS and traditional financial service rails",
	},
];

export const landingContainerStyles = {
	maxWidth: "calc(900px + 2rem)",
	width: "100%",
	px: "16px",
	margin: "0 auto",
};

export const landingButtonStyles = {
	backgroundColor: "#040A1E",
	width: "190px",
	height: "49px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: "15px",
	border: "2px solid #4C5983",
	color: "#fff",
	fontSize: "14px",
	lineHeight: "24px",
	letterSpacing: "0.045em",
};

export const labelImages: LabelType[] = [
	{
		id: 1,
		labelIcon: reverseLandingBlue,
		width: "247px",
		height: "48px",
	},

	{
		id: 2,
		labelIcon: reverseFundingBlue,
		width: "176px",
		height: "42px",
	},

	{
		id: 3,
		labelIcon: unfederalReverseBlue,
		width: "273px",
		height: "36px",
	},
];

export const unFeredalReserveLinks = [
	{
		id: 1,
		linkName: "ReserveLending",
		linkUrl: "#",
	},
	{
		id: 2,
		linkName: "ReserveFunding",
		linkUrl: "#",
	},
	{
		id: 3,
		linkName: "unFederalReserve",
		linkUrl: "#",
	},
];

export const resourcesLinks = [
	{
		id: 1,
		linkName: "Docs",
		linkUrl: "#",
	},
	{
		id: 2,
		linkName: "Medium",
		linkUrl: "#",
	},
];
export const mobileLinks = [
	{
		id: 1,
		linkName: "Medium",
		linkUrl: "#",
	},
	{
		id: 2,
		linkName: "Early Access",
		linkUrl: "#",
	},
	{
		id: 3,
		linkName: "Join The Discord",
		linkUrl: "#",
	},
];
