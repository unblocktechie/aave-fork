import { Box } from "@mui/material";
import arrowRight from "./../../../assets/landingMain/arrow-left-bf-header.png";
import arrowLeft from "./../../../assets/landingMain/arrow-right-bf-header.png";

type BenefitsHeaderProps = {
	benefitTitle: string;
};
const BenefitsHeader: React.FC<BenefitsHeaderProps> = ({ benefitTitle }) => {
	return (
		<Box
			sx={{
				width: "100%",
				height: "54px",
				backgroundImage: {
					xs: `url(${arrowLeft.src})`,
					sm: `url(${arrowRight.src})`,
				},
				backgroundRepeat: "no-repeat",
				backgroundSize: "contain",
				backgroundPositionX: { sx: "right", sm: "left" },

				paddingLeft: { xs: "0", sm: "46px" },
				display: "flex",
				alignItems: "center",
			}}
		>
			<Box
				component={"h2"}
				sx={{
					fontFamily: "Overlock",
					fontWeight: 400,
					color: "white",
					fontSize: "25px",
					lineHeight: "42.5px",
					letterSpacing: "0.045em",
				}}
			>
				{benefitTitle}
			</Box>
		</Box>
	);
};

export default BenefitsHeader;
