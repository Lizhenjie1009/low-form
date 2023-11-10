import { ResponseDataType, OptionsType } from './types'
export default function usePage<
  T extends (...args: any) => Promise<ResponseDataType<any>>
>(listRequestFn: T, options: OptionsType = {}) {
  const {
    immediate = true,
    filterOption = ref(),
    transformResFn = undefined
  } = options

  // 加载状态
  const loading = ref(false)
  // 数据
  const list: any = ref([])

  const pagination = reactive({
    page: 1,
    pageSize: 20,
    itemCount: 0,
    showQuickJumper: true,
    showSizePicker: true,
    pageSizes: [10, 20, 30],
    prefix({ itemCount }) {
      return `共 ${itemCount} 条`
    },
    onChange: (page: number) => {
      pagination.page = page
      loadData()
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize
      pagination.page = 1
      loadData()
    }
  })

  const reset = () => {
    if (!filterOption.value) return
    const keys = Reflect.ownKeys(filterOption.value)
    keys.forEach(key => {
      Reflect.set(filterOption.value!, key, undefined)
    })
    loadData()
  }

  const loadData = () => {
    return new Promise(async (resolve, reject) => {
      loading.value = true
      try {
        const result = await listRequestFn(
          Object.assign(filterOption.value, {
            page: pagination.page,
            size: pagination.pageSize
          })
        )

        const transformResult = transformResFn ? transformResFn(result) : result
        const data = transformResult.list
        pagination.page = result.page
        pagination.pageSize = result.size
        pagination.itemCount = result.total
        list.value = data
        options?.requestSuccess?.()
        resolve({
          list: data
        })
      } catch (error) {
        options?.requestError?.()
      } finally {
        loading.value = false
      }
    })
  }

  onMounted(() => {
    if (immediate) {
      loadData()
    }
  })

  return {
    loading,
    list,
    reset,
    loadData,
    pagination
  }
}
