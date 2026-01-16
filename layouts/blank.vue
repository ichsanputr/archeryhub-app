<template>
  <div>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
// Define component name to fix linter error
defineOptions({
  name: 'BlankLayout'
})
</script>
