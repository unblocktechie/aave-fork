import { Box, useMediaQuery } from "@mui/material";
import React from "react";

import HomeSectionButton from "./ui/HomeSectionButton";
import JoinDiscordLink from "./ui/JoinDiscordLink";

const HomeSectionHeader = () => {
	const smallBreakpoint = useMediaQuery("(max-width: 760px)");

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: { xs: "15px", md: "24px" },
				width: "100%",
				height: "100%",
			}}
		>
			<Box
				component="p"
				sx={{
					fontFamily: "Philosopher",
					fontWeight: 400,
					letterSpacing: "0.045em",
					color: "#5C6580",
					fontSize: { xs: "18px", md: "25px" },
					margin: 0,
				}}
			>
				{smallBreakpoint
					? "Welcome to Safe Harbor"
					: "Welcome to DeFi Democratized"}
			</Box>
			<Box
				component={"h1"}
				sx={{
					fontFamily: "Philosopher",
					fontWeight: 700,
					fontSize: { xs: "50px", md: "95px" },
					lineHeight: { xs: "50px", md: "123.5px" },
					letterSpacing: "0.01em",
					color: "white",
					margin: 0,
				}}
			>
				ReserveDAO
			</Box>
			{!smallBreakpoint && <HomeSectionButton />}

			{smallBreakpoint && (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: "21px",
					}}
				>
					<JoinDiscordLink />
					<Box
						component={"p"}
						sx={{
							fontFamily: "Poppins",
							fontSize: "14px",
							lineHeight: "23.8px",
							letterSpacing: "0.045em",
							color: "#5C6580",

							margin: 0,
							padding: 0,
						}}
					>
						App: Comming Soon
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default HomeSectionHeader;
