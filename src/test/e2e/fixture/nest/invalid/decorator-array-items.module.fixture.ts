import { Module } from "@nestjs/common";
import { CommonModule, MagicComponent, MatButtonModule, SharedModule } from "./some.module";

@Module({
	imports: [MatButtonModule, SharedModule, CommonModule, MagicComponent],
})
export default class SomeModule {}
