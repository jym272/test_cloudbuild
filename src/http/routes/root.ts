import { Elysia } from 'elysia';
import { api, internal } from '@/http';

export const root = new Elysia().use(api).use(internal);
