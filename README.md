#Web-Project-Boilerplate
Boilerplate for web projects with gulp, sass, and bootstrap.Boilerplate for web projects.


##Folder structure
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
	
		
##Requirements:
- Node.js
- Ruby
- Gulp
- Bower

###Support
- Sass
- Bootstrap-Sass-official
- Font-Awesome
- JQuery 1.11.13
- HTML5 tags on IE8.
- MediaQueries in IE8.


##Gulp Tasks

### Task: Dev | Development (default)

```
$	gulp
```
This task compile all files from **\src** folder fo **\dev** folder, and start the web server for development.

### Task: Comps | Components

```
$	gulp comps
```
This task compile all files from **\src** folder fo **\dev** folder, then copy the **\js**, **\css**, **\images**, and **\fonts** folder to the **\components** folder, and start the web server for component development.

### Task: Build | Distribution

```
$	gulp build
```
This task compile all files from **\src** folder fo **\dist** folder.

