# README #

## Requirements

You need to have Java JDK 21 installed on your machine and available on your path.
You need to have NodeJS installed on your machine and available on your path.


## How do I get set up? ###
### Instructions backend

The application is built using Gradle, via the included wrapper (`gradlew`).

- To build the application, use `gradlew clean build`
- Any tests that you add under the `tests` folder can be run using `gradlew clean test`
- To run the application, use `gradlew bootRun`

### Instructions frontend

The application is built using NodeJS

- To build the application, use `npm install`
- Any tests that you add under the `tests` folder can be run using `npx playwright test`
- To run the application, use `npm run start`
- To run the application in dev mode, use `npm run dev`


### Discussion ###

This task was build following the requirements 'Technical Assessment_ Java Full-Stack Task Management Application.pdf' i received

#### Backend part ####
    Built with Java, Spring boot, H2 database, Hibernate and etc...
    For the specific api i didnt add any custom queries to show injection security since the native methods are fully safe and i didnt had any specific functionality to have the opportunity to show more.
    I dissabled cors for the frontend both dev and prod, with more time i would implement build profiles that separate the two builds
    for error handling, in favor of development time i used exception handlers to sort and sanitize error output, only to be visible to developers
    Jackson config was a bit compromize, unually i configure request mappings to be more strict, in favor of time i dissabled extra values and added wildcard for date mapping (my prefer way vould be pre agreed datetime format) in order to save some time in formatting request on frontend side.
    Tests - i covered few basic scenarios since there isnt any complex business logic.

#### Frontend part ####
    Built with Vite, React, MaterialUI Axios and etc...
    Project structure is possibly bit chaotic for just one component, but it would make sense if more components would be needed.
    Hooks and most states are centralized and shared
    Service is used to communicate with backend and parse responses properly
    Interface types are used everywhere
    The only compromise here was the tablegrid, its working on client side in favor of time for developemnt.
    The endpoints and request models are prepared for all required features like pagination and sorting, but it would take a bit more time to setup.
    End to end test was added following the scenario of adding new Task and checking if its in the table.

#### H2 database ####   

to access H2 console navigate to 'http://localhost:8080/h2-console/' 

username: sa
password: password

if there are any issues check 'application.yaml'

database is set to be initialized on every startup

## Api structure ##

- localhost:8080
    - /api/v1
        - /task       
            - [GET]             # list all tasks 
            - [POST]            # save new task
            - [GET]     /{id}   # get task by id
            - [PATCH]   /{id}   # update task
            - [DELETE]  /{id}   # hard delete task
            - [GET]     /paged  # Get tasks by page (default first page ordered by id asc)
    - /h2-console               # h2 database console

### Who do I talk to? ###

Gjorgji Atanasovski
gorgi_atanasovski@outlook.com