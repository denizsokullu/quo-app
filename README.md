# Pink Design Guide

## Table of Contents

- [Installing pink components](#installing-pink-components-with-npm)
- [Sass](#sass)
- [Typography](#typography)
- [React](#react)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm run build](#npm-run-build)

## Installing pink components with NPM:

Pink components exists as a package on [Artifactory](https://artifactory.swg.usma.ibm.com/artifactory/webapp/#/artifacts/browse/simple/General/v-ess-npm/@connections/pink-components) as @connections/pink-components.

### Using Artifactory
To use npm Artifactory follow theses instructions

1. Open terminal and type:

```
npm config set @connections:registry https://artifactory.swg.usma.ibm.com/artifactory/api/npm/v-ess-npm-dev/
```
2. Then run ```npm install```

```
npm install
```
3. After all packages have installed, run ```npm start``` to fire up the app.

The pink-components repository consists of SASS, HTML and some vanilla javascript. You can preview the components we are building in the [components section](/components/accordion) of this website.


## Sass:

To include all of pink-component styles in your project, simply add the following to your existing stylesheet, preferably at the top of the file:

```scss
@import 'node_modules/@connections/pink-components/src/globals/scss/styles.scss';
```

If you would like to include component styles on a case-by-case basis, you can include styles individually like so:

```scss
@import 'node_modules/@connections/pink-components/src/components/[ COMPONENT FOLDER ]/[ COMPONENT].scss’;
```
 
## Typography
     
For our visual design language we use a fixed type scale map, [which can be seen here](https://github.ibm.com/connections-incubator/pink-components/blob/master/src/globals/scss/_typography.scss
).
 
This helps us stay strict and consistent with a set amount of font sizes. These should map to any font sizes seen in the specs provided by the designers. You can use these font sizes via the font-size Sass mixin:

```scss 
@include font-size('38');
``` 
 
## React:

Pink components are forked from the [Carbon Design system](carbondesignsystem.com). This means that styles from pink-components will automatically work with carbon repositories like [carbon-components-react](https://github.com/carbon-design-system/carbon-components-react). Preview their [storybook here](http://react.carbondesignsystem.com/).
 
Simply import React components like so:

```javascript
import { CodeSnippet, Tabs, Tab } from 'carbon-components-react';
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.
