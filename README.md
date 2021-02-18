# sunbird-questionset-editor
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.29.

## Common angular components for Sunbird Question Editor!


### Getting Started 

### Local development follow below steps

###### Step 1 : Clone the Project and install necessary dependencies of the Project by following steps:  

    npm install 

###### Step 2 : Run ng build to build the project:

    ng build question-editor-library

    The build artifacts will be stored in the dist/question-editor-library.
    
###### Step 3 : Run node `server.js` for proxy the api's 

  ```
go to server.js file 

Update the host variable to which env your pointing. example if you are pointing sunbird dev instance update veriable like below
const host = 'dev.sunbirded.org'

add `authorization` token as shown below
proxyReqOpts.headers['authorization'] = 'Bearer XXXX'  
  
  ```


### How to use NPM Sunbird-Questionset-Editor library in your Project 

For help getting started with a new Angular app, check out the Angular CLI.

For existing apps, follow these steps to begin using .

###### Step 1: Install the following packages

    npm i @project-sunbird/sunbird-question-editor
  
######  Step 2: Include the Sunbird assets in angular.json 

    "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "./node_modules/@project-sunbird/sunbird-question-editor/lib/assets/",
                "output": "/assets/"
              }
            ],

######  Step 3: Import the modules and components

Import the NgModule for each component you want to use:

    import { QuestionEditorLibraryModule } from 'sunbird-question-editor';


    @NgModule({
	    ...
	    imports: [ 
            QuestionEditorLibraryModule,
	    ...
    })

### How to use question editor
In your template add 

	<lib-editor [editorConfig]="editorConfig" (editorEmitter)="editorEventListener($event)" ></lib-editor>

#### Input for library 

    editorConfig: {
        context: {
            identifier: 'do_1132125506761932801130',
            user: {},
            framework: '',
            channel: '',
            uid: "
        },
        config: {
            mode: 'edit', // edit / review / read
            maxDepth: 0,
            objectType: 'QuestionSet',
            primaryCategory: 'Practice Question Set',
            isRoot: true,
            iconClass: 'fa fa-book',
            children: {
                Question: [
                    'Multiple Choice Question',
                    'Subjective Question'
                ]
            },
            hierarchy: {}
        }
    }

#### Output from library

    {
      "eventType": "CLOSE"
    }
