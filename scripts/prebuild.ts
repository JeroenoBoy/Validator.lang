import fs from 'fs';
import PATH from 'path';

//	Creating paths

const path = (...paths: string[]) => PATH.join(process.cwd(), ...paths);

const distPath = path('/dist');

//	Deleting original build

if (fs.existsSync(distPath))
	fs.rmSync(distPath, { recursive: true, force: true });