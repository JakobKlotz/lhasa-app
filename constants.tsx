// 'NEXT_PUBLIC' prefix is important to be able to access it
import { env } from 'next-runtime-env';

export const BACKEND_API_BASE_URL = env("NEXT_PUBLIC_BACKEND_API_BASE_URL")