import * as lucia from "./lucia";
import * as main from "./main";
import * as relations from "./relations";

const schema = { ...lucia, ...main, ...relations };

export { schema };
