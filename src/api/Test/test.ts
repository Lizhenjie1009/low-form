import { http } from '@/utils/http/axios'

/**
 * @description: Test
 */
export function getTest(params: any) {
  return http.request({
    url: '/demo/test/page',
    method: 'get',
    params
  })
}

export function postTest(params: any) {
  return http.request({
    url: '/demo/test',
    method: 'post',
    params
  })
}

export function putTest(params: any) {
  return http.request({
    url: '/demo/test',
    method: 'put',
    params
  })
}

export function delTest(params: any) {
  return http.request({
    url: '/demo/test',
    method: 'del',
    params
  })
}
