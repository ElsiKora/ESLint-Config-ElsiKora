import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("products")
@ApiTags("products")
export class ProductController {
	@Get()
	public getProducts(): string[] {
		return ["product1", "product2"];
	}
}
