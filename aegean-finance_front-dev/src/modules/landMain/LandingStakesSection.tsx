import { Box, useMediaQuery } from "@mui/material";
import mapImage from "./../../assets/landingMain/ff-main-map.png";
import HarborCard from "./components/HarborCard";

export const LandingStakesSection = () => {
	const smallBreakpoint = useMediaQuery("(max-width: 760px)");

	return (
		<Box
			sx={{
				mb: { xs: "66px", sm: "128px" },
				width: "100%",
				px: { xs: "8px", md: 0 },
			}}
		>
			<Box>
				<Box
					component="h2"
					sx={{
						fontFamily: "Overlock",
						fontSize: { xs: "20px", sm: "25px" },
						fontWeight: { xs: 700, sm: 400 },
						lineHeight: { xs: "34px", sm: "42.5px" },
						letterSpacing: "0.045em",
						textAlign: "center",
						margin: 0,
						mb: { xs: "43px", sm: "57px" },
						textTransform: "capitalize",
						color: "white",
					}}
				>
					{smallBreakpoint ? "Moor Your Ship" : "Find your safe harbor"}
				</Box>

				<Box
					sx={{
						position: "relative",
						display: smallBreakpoint ? "flex" : "block",
						flexDirection: "column",
						alignItems: "center",
						gap: "13px",
						width: "100%",
						height: smallBreakpoint ? "100%" : "518px",
						backgroundImage: smallBreakpoint ? "" : `url(${mapImage.src})`,
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						backgroundSize: "cover",
						mx: "auto",
					}}
				>
					<Box
						sx={{
							position: smallBreakpoint ? "static" : "absolute",
							top: "57px",
							left: "50px",
						}}
					>
						<HarborCard
							cardValue="Stake"
							cardTitle="RSRV"
							cardDescription="Stake $RSRV and receive a guranteed percentage based on lock up time-period. "
						/>
					</Box>
					<Box
						sx={{
							position: smallBreakpoint ? "static" : "absolute",
							top: "307px",
							left: "75px",
						}}
					>
						<HarborCard
							cardValue="Stake"
							cardTitle="LP’s"
							cardDescription="Stake ETH/eRSDL or ETH/RSRV LP’s for maximum rewards."
						/>
					</Box>
					<Box
						sx={{
							position: smallBreakpoint ? "static" : "absolute",
							top: { sm: "177px", md: "250px" },
							right: "65px",
						}}
					>
						<HarborCard
							cardValue="Bond"
							cardTitle="eRSDL/$RSRV"
							cardDescription="Purchase $eRSDL or $RSRV bonds to play one of the most innovative long games."
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};
