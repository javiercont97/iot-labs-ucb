# Introduction
This is my undergraduate project to obtain the degree in Mechatronic engineering at `Universidad Católica Boliviana "San Pablo"` college.
## Execute server
To wake up server it is first necessary to download dependencies using `npm`:
```
npm install
```
### There are two excecuting methods. One for development and other for production each of them are available in NPM script form.
- Develpment Initialization command
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
- __info():__
- __error():__
- __debug():__
## Debug levels
- __Debug Level 0:__ No debug
- __Debug Level 1:__ App status
- __Debug Level 2:__ API calls (functions called)
- __Debug Level 3:__ Data given to API functions
## Error Codes
There are groups of error codes describing
### Server Error (0x00-0x05)
- __0x00:__ Server cannot start
- __0x01:__ Cannot connect DB
### Router Error (0x06-0x0a)
- __0x06:__ Route unavailable
- __0x07:__ Route callback unimplemented
### CRUD error (0x0b- 0x0f)
- __0x0b:__ Cannot create Entity due to data incompleteness
- __0x0c:__ DB error while creating Entity
- __0x0d:__ DB error while retrieving Entity
- __0x0e:__ DB error while updating Entity
- __0x0f:__ DB error while deleting Entity
- __0x10:__ Cannot create Entity due to incorrect data