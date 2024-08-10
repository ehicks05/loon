import * as lucia from "./lucia.js";
import * as main from "./main.js";
import * as relations from "./relations.js";

const schema = { ...lucia, ...main, ...relations };

export { schema };
