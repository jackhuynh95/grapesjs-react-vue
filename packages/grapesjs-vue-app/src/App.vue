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
  const module = moduleDevelopment

  mountEditor = module.mountEditor;
  unmountEditor = module.unmountEditor;
  submitEditor = module.submitEditor;
  eventBusEditor = module.eventBus;

  // if (import.meta.env.MODE === 'production') {
  //   import('../build/dist/style.css');
  // }
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
  {
    imageId: 1175,
    published: true,
    displayOrder: 1,
    imageUrl:
      'https://affff.tiptopweb.com.au/newsletters/107/small-fdc65e41-c9ec-41f8-9f88-dbdf08585f06.jpg',
    imageLargeUrl:
      'https://affff.tiptopweb.com.au/newsletters/107/large-xfdc65e41-c9ec-41f8-9f88-dbdf08585f06.jpg',
    value:
      'https://affff.tiptopweb.com.au/newsletters/107/large-xfdc65e41-c9ec-41f8-9f88-dbdf08585f06.jpg',
    originalName: 'take-a-chance-to-win-pink',
    label: 'take-a-chance-to-win-pink',
    mediaType: 60,
    title: 'compet',
    col: 6,
    colSm: 4,
  },
  {
    imageId: 1176,
    published: true,
    displayOrder: 2,
    imageUrl:
      'https://affff.tiptopweb.com.au/newsletters/107/small-3d538961-5e79-4490-b3f8-5c1436af7534.jpg',
    imageLargeUrl:
      'https://affff.tiptopweb.com.au/newsletters/107/large-x3d538961-5e79-4490-b3f8-5c1436af7534.jpg',
    value:
      'https://affff.tiptopweb.com.au/newsletters/107/large-x3d538961-5e79-4490-b3f8-5c1436af7534.jpg',
    originalName: 'AFFFF24_Social_1080x1080px_THE NATURE OF LOVE',
    label: 'AFFFF24_Social_1080x1080px_THE NATURE OF LOVE',
    mediaType: 60,
    col: 0,
    colSm: 0,
  },
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

  localStorage.setItem('CURRENT_DOMAIN', 'www.affrenchfilmfestival.org');
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
