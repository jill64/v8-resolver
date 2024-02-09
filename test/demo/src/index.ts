import { add } from './add'
import { sub } from './sub'

export const natural = (n: number): number => {
  const res = add(n, 1)
  return sub(res, 1)
}
