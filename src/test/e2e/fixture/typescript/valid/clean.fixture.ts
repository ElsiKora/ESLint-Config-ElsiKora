export interface IUserData {
	readonly ID: string;
	readonly NAME: string;
}

export class UserService {
	constructor(private readonly userData: IUserData) {}

	public getName(): string {
		return this.userData.NAME;
	}
}
