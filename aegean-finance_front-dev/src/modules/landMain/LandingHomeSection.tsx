import { Box, useMediaQuery } from "@mui/material";
import ellipse from "./../../assets/landingMain/home-elipse-mb.png";
import mainWheel from "./../../assets/landingMain/main-image.png";
import bgWheel from "./../../assets/landingMain/wheel-bg.png";
import HomeSectionHeader from "./components/HomeSectionHeader";

export const LandingHomeSection = () => {
	const smallBreakpoint = useMediaQuery("(max-width: 760px)");

	return (
		<Box
			sx={{
				maxWidth: "1110px",
				paddingInline: { sm: "48px", md: "96px", lg: 0 },
				mx: "auto",
			}}
		>
			<Box
				sx={{
					position: "relative",
					width: "100%",
					marginBottom: { xs: "34px", md: "203px" },
					display: "flex",
					alignItems: "center",
					gap: "39px",
					pt: { md: "37px" },
					backgroundImage: smallBreakpoint ? `url(${bgWheel.src})` : "",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center center",
					backgroundSize: "100%",
					overflow: "hidden",
					height: smallBreakpoint ? "450px" : "100%",
				}}
			>
				<Box
					sx={{
						flex: 1,
					}}
				>
					<HomeSectionHeader />
				</Box>
				{!smallBreakpoint && (
					<Box
						sx={{
							flex: 1,
						}}
					>
						<Box
							component={"img"}
							src={mainWheel.src}
							alt="main image"
							sx={{
								width: "100%",
								height: "100%",
							}}
						/>
					</Box>
				)}

				{smallBreakpoint && (
					<Box
						sx={{
							position: "absolute",
							top: 0,
							width: "100%",
							height: "100dvh",
							backgroundImage: `url(${ellipse.src})`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
						}}
					/>
				)}
			</Box>
		</Box>
	);
};
