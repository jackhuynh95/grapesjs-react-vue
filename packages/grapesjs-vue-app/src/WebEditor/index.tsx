import ReactDOM from "react-dom/client";
import WebEditor from "./examples/Editor.tsx";

let root: ReactDOM.Root | null = null;

const mountEditor = (id: string) => {
  const ele = document.getElementById(id);
  if (ele) {
    root = ReactDOM.createRoot(ele);
    root.render(<WebEditor />);
  }
};

const unmountEditor = () => {
  if (root) {
    root.unmount();
    root = null;
  }
};

export { mountEditor, unmountEditor };

//#region [Event Bus]
import mitt from 'mitt';

// Create an event bus
const emitter = mitt();

emitter['once'] = (type: string, handler: (args: any) => void) => {
  const fn = (args: any) => {
    emitter.off(type, fn);
    handler(args);
  };

  emitter.on(type, fn);
};

export const eventBus = {
  once: emitter['once'],
  on: emitter.on,
  off: emitter.off,
  emit: emitter.emit,
};

// Export the submit function from useEditorContext
export const submitEditor = (): Promise<{ pageData: any, htmlBodyContent: string }> => {
  return new Promise((resolve) => {
    eventBus.once('onSubmit', ({ pageData = undefined, htmlBodyContent = '' }) => {
      resolve({ pageData, htmlBodyContent });
    });
    eventBus.emit('submitted-trigger');
  });
};
//#endregion