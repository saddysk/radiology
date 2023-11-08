import * as BaseX from 'base-x';
import { v4 as uuidv4 } from 'uuid';

const base34xCodex = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
const base34x = BaseX(base34xCodex);

export function toBase34x(buffer: Buffer): string {
  return base34x.encode(buffer);
}

export function uuid(): string {
  return uuidv4();
}
