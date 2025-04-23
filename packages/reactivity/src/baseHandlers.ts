import { track, trigger } from './effect'

/**
 * 响应性的 handler
 */
export const mutableHandlers: ProxyHandler<object> = {
  get(target: object, key: string | symbol, receiver: object) {
    // 利用 Reflect 得到返回值
    const res = Reflect.get(target, key, receiver)
    // 收集依赖
    track(target, key)
    return res
  },
  set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ) {
    // 利用 Reflect.set 设置新值
    const result = Reflect.set(target, key, value, receiver)
    // 触发依赖
    trigger(target, key, value)
    return result
  }
}

