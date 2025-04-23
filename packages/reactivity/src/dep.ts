
import { ReactiveEffect } from './effect'

export type Dep = Set<ReactiveEffect>

/**
 * 依据 effects 生成 dep 实例,
 * 这里定义了一个类型别名 Dep，它本质上是一个 Set 集合，里面存储的是多个副作用函数（effect 实例）。
 * 一个响应式属性可能会被多个 effect 所依赖，所以我们用 Set 来防止重复依赖。
 */
export const createDep = (effects?: ReactiveEffect[]): Dep => {
  const dep = new Set<ReactiveEffect>(effects) as Dep
  return dep
}