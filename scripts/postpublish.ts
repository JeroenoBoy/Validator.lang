import fs from 'fs';
import PATH from 'path';

//	Creating paths

const path = (...paths: string[]) => PATH.join(process.cwd(), ...paths);

const gitIgnorePath = path('/.gitignore');
const gitIgnoreTempPath = path('/.temp.gitignore');

//	Checking if the temp exists

if (!fs.existsSync(gitIgnoreTempPath))
	throw new Error(`Path ${gitIgnoreTempPath} does not exist`);

//	Copy the temp to original gitignore file

const data = fs.readFileSync(gitIgnoreTempPath, 'utf-8')
fs.writeFileSync(gitIgnorePath, data);

//	Deleting temp gitignore

fs.rmSync(gitIgnoreTempPath);
