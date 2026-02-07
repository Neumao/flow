import baseSchema from './baseSchema.js';
import userSchema from './userSchema.js';
import workItemSchema from './workItemSchema.js';

const typeDefs = [
    baseSchema,
    userSchema,
    workItemSchema,
];

export default typeDefs;