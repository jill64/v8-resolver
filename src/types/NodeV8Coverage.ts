import { isNodeV8Coverage } from '../utils/isNodeV8Coverage.js'
import { GuardType } from './GuardType.js'

export type NodeV8Coverage = GuardType<typeof isNodeV8Coverage>
