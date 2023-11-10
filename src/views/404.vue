<template>
  <n-form ref="formRef" inline :label-width="80" :rules="{}">
    <div>
      <div>
        <n-form-item label="姓名" path="user.name">
          <div>
            <div>
              <n-input
                v-model:value="formValue.user.name"
                placeholder="输入姓名"
              />
            </div>
          </div>
        </n-form-item>
      </div>
    </div>
    <n-form-item label="年龄" path="user.age">
      <n-input v-model:value="formValue.user.age" placeholder="输入年龄" />
    </n-form-item>
    <n-form-item label="电话号码" path="phone">
      <n-input v-model:value="formValue.phone" placeholder="电话号码" />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const formValue = ref({
  user: {
    name: '',
    age: ''
  },
  phone: ''
})
</script>
