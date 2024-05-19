// stores/pdfStore.js
import { defineStore } from 'pinia';

export const piniaStore = defineStore('pdfStore', {
  state: () => ({
    pdfUrl: '/pdfjs-annotation/pdfjs-4.2.67-dist/web/compressed.tracemonkey-pldi-09.pdf',
    isHightlightAnnotationActive: false,
  }),
  actions: {
    setPdfUrl(url) {
      this.pdfUrl = url;
    },
    setisHightlightAnnotationActive(value) {
      this.isHightlightAnnotationActive = value
    },
  },
});
