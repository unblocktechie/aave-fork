import { Box } from "@mui/material";
import React from "react";
import { Link } from "src/components/primitives/Link";
import { unFeredalReserveLinks } from "../constants";

const UnFeredalReserveLinks = () => {
	return (
		<Box>
			<Box
				component={"h3"}
				sx={{
					fontFamily: "Poppins",
					fontWeight: 600,
					fontSize: "12px",
					lineHeight: "20.4px",
					letterSpacing: "0.045em",
					color: "#69728E",
					marginBottom: "21px",
				}}
			>
				unFeredalReserve
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "11px",
				}}
			>
				{unFeredalReserveLinks.map(({ id, linkName, linkUrl }) => (
					<Link
						key={id}
						href={linkUrl}
						sx={{
							fontFamily: "Poppins",
							fontSize: "12px",
							lineHeight: "20.4px",
							letterSpacing: "0.045em",
							color: "white",
						}}
					>
						{linkName}
					</Link>
				))}
			</Box>
		</Box>
	);
};

export default UnFeredalReserveLinks;
