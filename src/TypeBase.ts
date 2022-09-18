import { Annotation } from './Annotation';
import { Validator } from './Validator';

export abstract class BaseType {

	public abstract readonly type: string;
	public abstract parse(name: string, annotations: Annotation[], validator: Validator): string;
}