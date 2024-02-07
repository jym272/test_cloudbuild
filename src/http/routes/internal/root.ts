import { Elysia } from 'elysia';
import { health } from '@http/routes/internal';

export const internal = new Elysia({ prefix: '/internal' }).use(health);
