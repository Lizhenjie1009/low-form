<template>
  <n-scrollbar class="side-scroll-bar border" :style="{ height: '100%' }">
    <div class="panel-container">
      <component :is="filedListModules['button-widget']"></component>

      <n-tabs
        v-model:value="firstTab"
        class="no-bottom-margin indent-left-margin"
      >
        <n-tab-pane name="componentLib" tab="组件库">
          <n-collapse
            :default-expanded-names="activeNames"
            class="widget-collapse"
          >
            <n-collapse-item name="1" title="容器">
              <draggable
                tag="ul"
                :list="containers"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleContainerWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkContainerMove"
              >
                <template #item="{ element: ctn }">
                  <li
                    class="container-widget-item"
                    :title="ctn.displayName"
                    @dblclick="addContainerByDbClick(ctn)"
                  >
                    <span>
                      <nsvg-icon :name="ctn.icon" class-name="color-svg-icon" />
                      {{ ctn.label }}
                    </span>
                  </li>
                </template>
              </draggable>
            </n-collapse-item>

            <n-collapse-item name="2" title="基础字段">
              <draggable
                tag="ul"
                :list="basicFields"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleFieldWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkFieldMove"
              >
                <template #item="{ element: fld }">
                  <li
                    class="field-widget-item"
                    :title="fld.displayName"
                    @dblclick="addFieldByDbClick(fld)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="fld.icon"
                        class-name="color-svg-icon"
                      />
                      {{ fld.type }}
                    </span>
                  </li>
                </template>
              </draggable>
            </n-collapse-item>

            <!-- <n-collapse-item name="3" title="高级字段">
              <draggable
                tag="ul"
                :list="advancedFields"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleFieldWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkFieldMove"
              >
                <template #item="{ element: fld }">
                  <li
                    class="field-widget-item"
                    :title="fld.displayName"
                    @dblclick="addFieldByDbClick(fld)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="fld.icon"
                        class-name="color-svg-icon"
                      />
                      {{ fld.type }}
                    </span>
                  </li>
                </template>
              </draggable>
            </n-collapse-item>

            <n-collapse-item name="4" title="自定义扩展字段">
              <draggable
                tag="ul"
                :list="customFields"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleFieldWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkFieldMove"
              >
                <template #item="{ element: fld }">
                  <li
                    class="field-widget-item"
                    :title="fld.displayName"
                    @dblclick="addFieldByDbClick(fld)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="fld.icon"
                        class-name="color-svg-icon"
                      />
                      {{ fld.type }}
                    </span>
                  </li>
                </template>
              </draggable>
            </n-collapse-item> -->
          </n-collapse>
        </n-tab-pane>

        <!-- <el-tab-pane
          v-if="showFormTemplates()"
          name="formLib"
          style="padding: 8px"
        >
          <template #label>
            <span><svg-icon icon-class="el-form-template" /> 表单模板</span>
          </template>

          <template v-for="(ft, idx) in formTemplates">
            <el-card
              :bord-style="{ padding: '0' }"
              shadow="hover"
              class="ft-card"
            >
              <el-popover placement="right" trigger="hover">
                <template #reference>
                  <img :src="ft.imgUrl" style="width: 200px" />
                </template>
                <img :src="ft.imgUrl" style="height: 600px; width: 720px" />
              </el-popover>
              <div class="bottom clear-fix">
                <span class="ft-title">#{{ idx + 1 }} {{ ft.title }}</span>
                <el-button
                  link
                  type="primary"
                  class="right-button"
                  @click="loadFormTemplate(ft.jsonUrl)"
                >
                  加载此模板</el-button
                >
              </div>
            </el-card>
          </template>
        </el-tab-pane> -->
      </n-tabs>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup name="WidgetPanel">
import { advancedFields as AFS, customFields as CFS } from './widgetsConfig'
import {
  containers as CONS,
  basicFields as BFS
} from '@/packages/form-designer/components'
import { formTemplates } from './templatesConfig'
import { addWindowResizeHandler, generateId } from '@/utils/fn'
import axios from 'axios'
import { useConfigStore } from '@/store'
import { filedListModules } from '@/packages/form-designer/components'
console.log(filedListModules, 'filedListModules')


const { designerConfig } = useConfigStore()
const props = defineProps({
  designer: Object
})
const getBannedWidgets = ref([])
const firstTab = ref('componentLib')
const scrollerHeight = ref('0')
const activeNames = ref(['1', '2', '3', '4'])
const containers = ref([])
const basicFields = ref([])
const advancedFields = ref([])
const customFields = ref([])

const isBanned = wName => {
  return getBannedWidgets.value.indexOf(wName) > -1
}

const showFormTemplates = () => {
  if (designerConfig['formTemplates'] === undefined) {
    return true
  }

  return !!designerConfig['formTemplates']
}

const loadWidgets = () => {
  containers.value = CONS.map(con => {
    return {
      key: generateId(),
      ...con,
      displayName: con.label
    }
  }).filter(con => {
    return !con.internal && !isBanned(con.type)
  })

  basicFields.value = BFS.map(fld => {
    return {
      key: generateId(),
      ...fld,
      displayName: fld.type
    }
  }).filter(fld => {
    return !isBanned(fld.type)
  })

  advancedFields.value = AFS.map(fld => {
    return {
      key: generateId(),
      ...fld,
      displayName: fld.type
    }
  }).filter(fld => {
    return !isBanned(fld.type)
  })

  customFields.value = CFS.map(fld => {
    return {
      key: generateId(),
      ...fld,
      displayName: fld.type
    }
  }).filter(fld => {
    return !isBanned(fld.type)
  })
}
const handleContainerWidgetClone = origin => {
  return props.designer.copyNewContainerWidget(origin)
}
const handleFieldWidgetClone = origin => {
  return props.designer.copyNewFieldWidget(origin)
}
const checkContainerMove = evt => {
  return props.designer.checkWidgetMove(evt)
}
const checkFieldMove = evt => {
  return props.designer.checkFieldMove(evt)
}
const addContainerByDbClick = container => {
  props.designer.addContainerByDbClick(container)
}
const addFieldByDbClick = widget => {
  props.designer.addFieldByDbClick(widget)
}
const loadFormTemplate = jsonUrl => {
  this.$confirm(
    this.i18nt('designer.hint.loadFormTemplateHint'),
    this.i18nt('render.hint.prompt'),
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  )
    .then(() => {
      axios
        .get(jsonUrl)
        .then(res => {
          let modifiedFlag = false
          if (typeof res.data === 'string') {
            modifiedFlag = props.designer.loadFormJson(JSON.parse(res.data))
          } else if (res.data.constructor === Object) {
            modifiedFlag = props.designer.loadFormJson(res.data)
          }
          if (modifiedFlag) {
            props.designer.emitHistoryChange()
          }

          this.$message.success('表单模板加载成功')
        })
        .catch(error => {
          this.$message.error('表单模板加载失败' + ':' + error)
        })
    })
    .catch(error => {
      console.error(error)
    })
}

loadWidgets()
// onMounted(() => {
//   scrollerHeight.value = window.innerHeight - 56 + 'px'
//   addWindowResizeHandler(() => {
//     nextTick(() => {
//       scrollerHeight.value = window.innerHeight - 56 + 'px'
//     })
//   })
// })
</script>

<style lang="less" scoped>
.color-svg-icon {
  -webkit-font-smoothing: antialiased;
  color: #7c7d82;
}

.side-scroll-bar {
  :deep(.n-scrollbar__wrap) {
    overflow-x: hidden;
  }
}

div.panel-container {
  padding-bottom: 10px;
}

.no-bottom-margin :deep(.n-tabs__header) {
  margin-bottom: 0;
}

.indent-left-margin {
  :deep(.n-tabs__nav) {
    margin-left: 20px;
  }
}

.n-collapse-item :deep(ul) > li {
  list-style: none;
}

.widget-collapse {
  border-top-width: 0;

  :deep(.n-collapse-item__header) {
    margin-left: 8px;
    font-style: italic;
    font-weight: bold;
  }

  ul {
    padding-left: 10px; /* 重置IE11默认样式 */
    margin: 0; /* 重置IE11默认样式 */
    margin-block-start: 0;
    margin-block-end: 0.25em;
    padding-inline-start: 10px;

    &:after {
      content: '';
      display: block;
      clear: both;
    }

    .container-widget-item,
    .field-widget-item {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      width: 98px;
      float: left;
      margin: 2px 6px 6px 0;
      cursor: move;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e8e9eb;
      border-radius: 4px;
      padding: 0 8px;
    }

    .container-widget-item:hover,
    .field-widget-item:hover {
      background: #f1f2f3;
      border-color: #ff4400;

      .color-svg-icon {
        color: #ff4400;
      }
    }

    .drag-handler {
      position: absolute;
      top: 0;
      left: 160px;
      background-color: #dddddd;
      border-radius: 5px;
      padding-right: 5px;
      font-size: 11px;
      color: #666666;
    }
  }
}

.n-card.ft-card {
  border: 1px solid #8896b3;
}

.ft-card {
  margin-bottom: 10px;

  .bottom {
    margin-top: 10px;
    line-height: 12px;
  }

  /*
    .image-zoom {
      height: 500px;
      width: 620px
    }
    */

  .ft-title {
    font-size: 13px;
    font-weight: bold;
  }

  .right-button {
    padding: 0;
    float: right;
  }

  .clear-fix:before,
  .clear-fix:after {
    display: table;
    content: '';
  }

  .clear-fix:after {
    clear: both;
  }
}
</style>
