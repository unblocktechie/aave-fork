import { Box, useMediaQuery } from "@mui/material";
import AnchorStakesSection from "src/assets/svgComponents/landingMain/AnchorStakesSection";

type HarborCardProps = {
	cardValue: "Bond" | "Stake";
	cardTitle: string;
	cardDescription: string;
};

const HarborCard: React.FC<HarborCardProps> = ({
	cardValue,
	cardTitle,
	cardDescription,
}) => {
	const smallBreakpoint = useMediaQuery("(max-width: 760px)");

	return (
		<Box
			component={"div"}
			sx={{
				position: "relative",
				display: smallBreakpoint ? "flex" : "block",
				alignItems: "center",
				gap: "12px",
				backgroundImage: "linear-gradient(90deg, #152045 0%, #081029 97.68%)",
				borderRadius: "23px",
				height: "129px",
				maxWidth: { xs: "339px", sm: "278px" },
				paddingLeft: { xs: "13px", sm: "0" },
				paddingRight: { xs: "10px", sm: 0 },
				boxShadow: "0px 1px 7px 0px #6282EA6B",
				":after": {
					content: `""`,
					position: "absolute",
					inset: 0,
					borderRadius: "inherit",
					padding: "2px",
					background: {
						xs: "linear-gradient(180deg, #6B82CC 0%, #283A7D 100%)",
						md: "linear-gradient(90deg, #EFE6C9 0%, #33B6FF 94.08%)",
					},
					"-webkit-mask-composite": "xor",
					"-webkit-mask":
						"linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
					"mask-composite": "exclude",
					pointerEvents: "none",
				},
			}}
		>
			{smallBreakpoint ? (
				<Box sx={{ flexBasis: "69px" }}>
					<AnchorStakesSection />
				</Box>
			) : (
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						transform: "translate(-50%, -50%)",
						zIndex: 10,
					}}
				>
					<AnchorStakesSection />
				</Box>
			)}

			<Box
				sx={{
					flex: 1,
					paddingLeft: { xs: 0, sm: "38px" },
					paddingTop: { xs: 0, sm: "11px" },
					paddingRight: { xs: 0, sm: "14px" },
				}}
			>
				<Box
					component={"h3"}
					sx={{
						fontFamily: "Overlock SC",
						fontSize: "21px",
						lineHeight: "36px",
						letterSpacing: "0.045em",
						color: "white",
						margin: 0,
						mb: "6px",
					}}
				>
					{cardValue}{" "}
					<Box
						component={"span"}
						sx={{
							fontFamily: "Overlock SC",
							background: "linear-gradient(90deg, #3377FF 0%, #33B6FF 94.08%)",
							backgroundClip: "text",
							"text-fill-color": "transparent",
						}}
					>
						${cardTitle}
					</Box>
				</Box>
				<Box
					component={"p"}
					sx={{
						fontFamily: "Overlock SC",
						color: "white",
						fontSize: "14px",
						lineHeight: "18px",
						letterSpacing: "0.045em",
						margin: 0,
					}}
				>
					{cardDescription}
				</Box>
			</Box>
		</Box>
	);
};

export default HarborCard;
