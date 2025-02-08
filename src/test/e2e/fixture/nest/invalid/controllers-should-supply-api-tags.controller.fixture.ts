import { Controller, Get } from "@nestjs/common";

@Controller("users")
export class UserController {
	@Get()
	public getUsers(): string[] {
		return ["user1", "user2"];
	}
}
