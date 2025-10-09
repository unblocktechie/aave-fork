import { Box } from "@mui/material";
import React from "react";
import { labelImages } from "./constants";

const LandingLabelSection = () => {
	return (
		<Box
			sx={{
				width: "100%",
				display: { xs: "none", lg: "flex" },
				gap: "156px",
				justifyContent: "center",
				alignItems: "center",
				marginBottom: "132px",
			}}
		>
			{labelImages.map(({ id, labelIcon, width, height }) => (
				<Box
					component={"img"}
					key={id}
					src={labelIcon.src}
					width={width}
					height={height}
					alt="label image"
				/>
			))}
		</Box>
	);
};

export default LandingLabelSection;
