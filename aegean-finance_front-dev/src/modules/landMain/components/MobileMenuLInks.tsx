import { Box } from "@mui/material";
import React from "react";
import { Link } from "src/components/primitives/Link";
import { mobileLinks } from "../constants";

const MobileMenuLInks = () => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "25px",
				paddingLeft: "17px",
			}}
		>
			{mobileLinks.map(({ id, linkName, linkUrl }) => (
				<Link
					key={id}
					href={linkUrl}
					sx={{
						fontFamily: "Poppins",
						fontSize: "18px",
						lineHeight: "31px",
						letterSpacing: "0.045em",
						color: "white",
					}}
				>
					{linkName}
				</Link>
			))}
		</Box>
	);
};

export default MobileMenuLInks;
