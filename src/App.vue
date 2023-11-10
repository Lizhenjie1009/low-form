<template>
  <n-config-provider
    :theme="theme.naiveTheme"
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full"
  >
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui'

const theme = ref({
  naiveTheme: undefined,
  naiveThemeOverrides: {
    common: {
      primaryColor: '#1890ff',
      primaryColorSuppl: '#1890ff',
      primaryColorHover: '#40a9ff',
      primaryColorPressed: '#096dd9',
      primaryColorActive: '#1890ff1a',
      infoColor: '#096dd9',
      infoColorSuppl: '#096dd9',
      infoColorHover: '#2e8de6',
      infoColorPressed: '#0050b3',
      infoColorActive: '#096dd91a',
      successColor: '#52c41a',
      successColorSuppl: '#52c41a',
      successColorHover: '#73d13d',
      successColorPressed: '#389e0d',
      successColorActive: '#52c41a1a',
      warningColor: '#faad14',
      warningColorSuppl: '#faad14',
      warningColorHover: '#ffc53d',
      warningColorPressed: '#d48806',
      warningColorActive: '#faad141a',
      errorColor: '#f5222d',
      errorColorSuppl: '#f5222d',
      errorColorHover: '#ff4d4f',
      errorColorPressed: '#cf1322',
      errorColorActive: '#f5222d1a'
    },
    LoadingBar: {
      colorLoading: '#1890ff'
    }
  }
})
</script>
