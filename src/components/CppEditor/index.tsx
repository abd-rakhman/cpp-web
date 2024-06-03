import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/snippets/c_cpp"
import "ace-builds/src-noconflict/ext-searchbox"

import React from 'react';

interface CppEditorProps {
	code: string;
	setCode: (code: string) => void;
}

export const CppEditor = React.forwardRef<AceEditor, CppEditorProps>((
	{ code, setCode }, 
	ref,
) => {
	React.useEffect(() => {
		const aceRef = ref as React.MutableRefObject<AceEditor>;

		if (aceRef.current) {
			aceRef.current.editor.setShowPrintMargin(false);
		}
	}, [ref]);

	return (
		<AceEditor
			ref={ref}
			mode="c_cpp"
			theme="monokai"
			value={code}
			onChange={setCode}
			editorProps={{ 
				$blockScrolling: true, 
			}}
			setOptions={{
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				enableSnippets: true,
				showLineNumbers: true,
			}}
			fontSize={14}
			showPrintMargin={false}
			showGutter={true}
			highlightActiveLine={true}
			style={{
				width: '100%',
				height: '100%',
			}}
		/>
	);
});

CppEditor.displayName = 'CppEditor';
