import { Box, Button } from "@mui/material";
import AnchorHeader from "src/assets/svgComponents/landingMain/AnchorHeader";
import CloseIconSvg from "src/assets/svgComponents/landingMain/CloseIconSvg";
import HeaderLogo from "src/assets/svgComponents/landingMain/HeaderLogo";
import { Link } from "src/components/primitives/Link";
import MobileMenuLInks from "./MobileMenuLInks";
type MobileMenuProps = {
	closeMenu: () => void;
	isActive: boolean;
};

const MobileMenuLanding: React.FC<MobileMenuProps> = ({
	closeMenu,
	isActive = false,
}) => {
	return (
		<Box
			sx={{
				height: "100dvh",
				width: "100%",
				position: "absolute",
				top: 0,
				zIndex: 999,
				pl: "20px",
				pt: "28px",
				backgroundColor: "#040A1E",
				backgroundImage: "url(/ellipse-menu-big.png)",
				backgroundSize: "100% 100%",
				backgroundRepeat: "no-repeat",
				transition: "transform 0.5s, opacity 0.5s",
				transform: isActive ? "translateX(0)" : "translate(-100%)",
			}}
		>
			<Box sx={{}}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "40px",
					}}
				>
					<Link
						href="/"
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: "12px",
							}}
						>
							<AnchorHeader />
							<HeaderLogo />
						</Box>
					</Link>

					<Button
						sx={{
							width: "24px",
							height: "24px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						onClick={closeMenu}
					>
						<CloseIconSvg />
					</Button>
				</Box>
				<Box>
					<MobileMenuLInks />
				</Box>
			</Box>
		</Box>
	);
};

export default MobileMenuLanding;
