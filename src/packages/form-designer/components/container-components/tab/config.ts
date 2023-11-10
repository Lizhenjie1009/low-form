export default [
  {
    type: 'tab',
    label: '标签页',
    category: 'container',
    icon: 'CalendarTwotone',
    displayType: 'line',
    tabs: [],
    options: {
      name: '',
      hidden: false,
      customClass: '' //自定义css类名
    }
  },
  {
    type: 'tab-pane',
    category: 'container',
    icon: 'tab-pane',
    internal: true,
    widgetList: [],
    options: {
      name: '',
      label: '',
      hidden: false,
      active: false,
      disabled: false,
      customClass: '' //自定义css类名
    }
  }
]
