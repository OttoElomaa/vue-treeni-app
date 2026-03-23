// composables/useTheme.js or directly in your script setup
import { useDark, useToggle } from '@vueuse/core';

export const isDark = useDark({
  selector: 'html', // Where the class is applied
  attribute: 'class',
  valueDark: 'my-app-dark', // The class name PrimeVue is looking for
  valueLight: '', // No class for light mode
});

export const toggleDark = useToggle(isDark);