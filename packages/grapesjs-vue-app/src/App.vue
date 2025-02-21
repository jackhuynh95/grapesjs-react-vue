<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

//#region [Switching between Development and Production][OLD]
// Production
// import {
//   mountEditor,
//   unmountEditor,
//   submitEditor,
//   eventBus as eventBusEditor,
// } from '../build';
// import '../build/dist/style.css';

// Development
// import {
//   mountEditor,
//   unmountEditor,
//   submitEditor,
//   eventBus as eventBusEditor,
// } from "./WebEditor";
//#endregion
//#region [Switching between Development and Production][NEW]
import * as moduleDevelopment from './WebEditor';

let mountEditor, unmountEditor, submitEditor, eventBusEditor;

const loadEditorModule = async () => {
  const module =
    import.meta.env.MODE === 'production' ? await import('../build') : moduleDevelopment;

  mountEditor = module.mountEditor;
  unmountEditor = module.unmountEditor;
  submitEditor = module.submitEditor;
  eventBusEditor = module.eventBus;

  if (import.meta.env.MODE === 'production') {
    import('../build/dist/style.css');
  }
};
//#endregion

const isEditorMounted = ref(false);

const onSubmitEditor = async () => {
  const { pageData, htmlBodyContent } = await submitEditor();
  console.log('onSubmit', pageData, htmlBodyContent);
};

const mountUnmountEditor = () => {
  if (isEditorMounted.value) {
    unmountEditor();
    isEditorMounted.value = false;
  } else {
    mountEditor('editor-root');
    isEditorMounted.value = true;

    // Set content after a short delay
    setTimeout(() => {
      // Valid data
      // eventBusEditor.emit("changed-content", data.content)

      // Empty data
      // eventBusEditor.emit('changed-content', dataEmpty.content);
      // eventBusEditor.emit('changed-mediaList', getMediaList());
    }, 500);
  }
};

const getMediaList = () => [
  'https://via.placeholder.com/350x250/78c5d6/fff',
  'https://via.placeholder.com/350x250/459ba8/fff',
  'https://via.placeholder.com/350x250/79c267/fff',
  'https://via.placeholder.com/350x250/c5d647/fff',
  'https://via.placeholder.com/350x250/f28c33/fff',
  'https://via.placeholder.com/350x250/e868a2/fff',
  'https://via.placeholder.com/350x250/cc4360/fff',
  'https://via.placeholder.com/350x250/78c5d6/eee',
  'https://via.placeholder.com/350x250/459ba8/eee',
  'https://via.placeholder.com/350x250/79c267/eee',
  'https://via.placeholder.com/350x250/c5d647/eee',
  'https://via.placeholder.com/350x250/f28c33/eee',
  'https://via.placeholder.com/350x250/e868a2/eee',
  'https://via.placeholder.com/350x250/cc4360/eee'
];

const initializeColors = () => {
  // Color Picker -  change these colors suggestion
  const colors = [
    // WHITE
    '#FFFFFF',
    // BLACK
    '#000000',
    // MERIGOLD
    '#FC8717',
    // ADMIRAL
    '#538AB8',
    // ARCTIC
    '#66C6EC',
    // FLAMINGO
    '#D83A32',
    // ORCHID
    '#9A69E5',
    // LAVENDER
    '#B29AEA',
    // MANTIS
    '#81E5B2',
    // TEAL
    '#0DD2CC',
    // PERSIAN
    '#D58232',
    // GOLD RUSH
    '#FFC557',
    // IVORY
    '#FEE5AE',
    // CORAL
    '#EDBF4A',
    // EMERALD
    '#53BE5B',
  ];

  localStorage.setItem('CURRENT_DOMAIN', 'www.custom-domain.com');
  localStorage.setItem('CURRENT_COLORS_KEY', JSON.stringify(colors));
  localStorage.setItem('MAX_RECORD_SIZE', '50');
};

onMounted(async () => {
  // Initial colors
  initializeColors();

  // Initial load module
  await loadEditorModule();

  // Initial mount
  mountUnmountEditor();
});

onUnmounted(() => {
  if (isEditorMounted.value) {
    unmountEditor();
  }
});
</script>

<template>
  <button
    type="button"
    style="width: 100%; height: 50px"
    @click="onSubmitEditor"
  >
    Save
  </button>
  <button
    type="button"
    style="width: 100%; height: 50px"
    @click="mountUnmountEditor"
  >
    {{ isEditorMounted ? 'Unmount Editor' : 'Mount Editor' }}
  </button>
  <div id="editor-root"></div>
</template>

<style scoped></style>
