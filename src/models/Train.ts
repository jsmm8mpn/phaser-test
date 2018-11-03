import { City } from './City';

let idGen = 0;

export class Train {
	id: number;
	constructor(public fromCity: City, public toCity: City) {
		this.id = idGen++;
	}
}