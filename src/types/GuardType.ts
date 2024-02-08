import { Condition } from 'typescanner/dist/types/index.js'

export type GuardType<T> = T extends Condition<infer U> ? U : never
