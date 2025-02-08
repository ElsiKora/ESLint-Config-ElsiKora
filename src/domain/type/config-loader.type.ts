import type { TConfigModule } from "./config-module.type";

export type TConfigLoader = () => Promise<TConfigModule>;
