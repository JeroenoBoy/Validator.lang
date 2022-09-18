

export type AnnotationArgument = string | number | boolean | RegExp | null;

export class Annotation {
	public arguments: AnnotationArgument[]

	constructor(
		public name: string,
		args: AnnotationArgument[]
	) {
		this.arguments = args
	}
}