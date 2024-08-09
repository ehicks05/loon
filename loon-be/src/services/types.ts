import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { tracks } from "../drizzle/main";

export type TrackInput = InferInsertModel<typeof tracks>;
export type TrackSelect = InferSelectModel<typeof tracks>;
