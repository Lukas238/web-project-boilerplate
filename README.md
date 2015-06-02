#Web-Project-Boilerplate
Boilerplate para proyectos web, con Gulp, Sass, y Bootstrap3.

##Tecnologías
- Sass
- Bootstrap-Sass-official
- Font-Awesome
- JQuery 1.11.13
- HTML5 tags on IE8.
- MediaQueries in IE8.

---

**Indice**

- [Estructura de carpetas](#estructura-de-carpetas)
- [Requerimientos](#requerimientos)
- [Tareas de Gulp](#tareas-de-gulp)
	- [Task: "dev"](#task-dev)
	- [Task: "comps"](#task-comps)
	- [Task: "build"](#task-build)

---

##Estructura de carpetas
	+---components
	+---dev
	+---dist
	+---src
		+---fonts
		+---images
		+---js
		+---scss
		¦   +---components
		+---vendors

- **\src**: Where all project files are developed.
- **\components**: Where all  individual HTML components are developed.
- **\dev**: Where the compiled project and live develop web server runs.
- **\dist**: Where the static compiled project reside, after a build.
	
		
##Requerimientos
- [Git] / [Git for Mac]
- [Node.js] / [Node.js for Mac])
- [Ruby] / [Ruby for Mac] with RVM
- [Gulp]
- [Bower]
- Any Git GUI like [SmartGit] / [SmartGit for Mac].

**Note**: In some networks Node.js or bower fail to access the packages because the _git://_ protocole is blocked. A workaround is to configure **Git** to globally use the protocol _https://_ instead.

Jus open the git console and run this command:
```
$ git config --global url."https://".insteadOf git://
```

##Tareas de Gulp

### Task: "dev"
_For development (default)_

```
$ gulp
```
This task compile all files from **\src** folder fo **\dev** folder, and start the web server for development.

### Task: "comps"
_For components_

```
$ gulp comps
```
This task compile all files from **\src** folder fo **\dev** folder, then copy the **\js**, **\css**, **\images**, and **\fonts** folder to the **\components** folder, and start the web server for component development.

### Task: "build"
_For distribution_

```
$ gulp build
```
This task compile all files from **\src** folder fo **\dist** folder.


[Git]: http://git-scm.com/download/win
[Git for Mac]: http://git-scm.com/download/mac
[Node.js]: http://nodejs.org/dist/v0.12.4/node-v0.12.4-x86.msi
[Node.js for Mac]: http://nodejs.org/dist/v0.12.4/node-v0.12.4.pkg
[Ruby]: http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.2.2.exe
[Ruby for Mac]: http://code.tutsplus.com/tutorials/how-to-install-ruby-on-a-mac--net-21664
[Gulp]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
[Bower]: http://bower.io/#install-bower
[SmartGit]: http://www.syntevo.com/smartgit/download?file=smartgit/smartgit-win32-setup-jre-6_5_8.zip
[SmartGit for Mac]: http://www.syntevo.com/smartgit/download?file=smartgit/smartgit-macosx-6_5_8.dmg

[Lucas Dasso]: http://www.c238.com.ar
