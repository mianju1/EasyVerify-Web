import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';



// https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp

export async function fetchDataGet(url: string) {
	try {
		const response = await axios.get(url);
		// console.log(response);
		return response;
	} catch (error) {
		return error;
	} 
}

export const getCircularReplacer = () => {
	const seen = new WeakSet();
	return (key, value) => {
			if (typeof value === "object" && value !== null) {
					if (seen.has(value)) {
							return;
					}
					seen.add(value);
			}
			return value;
	};
};

export const uuid = (): string => {
    return uuidv4();
};
