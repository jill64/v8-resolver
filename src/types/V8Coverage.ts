import type { isV8Coverage } from '../utils/isV8Coverage.js'
import type { GuardType } from './GuardType.js'

export type V8Coverage = GuardType<typeof isV8Coverage>
