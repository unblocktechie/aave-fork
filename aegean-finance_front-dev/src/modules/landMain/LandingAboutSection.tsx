import { Box, Button, useMediaQuery } from "@mui/material";
import LandingHeadingFrame from "src/assets/svgComponents/LandingHeadingFrame";
import { socialsLinks } from "./constants";

export const LandingAboutSection = () => {
	const smallBreakpoint = useMediaQuery("(max-width: 760px)");

	return (
		<Box
			sx={{
				maxWidth: { xs: "375px", md: "643px" },
				paddingInline: { xs: "16px", md: 0 },
				marginX: "auto",
				marginBottom: { xs: "60px", md: "80px" },
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Box
					sx={{
						rotate: "180deg",
					}}
				>
					<LandingHeadingFrame />
				</Box>
				<Box
					sx={{
						flex: 1,
						fontFamily: { xs: "Overlock", md: "Overlock SC" },
						fontWeight: { xs: 700, md: 400 },
						fontSize: { xs: "20px", md: "25px" },
						lineHeight: { xs: "34px", md: "43px" },
						letterSpacing: "0.045em",
						textAlign: "center",
						margin: 0,
					}}
					component={"h3"}
				>
					Join the Armada
				</Box>
				<LandingHeadingFrame />
			</Box>
			<Box
				sx={{
					marginBottom: { xs: 0, md: "60px" },
				}}
			>
				<Box
					component={"p"}
					sx={{
						fontFamily: "Overlock SC",
						fontWeight: 400,
						textAlign: "center",
						fontSize: "14px",
						letterSpacing: "0.045em",
						lineHeight: "24px",
						mb: "20px",
					}}
				>
					The open waters of DeFi and TradFi can be filled with Pirates, Sharks,
					and Storms. It can be
					<br /> dangerous to try to make the voyage alone. Join the Armada and
					find your DeFi safe harbor or passage to TradFi with confidence and
					security.
				</Box>
				<Box
					component={"p"}
					sx={{
						fontFamily: "Overlock SC",
						textAlign: "center",
						fontSize: "14px",
						fontWeight: 400,
						letterSpacing: "0.045em",
						lineHeight: "24px",
					}}
				>
					Make sure to Join our discussion groups below and to follow our medium
					page for in-depth updates and news about the ReserveDAO protocol.
				</Box>
			</Box>

			{!smallBreakpoint && (
				<Box
					sx={{
						display: { xs: "none", md: "flex" },
						justifyContent: "center",
						width: "100%",
						gap: "15px",
					}}
				>
					{socialsLinks.map(({ id, name, href }) => (
						<Button
							sx={{
								backgroundColor: "#040A1E",
								background:
									id === 0
										? "linear-gradient(90deg, #0A1738 0%, #0A1D38 94.08%)"
										: "#040A1E",
								width: "190px",
								height: "49px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "15px",
								color: "#fff",
								fontSize: "14px",
								lineHeight: "24px",
								letterSpacing: "0.045em",
								border: "2px solid #4C5983",
								backgroundClip: "border-area",
								":after": {
									content: `""`,
									position: "absolute",
									display: id === 0 ? "block" : "none",
									inset: 0,
									borderRadius: "inherit",
									padding: "2px",
									background:
										"linear-gradient(90deg, #3377FF 0%, #33B6FF 94.08%)",
									"-webkit-mask-composite": "xor",
									"-webkit-mask":
										"linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
									"mask-composite": "exclude",
								},
							}}
							key={id}
							href={href}
							target="_blank"
						>
							{name}
						</Button>
					))}
				</Box>
			)}
		</Box>
	);
};
