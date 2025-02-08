import React, { useEffect, useState } from "react";

export const Counter = () => {
	const [firstName, setFirstName] = useState("Taylor");
	const [lastName, setLastName] = useState("Swift");

	const [fullName, setFullName] = useState("");
	useEffect(() => {
		setFullName(firstName + " " + lastName);
	}, [firstName, lastName]);

	return (
		<div>
			<p>Name: {fullName}</p>
			<button onClick={() => setFullName("Another Name")}>Change</button>
		</div>
	);
};
