import React from "react";

interface IButtonProps {
	readonly LABEL: string;
	readonly ON_CLICK: () => void;
}

export const Button: React.FC<IButtonProps> = ({ LABEL, ON_CLICK }): JSX.Element => {
	return (
		<button type="button" onClick={ON_CLICK} className="px-4 py-2 bg-blue-500 text-white rounded">
			{LABEL}
		</button>
	);
};
