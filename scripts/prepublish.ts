import fs from 'fs';
import PATH from 'path';

//	Creating paths

const path = (...paths: string[]) => PATH.join(process.cwd(), ...paths);

const gitIgnorePath = path('/.gitignore');
const gitIgnoreTempPath = path('/.temp.gitignore');

//	Checking if the original exists

if (!fs.existsSync(gitIgnorePath))
	throw new Error(`Path ${gitIgnorePath} does not exist`);

//	Copy the gitignore file

const data = fs.readFileSync(gitIgnorePath, 'utf-8')
fs.writeFileSync(gitIgnoreTempPath, data);

//	Changing original gitingore

fs.writeFileSync(gitIgnorePath, data.replace(/^dist$/m, ''));

