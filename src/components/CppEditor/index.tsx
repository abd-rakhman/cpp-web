import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import React from 'react';

interface CppEditorProps {
	code: string;
	setCode: (code: string) => void;
}

export const CppEditor = ({ code, setCode }: CppEditorProps) => {
	const ref = React.useRef<AceEditor>(null);

	React.useEffect(() => {
		if (ref.current) {
			ref.current.editor.setShowPrintMargin(false);
		}
	}, []);

	return (
		<AceEditor
			ref={ref}
			mode="c_cpp"
			theme="monokai"
			value={code}
			onChange={setCode}
			editorProps={{ $blockScrolling: true }}
			setOptions={{
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				enableSnippets: true
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
}
