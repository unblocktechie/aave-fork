import { Box, Typography, useMediaQuery } from "@mui/material";
import AnchorCardOne from "src/assets/svgComponents/landingMain/AnchorCardOne";
import AnchorCardTwo from "src/assets/svgComponents/landingMain/AnchorCardTwo";
import ExternalLink from "src/assets/svgComponents/landingMain/ExternalLink";
import ReverseFundingCard from "src/assets/svgComponents/landingMain/ReverseFundingCard";
import RlTicketBlueSvg from "src/assets/svgComponents/landingMain/RlTicketBlueSvg";
import bgCardTwo from "./../../assets/landingMain/bg-card-two.png";
import cardBg from "./../../assets/landingMain/card-bg.png";
import maskCardTwo from "./../../assets/landingMain/card-two-mask.png";
import maskCardOne from "./../../assets/landingMain/mask-card-one.png";

export const LandingColumnsSection = () => {
	const smallBreakpoint = useMediaQuery("(max-width: 760px)");

	return (
		<Box
			sx={{
				marginBottom: { xs: "66px" },
				mx: "auto",
				maxWidth: "690px",
			}}
		>
			<Box>
				<Typography
					component="h2"
					sx={{
						fontFamily: { xs: "Overlock", sm: "Overlock SC" },
						fontSize: { xs: "25px", sm: "20px" },
						fontWeight: 400,
						textAlign: "center",
						textTransform: "capitalize",
						marginBottom: { xs: "74px", sm: "92px" },
						lineHeight: { xs: "34px", md: "42.5px" },
						letterSpacing: "0.045em",
					}}
				>
					Other Harbors of Residual Token, Inc.
				</Typography>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						gap: { xs: "56px", sm: "94px" },
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
						px: { xs: "26px", sm: 0 },
						overflow: "visible",
					}}
				>
					<Box
						component={"article"}
						sx={{
							position: "relative",
							justifySelf: { xs: "center", sm: "auto" },
							width: { xs: "298px" },
							backgroundImage: `url(${cardBg.src})`,
							backgroundRepeat: "no-repeat",
							borderRadius: "23px",
						}}
					>
						<Box
							sx={{
								position: "absolute",
								top: 0,
								right: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								width: "69px",
								height: "69px",
							}}
						>
							<AnchorCardOne />
						</Box>
						<Box
							sx={{
								width: "100%",
								height: "142px",
								backgroundImage: `url(${maskCardOne.src})`,
							}}
						/>
						<Box
							sx={{
								padding: "8px 33px 22px 31px",
							}}
						>
							<Box
								sx={{
									marginLeft: "-11px",
								}}
							>
								<RlTicketBlueSvg />
							</Box>
							<Box
								component={"p"}
								sx={{
									fontFamily: "Overlock SC",
									fontWeight: 400,
									fontSize: "14px",
									lineHeight: "20px",
									letterSpacing: "0.045em",
									color: "#5B6DA7",
									margin: 0,
								}}
							>
								ReserveLending™ is one of the leading protocols for lending and
								borrowing in the DeFi space. As an asset-liability DeFi lending
								tool and fork of Compound™.
							</Box>
							<Box
								sx={{
									display: "flex",
									gap: "6px",
									alignItems: "center",
								}}
							>
								<Box
									component={"p"}
									sx={{
										fontFamily: "Poppins",
										fontWeight: 500,
										fontSize: "14px",
										lineHeight: "24px",
										letterSpacing: "0.045em",
										background:
											"linear-gradient(90deg, #EFE6C9 0%, #33B6FF 94.08%)",

										backgroundClip: "text",
										"text-fill-color": "transparent",
									}}
								>
									Go to ReserveLending
								</Box>
								<ExternalLink />
							</Box>
						</Box>
					</Box>

					<Box
						component={"article"}
						sx={{
							position: "relative",
							justifySelf: { xs: "center", sm: "auto" },
							width: "298px",
							backgroundImage: {
								xs: `url(${cardBg.src})`,
								sm: `url(${bgCardTwo.src})`,
							},
							backgroundRepeat: "no-repeat",
							borderRadius: "23px",
						}}
					>
						<Box
							sx={{
								position: "absolute",
								top: 0,
								right: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								width: "69px",
								height: "69px",
							}}
						>
							{smallBreakpoint ? <AnchorCardOne /> : <AnchorCardTwo />}
						</Box>
						<Box
							sx={{
								width: "100%",
								height: "142px",
								backgroundImage: `url(${maskCardTwo.src})`,
							}}
						/>
						<Box
							sx={{
								padding: "10px 33px 27px 31px",
							}}
						>
							<Box
								sx={{
									mb: "6pxf",
								}}
							>
								<ReverseFundingCard />
							</Box>
							<Box
								component={"p"}
								sx={{
									fontFamily: "Overlock SC",
									fontWeight: 400,
									fontSize: "14px",
									lineHeight: "20px",
									letterSpacing: "0.045em",
									color: "#5B6DA7",
									margin: 0,
								}}
							>
								ReserveFunding is a fund of funds that allows crypto holders to
								provide cash to non-bank lenders leveraging SaaS and traditional
								financial service rails.
							</Box>
							<Box
								sx={{
									display: "flex",
									gap: "6px",
									alignItems: "center",
								}}
							>
								<Box
									component={"p"}
									sx={{
										fontFamily: "Poppins",
										fontWeight: 500,
										fontSize: "14px",
										lineHeight: "24px",
										letterSpacing: "0.045em",
										background:
											"linear-gradient(90deg, #EFE6C9 0%, #33B6FF 94.08%)",

										backgroundClip: "text",
										"text-fill-color": "transparent",
									}}
								>
									Go to ReserveFunding
								</Box>
								<ExternalLink />
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};
