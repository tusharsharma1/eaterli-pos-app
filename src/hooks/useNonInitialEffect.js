import { useEffect, useRef } from "react";

export const useNonInitialEffect = ( effectCallback, deps) => {
	const initialRender = useRef(true);

	useEffect(() => {
		let effectReturns;

        if (initialRender.current) {
			initialRender.current = false;
		} else {
			effectReturns = effectCallback();
		}

		if (effectReturns && typeof effectReturns === "function") {
			return effectReturns;
		}
	}, deps);
};