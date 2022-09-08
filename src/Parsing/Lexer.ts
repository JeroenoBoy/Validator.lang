

export interface LexedNode {
	line: number,
	value: string
}


export function lexer(code: string): LexedNode[] {
	return code
		.split('\n')
		.map<LexedNode>((s, i) => (s = s.replace(/(\/\/.*)/, '')).trim() !== ''
		? ({line: i, value: s})
		: ({line: -1, value: s})
		)
		.filter(s=>s.line != -1);
}