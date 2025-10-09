import { Telegram } from "@mui/icons-material";
import { Box } from "@mui/material";
import React from "react";
import DiscordSvg from "src/assets/svgComponents/landingMain/DiscordSvg";
import TwitterSvg from "src/assets/svgComponents/landingMain/TwitterSvg";
import { Link } from "src/components/primitives/Link";

const CommunityLinks = () => {
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
				Community
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "11px",
				}}
			>
				<Link
					href={"#"}
					sx={{
						display: "flex",
						gap: "4px",
						alignItems: "center",
					}}
				>
					<DiscordSvg />
					<Box
						component={"span"}
						sx={{
							fontFamily: "Poppins",
							fontSize: "12px",
							lineHeight: "20.4px",
							letterSpacing: "0.045em",
							color: "white",
						}}
					>
						Discord
					</Box>
				</Link>
				<Link
					href={"#"}
					sx={{
						display: "flex",
						gap: "4px",
						alignItems: "center",
					}}
				>
					<Telegram
						sx={{ width: "20px", height: "20px", marginLeft: "-5px" }}
					/>
					<Box
						component={"span"}
						sx={{
							fontFamily: "Poppins",
							fontSize: "12px",
							lineHeight: "20.4px",
							letterSpacing: "0.045em",
							color: "white",
						}}
					>
						Telegram
					</Box>
				</Link>

				<Link
					href={"#"}
					sx={{
						display: "flex",
						gap: "4px",
						alignItems: "center",
					}}
				>
					<TwitterSvg />
					<Box
						component={"span"}
						sx={{
							fontFamily: "Poppins",
							fontSize: "12px",
							lineHeight: "20.4px",
							letterSpacing: "0.045em",
							color: "white",
						}}
					>
						Twitter
					</Box>
				</Link>
			</Box>
		</Box>
	);
};

export default CommunityLinks;
