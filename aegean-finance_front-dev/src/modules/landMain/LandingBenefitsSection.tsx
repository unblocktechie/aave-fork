import { Box } from "@mui/material";
import React from "react";
import anchor from "./../../assets/landingMain/anchor-benefits.png";
import ship from "./../../assets/landingMain/ship-benefits.png";
import wheel from "./../../assets/landingMain/wheel-benefits.png";

import BenefitsHeader from "./components/BenefitsHeader";

const LandingBenefitsSection = () => {
	return (
		<Box
			sx={{
				width: "100%",
				px: { xs: "16px", sm: "0" },
				marginBottom: "89px",
			}}
		>
			<Box
				sx={{
					display: "flex",
					gap: "47px",
					marginBottom: { xs: "23px", sm: "74px" },
				}}
			>
				<Box
					sx={{
						flex: 1,
					}}
				>
					<BenefitsHeader benefitTitle="RSRV" />
					<Box
						sx={{
							paddingLeft: { xs: "none", sm: "46px" },
						}}
					>
						<Box
							component={"p"}
							sx={{
								color: "white",
								fontFamily: "Overlock SC",
								fontWeight: 400,
								fontSize: "16px",
								lineHeight: "27.2px",
								letterSpacing: "0.045em",
								margin: 0,
								marginBottom: "6px",
							}}
						>
							Join the Armada as we cross the sea’s of Decentralized Finance
							(DeFi) into the open oceans of Traditional Finance (TradFi)
						</Box>
						<Box
							component={"p"}
							sx={{
								color: "#69728E",
								fontFamily: "Overlock SC",
								fontWeight: 400,
								fontSize: { xs: "13px", sm: "16px" },
								lineHeight: { xs: "22.1px", sm: "27.2px" },
								letterSpacing: "0.045em",
								margin: 0,
							}}
						>
							ReserveDAO (RSRV) was formed by the unFederalReserve (eRSDL)
							community, its leaders and members shared a common vision, Buy The
							Bank! By acquiring a bank and utilizing the software and rails
							already established by the eRSDL team. ReserveDAO will be able to
							serve a host of products to the defi and tradfi worlds alike.
							Coupling that with tokenomics that are built upon the long term
							principles of stable linear growth and RSRV backed rewards.
							Enables the ReserveDAO protocol to provide a safe harbor for
							customers of these products. Holders and participants of the
							protocol will be able to have the only token that can make you a
							preferred equity holder of a bank and provide a safe passage
							between Defi and TradFi.
						</Box>
					</Box>
				</Box>
				<Box
					sx={{
						flexBasis: "431px",
						display: { xs: "none", md: "block" },
					}}
				>
					<Box component={"img"} src={ship.src} width={431} height={348} />
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					gap: "122px",
					marginBottom: { xs: "39px", sm: "51px" },
				}}
			>
				<Box
					sx={{
						flex: 1,
						display: { xs: "none", md: "flex" },
						justifyContent: "center",
						paddingLeft: "41px",
					}}
				>
					<Box>
						<Box component={"img"} src={wheel.src} width={323} height={323} />
					</Box>
				</Box>
				<Box
					sx={{
						flex: 1.5,
					}}
				>
					<BenefitsHeader benefitTitle="Community Driven" />
					<Box
						sx={{
							paddingLeft: { xs: "0px", sm: "46px" },
						}}
					>
						<Box
							component={"p"}
							sx={{
								color: "#69728E",
								fontFamily: "Overlock SC",
								fontWeight: 400,
								fontSize: { xs: "13px", sm: "16px" },
								lineHeight: { xs: "22.1px", sm: "27.2px" },
								letterSpacing: "0.045em",
								margin: 0,
							}}
						>
							The protocols aim is to reward the community and those who give
							most to the RSRV/eRSDL ecosystem. Those who have gone through the
							proper KYC/AML processes may become preferred equity holders in
							all the institutions we obtain as a DAO. Holders will also be able
							to stake their tokens for a set time period and receive RSRV in
							return. Rewards will also be given to those that participate and
							promote ReserveDAO. Successful proposals on the governance
							platform and/or contributing to our medium page with articles will
							be rewarded! Promotions of ReserveDAO that are done in a healthy
							organic manner and that can be backed by analytics will also be
							rewarded! The first step is joining Discord or Telegram!
						</Box>
					</Box>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					gap: "47px",
				}}
			>
				<Box
					sx={{
						flex: 1,
					}}
				>
					<BenefitsHeader benefitTitle="The Safe Harbor" />
					<Box
						sx={{
							paddingLeft: { xs: "0", sm: "46px" },
						}}
					>
						<Box
							component={"p"}
							sx={{
								color: "#69728E",
								fontFamily: "Overlock SC",
								fontWeight: 400,
								fontSize: { xs: "13px", sm: "16px" },
								lineHeight: { xs: "22.1px", sm: "27.2px" },
								letterSpacing: "0.045em",
								margin: 0,
							}}
						>
							What is a DeFi Safe Harbor? We believe a Safe Harbor is a place
							that allows users the ability to interact with our DeFi or TradFi
							products with confidence and simplicity. A Safe Harbor is a place
							with long term stability and short term accessibility in mind.
							This will be achieved by coupling our tokenomics/DeFI protocol
							with equity positions in financial institutions. Since crypto is a
							highly volatile space, having a constant revenue flow will help
							the DAO create stability across our products in times of
							volatility. Giving our customers different products to choose from
							to help hedge against this volatility for set time periods. Last
							but not least, a Safe Harbor provides a passage from DeFi to
							TradFi, giving users the ability to place their assets and capital
							in different markets while staying on the blockchain.
						</Box>
					</Box>
				</Box>
				<Box
					sx={{
						display: { xs: "none", md: "block" },
						flexBasis: "356px",
					}}
				>
					<Box component={"img"} src={anchor.src} width={356} height={356} />
				</Box>
			</Box>
		</Box>
	);
};

export default LandingBenefitsSection;
