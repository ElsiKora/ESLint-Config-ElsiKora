export class userService {
	private Name: string;

	constructor(name: string) {
		this.Name = name;
	}

	public GetName() {
		return this.Name;
	}
}
