import { Box, Container } from "@mui/material";
import LandingLabelSection from "./LamdingLabelSection";
import { LandingAboutSection } from "./LandingAboutSection";
import LandingBenefitsSection from "./LandingBenefitsSection";
import { LandingColumnsSection } from "./LandingColumnsSection";
import LandingFooter from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";
import { LandingHomeSection } from "./LandingHomeSection";
import { LandingStakesSection } from "./LandingStakesSection";

export const LandingMain = () => {
	return (
		<Box sx={{ backgroundColor: "#040A1E", minHeight: "100vh" }}>
			<LandingHeader />
			<LandingHomeSection />
			<Container maxWidth={"lg"} disableGutters={true}>
				<LandingAboutSection />
				<LandingStakesSection />
				<LandingColumnsSection />
				<LandingBenefitsSection />
				<LandingLabelSection />
				<LandingFooter />
			</Container>
		</Box>
	);
};
