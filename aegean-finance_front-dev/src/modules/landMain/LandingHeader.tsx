import { Box, Button, Grid, useMediaQuery } from "@mui/material";
import { useState } from "react";
import AnchorHeader from "src/assets/svgComponents/landingMain/AnchorHeader";
import HeaderLogo from "src/assets/svgComponents/landingMain/HeaderLogo";
import { Link } from "src/components/primitives/Link";
import { BurgerMenuIcon } from "../../components/icons/BurgerMenuIcon";
import MobileMenuLanding from "./components/MobileMenuLanding";

export const LandingHeader = () => {
	const [isMenuActive, setMenuActive] = useState<boolean>(false);
	const smallBreakpoint = useMediaQuery("(max-width: 760px)");

	const closeMenu = () => {
		setMenuActive(false);
		document.body.style.overflow = "";
	};
	const openMenu = () => {
		setMenuActive(true);
		document.body.style.overflow = "hidden";
	};

	const navLinks = [
		{
			id: 0,
			name: "Medium",
			href: "#",
		},
		{
			id: 1,
			name: "Early access",
			href: "#",
		},
		{
			id: 2,
			name: "Enter App",
			href: "/app",
		},
	];

	const bgButtonElements = [1, 2, 3, 4, 5, 6, 7];

	return (
		<Box
			component="header"
			sx={{
				position: "relative",
				width: "100%",
				bgcolor: {
					xs: "#08102D",
					sm: "#040A1E",
				},
			}}
		>
			<Box
				sx={{
					maxWidth: "1110px",
					paddingTop: { md: "42px" },
					paddingInline: { xs: "20px", sm: "48px", md: "96px", lg: 0 },
					mx: "auto",
				}}
			>
				<Box>
					<Box
						sx={{
							height: {
								xs: "86px",
								md: "49px",
							},
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Link href="/">
							<Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
								<AnchorHeader />
								<HeaderLogo />
							</Box>
						</Link>
						{!smallBreakpoint && (
							<Box
								component={"nav"}
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: { xs: "center", sm: "initial" },
									gap: "45px",
								}}
							>
								{navLinks.map(({ id, name, href }) =>
									id !== navLinks.length - 1 ? (
										<Link
											href={href}
											key={id}
											sx={{
												fontFamily: "Poppins",
												fontSize: "14px",
												lineHeight: "23.8px",
												letterSpacing: "0.045em",
												textTransform: "capitalize",
												color: "#fff",
											}}
										>
											{name}
										</Link>
									) : (
										<Link
											key={id}
											href={href}
											sx={{
												position: "relative",
												fontFamily: "Poppins",
												fontSize: "14px",
												textTransform: "capitalize",
												color: "#fff",
												minWidth: "121px",
												minHeight: "49px",
												border: "1px solid #171F3B",
												borderRadius: "15px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												overflow: "hidden",
												transition: "background 500ms ease",
												":hover": {
													backgroundImage: "none",
													backgroundColor: "#0e73b9",
													color: "white",
													"& span": {
														color: "white",
													},
												},
											}}
										>
											<Grid
												container
												columns={{ xs: 7 }}
												sx={{ position: "absolute", width: "100%" }}
												spacing={4}
											>
												{bgButtonElements.map((element) => (
													<Grid item key={element}>
														<Box
															sx={{
																width: "1px",
																height: "60px",
																background: "#2B375A7A",
																rotate: "-135deg",
															}}
														/>
													</Grid>
												))}
											</Grid>
											<Box
												sx={{
													zIndex: 5,
													color: "#2B375A",
													transition: "color 500ms ease",
												}}
												component={"span"}
											>
												Enter App
											</Box>
										</Link>
									),
								)}
							</Box>
						)}
						<Button
							variant="text"
							sx={{
								padding: "0",
								width: "24px",
								height: "24px",
								display: { xs: "block", sm: "none" },
							}}
							onClick={openMenu}
						>
							<BurgerMenuIcon />
						</Button>
					</Box>
				</Box>
			</Box>
			<MobileMenuLanding isActive={isMenuActive} closeMenu={closeMenu} />
		</Box>
	);
};
