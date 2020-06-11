# Introduction
This is my undergraduate project to obtain the degree in Mechatronic engineering at `Universidad Católica Boliviana "San Pablo"` college.
## Execute server
To wake up server it is first necessary to download dependencies using `npm`
```
npm install
```
### Initialization methods
- Develpment Initialization command()
```
npm run devel-env
```
- Normal Initialization command
```
npm start
```
## Build (compilation)
To generate a production ready build run the `Build command`
```
npm run build
```
# Features
## User's Database manager
Basic CRUD Operations will be implemented soon
# Logging system
## Log target
- __Console logger:__ Prints logs to the console. This method is useful for develpment
- __File logger:__ Saves logs to files located in the `log` folder. This method can be used to persist logs in production environment
## Methods
- __verbose():__
- __info():__
- __warning():__
- __error():__