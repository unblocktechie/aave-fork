import { Button } from "@mui/material";
import React from "react";
import { landingButtonStyles } from "../../constants";

const HomeSectionButton = () => {
	return (
		<Button
			sx={{
				...landingButtonStyles,
				fontFamily: "Poppins",
				background: "#425697",
				letterSpacing: "0.045em",
				border: "2px solid #333AFF",
				width: "387px",
				height: "49px",
				borderRadius: "15px",
				boxShadow: "0px 4px 4px 0px #00000040",
				margin: 0,
			}}
		>
			Early access and Whitelisting
		</Button>
	);
};

export default HomeSectionButton;
