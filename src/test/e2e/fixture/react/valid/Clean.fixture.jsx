import React from "react";

export const Button = ({ LABEL, ON_CLICK }) => {
	return (
		<button type="button" onClick={ON_CLICK} className="px-4 py-2 bg-blue-500 text-white rounded">
			{LABEL}
		</button>
	);
};
