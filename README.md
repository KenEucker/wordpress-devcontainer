# Wordpress Dev Box
This is a simple little wordpress developer environment which provides source files to modify then compile, build, and deploy to a local wordpress installation running in a docker container. 

As a quikstart, I've included the understrap child theme (https://understrap.com/). The compilation task runs the necessary tasks to update the understrap child theme. To use a different theme package, delete the files in the src/theme folder and update the compilation tasks as needed.

# Quikstart
## Install
Run `npm install` to install the required node packages.

## Run and deploy local wordpress
`npm run start` - creates the docker environment, if it does not exist, and runs wordpress at http://localhost:8080. Run `npm run deploy` to copy all of the plugin and theme files to the wordpress installation. The theme and plugin will need to be activated from the wordpress admin after the first deploy. After making changes to the source files, run `npm run redeploy` to have wordpress reflect those changes.

# Requirements
## These items are assumed to be installed
* [NodeJs](https://nodejs.org/en/download/)

* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (Note: for all tasks, `npm` can be replaced with `yarn`)

* [docker](https://runnable.com/docker/getting-started/)

# Development 
## Compiling
After making changes to the theme or plugin source files, some items may need compiled. Compilation occurs within the source folder, and will change the source files, not the files running in wordpress. Compilation come before building, where those source files are copied to the build folder. 

## Building
The build process copies the source files into the build folder where they will fall into the wordpress wp-content folder structure and be named according to the configuration found in the package.json. The build files should be only what needs to go to wordpress, and nothing more. Files from the source folder can be excluded by using the configuration found in the package.json.

## Deploying
The deploy process copies the contents of the build folder into wordpress. After deploying, you will see your changes reflected in the dist folder and on wordpress. Be careful making any modifications in the build or dist folders, as these changes will not make it into the source of the project.

## Running wordpress
To run wordpress on your local machine, run `npm run start` to bring the docker container up. Soon, http://localhost:8080, will be available. If this is the first time you've run wordpress, you'll need to set up the wordpress site and create the first user credentials.

## Using the theme and plugin with wordpress
On a fresh version of wordpress, you'll need to enable the theme and plugin in the wordpress admin. When using the child theme for understrap, you'll find that there's an error where the parent theme is missing from wordpress. You can click to install it from the theme settings menu in the wordpress admin.

## Stopping wordpress
To stop the docker environment, run `npm run stop`. This does not destory the wordpress installation.

# Other

## Teardown
To stop the docker environment and completely delete it, as well as the dist folder, run `npm run teardown`. Doing so will erase all of the changes made to this local wordpress.

## ReDeploy
If you've made changes to the source files, you can run `npm run redeploy` and every process to push the changes to wordpress will run.

# Philosophy
This is a testbed or development environment intended to run a theme or plugin in complete isolation on a vanilla wordpress install. You'll notice that the source folder contains 'theme' not theme(s) as well as 'plugin' not plugin(s), this is to enforce the isolation of this environment down to a singlular concerns. Any external dependencies needed can still be installed to wordpress as needed, but these settings may be lost if the docker environment is deleted (`teardown`).

# Vendors that make this project possible
[Understrap](https://understrap.com/)

[Wordpress](https://wordpress.org/)

[Docker](https://www.docker.com/)
