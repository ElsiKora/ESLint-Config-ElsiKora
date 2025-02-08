import type { TFeature } from "./types";
export declare function setupVSCodeConfig(features: Array<TFeature>): Promise<void>;
export declare function setupWebStormConfig(features: Array<TFeature>, includePrettier?: boolean): Promise<void>;
