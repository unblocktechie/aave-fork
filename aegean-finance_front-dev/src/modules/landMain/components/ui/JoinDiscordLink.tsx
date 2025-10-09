import React from "react";
import { Link } from "src/components/primitives/Link";

const JoinDiscordLink = () => {
	return (
		<Link
			sx={{
				position: "relative",
				backgroundColor: "#040A1E",
				background: "linear-gradient(90deg, #0A1738 0%, #0A1D38 94.08%)",
				width: "190px",
				height: "49px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: "15px",
				color: "#fff",
				fontSize: "14px",
				lineHeight: "24px",
				letterSpacing: "0.045em",
				border: "2px solid #4C5983",
				backgroundClip: "border-area",
				":after": {
					content: `""`,
					position: "absolute",
					inset: 0,
					borderRadius: "inherit",
					padding: "2px",
					background: "linear-gradient(90deg, #3377FF 0%, #33B6FF 94.08%)",
					"-webkit-mask-composite": "xor",
					"-webkit-mask":
						"linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
					"mask-composite": "exclude",
				},
			}}
			href={"#"}
			target="_blank"
		>
			Join The Discord
		</Link>
	);
};

export default JoinDiscordLink;
