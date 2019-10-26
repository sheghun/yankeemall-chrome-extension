import {cp} from 'shelljs';

cp('*.html', 'dist');
cp('*.css', 'dist');
cp('manifest.json', 'dist');
cp('axios.min.js', 'dist');
cp('-R', 'images', 'dist');
