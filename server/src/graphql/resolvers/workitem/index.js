import { workItemMutations } from './mutations.js';
import { workItemQueries } from './queries.js';

export const workItemResolvers = {
    ...workItemMutations,
    ...workItemQueries,
};
