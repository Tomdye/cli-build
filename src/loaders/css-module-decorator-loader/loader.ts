import { basename } from 'path';

export default function (this: any, content: string, map?: any): string {
	let response = content;
	const localsRexExp = /exports.locals = ({[.\s\S]*});/;
	const matches = content.match(localsRexExp);

	if (matches && matches.length > 0) {
		const localExports = JSON.parse(matches[1]);
		const themeKey = ' _key';
		const key = basename(this.resourcePath, '.css');
		localExports[themeKey] = key;

		const output = {
			default: localExports
		};

		response = content.replace(localsRexExp, `exports.locals = ${JSON.stringify(output)};`);
	}

	return response;
};
