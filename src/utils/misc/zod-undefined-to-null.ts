export const toNull = (value: unknown) => {
	if (value === undefined) {
		return null;
	}

	return value;
};
