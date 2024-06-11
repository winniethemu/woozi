import { Schema } from 'redis-om';

export const userSchema = new Schema('user', {
  name: { type: 'string' },
});
