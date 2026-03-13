<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { RouterLink } from 'vue-router';


const isDark = useDark();
const toggleDark = useToggle(isDark);

</script>


<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <div class="tab-group">
        <RouterLink to="/intake"  class="tab-btn" active-class="active">Intake</RouterLink>
        <RouterLink to="/analyze" class="tab-btn" active-class="active">Analyze</RouterLink>
      </div>
      <button
        class="theme-btn"
        @click="toggleDark()"
      >
        {{ isDark ? '☀' : '☽' }}
      </button>
    </div>
  </nav>
</template>



