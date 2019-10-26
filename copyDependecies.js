"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shelljs_1 = require("shelljs");
shelljs_1.cp('*.html', 'dist');
shelljs_1.cp('*.css', 'dist');
shelljs_1.cp('manifest.json', 'dist');
shelljs_1.cp('axios.min.js', 'dist');
shelljs_1.cp('-R', 'assets', 'dist');
//# sourceMappingURL=copyDependecies.js.map