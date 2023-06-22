import type { Editor } from 'grapesjs';
import { createContext, useContext, useState } from 'react';

const EditorInstanceContext = createContext<EditorInstanceState | null>(null);

export interface EditorInstanceState {
    editor?: Editor,
    setEditor: (editor: Editor) => void,
}
export const EditorInstanceProvider = ({ children }: {
    children?: React.ReactNode,
}) => {
    const [state, setState] = useState<EditorInstanceState>({
        setEditor: editor => {
            setState({ ...state, editor });
        }
    });

    return (
        <EditorInstanceContext.Provider value={state}>
            { children }
        </EditorInstanceContext.Provider>
    )
};

/**
 * Context used to keep the editor instance once initialized
 */
export const useEditorInstance = () => {
    const context = useContext(EditorInstanceContext);

    if (!context) {
        throw new Error('useEditorInstance must be used within EditorInstanceProvider');
    }

    return context;
};


export const useEditor = () => {
    // TODO ensure editor is used inside provider
    return useEditorInstance().editor;
}

export default EditorInstanceContext;