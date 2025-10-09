import { Box, Grid } from "@mui/material";
import React from "react";
import AnchorHeader from "src/assets/svgComponents/landingMain/AnchorHeader";
import HeaderLogo from "src/assets/svgComponents/landingMain/HeaderLogo";
import { Link } from "src/components/primitives/Link";
import ellipseGroup from "./../../assets/landingMain/ellipse-group-footer.png";
import CommunityLinks from "./components/CommunityLinks";
import ResourcesLinks from "./components/ResourcesLinks";
import UnFeredalReserveLinks from "./components/UnFeredalReserveLinks";

const LandingFooter = () => {
	return (
		<Box
			component={"footer"}
			sx={{
				position: "relative",
				width: "100%",
				pb: { xs: "50px", sm: 0 },
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					display: { xs: "block", sm: "none" },
					right: 0,
					left: 0,
					mx: "auto",
					bot: 0,
					width: "100%",
					height: "100%",
					backgroundImage: `url(${ellipseGroup.src})`,
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
				}}
			/>
			<Box
				sx={{
					display: "flex",
					width: "100%",
					marginBottom: "26px",
					paddingInline: { xs: "39px", sm: "0" },
				}}
			>
				<Box
					sx={{
						flex: 1,
						display: { xs: "none", sm: "block" },
					}}
				>
					<Link href="/">
						<Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
							<AnchorHeader />
							<HeaderLogo />
						</Box>
					</Link>
				</Box>
				<Grid
					container
					columns={{ xs: 2, md: 3 }}
					sx={{
						flex: 1,
						width: "100%",
						zIndex: 5,
					}}
				>
					<Grid item xs={1}>
						<CommunityLinks />
					</Grid>
					<Grid item xs={1}>
						<UnFeredalReserveLinks />
					</Grid>
					<Grid item xs={1}>
						<ResourcesLinks />
					</Grid>
				</Grid>
			</Box>
			<Box
				sx={{
					display: { xs: "block", sm: "none" },
					paddingInline: "16px",
					mb: "50px",
				}}
			>
				<Box
					sx={{
						mb: "10px",
					}}
				>
					<HeaderLogo />
				</Box>
				<Box
					component={"p"}
					sx={{
						fontFamily: "Overlock SC",
						fontWeight: 400,
						fontSize: "14px",
						lineHeight: "23.8px",
						letterSpacing: "0.045em",
						color: "#69728E",
					}}
				>
					The UNFED end goal is connection and stability. Our current goal is to
					immediately provide liquidity for the Res
				</Box>
			</Box>
			<Box
				sx={{
					fontFamily: "Poppins",
					fontSize: "14px",
					lineHeight: "20.4px",
					letterSpacing: "0.045em",
					color: "white",
					margin: 0,
					paddingLeft: { xs: "16px", sm: 0 },
				}}
			>
				© 2022 ReserveDAO. All rights reserved.
			</Box>
		</Box>
	);
};

export default LandingFooter;
