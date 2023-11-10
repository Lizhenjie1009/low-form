export default [
  {
    type: 'grid',
    label: '栅格',
    category: 'container',
    icon: 'TableOutlined',
    cols: [],
    options: {
      name: '',
      hidden: false,
      gutter: 12,
      colHeight: null, //栅格列统一高度属性，用于解决栅格列设置响应式布局浮动后被挂住的问题！！
      customClass: '' //自定义css类名
    }
  }
]
