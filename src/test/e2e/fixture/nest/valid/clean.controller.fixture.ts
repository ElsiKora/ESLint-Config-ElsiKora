import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("items")
@ApiTags("items")
export class ItemController {
	@Get()
	@ApiResponse({ status: 200, description: "List of items" })
	public getItems(): string[] {
		return ["item1", "item2"];
	}
}
