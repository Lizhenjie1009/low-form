<template>
  <n-modal
    id="basic-modal"
    v-model:show="value"
    preset="card"
    class="custom-card"
    size="huge"
    :bordered="false"
    transform-origin="center"
    :closable="true"
    :mask-closable="true"
    @mask-click="maskClick"
    @close="maskClick"
  >
    <template #header>
      <div id="basic-modal-bar" class="w-full cursor-move">{{ title }}</div>
    </template>
    <slot></slot>
    <template #footer>
      <div v-if="footer" class="w-full flex justify-end">
        <n-button
          strong
          secondary
          type="info"
          class="mr-14px"
          @click="maskClick"
        >
          取消
        </n-button>
        <n-button type="info" @click="e => emit('submit', e)"> 确定 </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import startDrag from '@/utils/drag'

interface PropsOps {
  modelValue: boolean
  title: string
  footer?: boolean
}
const value = computed({
  get() {
    return props.modelValue
  },
  set(bool) {
    emit('update:modelValue', bool)
  }
})
const props = withDefaults(defineProps<PropsOps>(), {
  modelValue: false,
  title: '标题',
  footer: true
})
const emit = defineEmits(['update:modelValue', 'submit'])
watch(
  () => props.modelValue,
  bool => {
    emit('update:modelValue', bool)
    if (bool) {
      nextTick(() => {
        const oBox = document.getElementById('basic-modal')
        const oBar = document.getElementById('basic-modal-bar')
        startDrag(oBar, oBox)
      })
    }
  }
)
const maskClick = () => emit('update:modelValue', false)
</script>
