import * as auth from './schema/auth';
import * as main from './schema/main';
import * as relations from './schema/relations';

const schema = { ...main, ...auth, ...relations };

export default schema;
