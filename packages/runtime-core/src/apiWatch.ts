import { EMPTY_OBJ, hasChanged } from '@vue/shared'
import { isReactive } from '@vue/reactivity'
import { queuePreFlushCb } from './scheduler'
import { ReactiveEffect } from '../../reactivity/src/effect'

/**
 * watch 配置项属性
 */
export interface WatchOptions<Immediate = boolean> {
  immediate?: Immediate
  deep?: boolean
}

/**
 * 指定的 watch 函数
 * @param source 监听的响应性数据
 * @param cb 回调函数
 * @param options 配置对象
 * @returns
 */
export function watch(source, cb: Function, options?: WatchOptions) {
  return doWatch(source as any, cb, options)
}

function doWatch(
  source,
  cb: Function,
  { immediate, deep }: WatchOptions = EMPTY_OBJ
) {

  // 触发 getter 的指定函数
  let getter: () => any

  // 判断 source 的数据类型
  if (isReactive(source)) {

    // 指定 getter
    getter = () => source
    // 深度
    deep = true
  } else {
    getter = () => {
    }
  }

  // 存在回调函数和deep
  if (cb && deep) {
    // TODO
    const baseGetter = getter
    getter = () => baseGetter()
  }

  // 旧值
  let oldValue = {}
  // job 执行方法
  const job = () => {
    if (cb) {
      // watch(source, cb)
      const newValue = effect.run()
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue)
        oldValue = newValue
      }
    }
  }

  // 调度器
  let scheduler = () => queuePreFlushCb(job)


  const effect = new ReactiveEffect(getter, scheduler)

  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}