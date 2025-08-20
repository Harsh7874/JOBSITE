// This is the test backend for the job search site //

Setup Prerequisites:

Any user is required to register first to use this application or to get token .

All the apis are protected by using , hence use the token in the HEADER for authentication by field name token and value will be the hashed key fetched from backend.
.
The resume will only get uploaded if the field value is "resume" and the file have extension as .pdf.

The jobId can be taken from the job.js file for testing.



Here are the apis to test the application:

For Registration: (method : POST ):-     http://localhost:5000/auth/register

For login: (method : POST ):-     http://localhost:5000/auth/login

For Resume upload: (method : POST ):- http://localhost:5000/auth/resume/upload

For fetch our Resume: (method : GET ):- http://localhost:5000/auth/myresume

To Apply for any job : (method : POST ):- http://localhost:5000/auth/jobs/apply/:jobId

To see our job Application : (method : GET ):- http://localhost:5000/auth/myapplication

To list all job : (method : GET ):- http://localhost:5000/auth/job/list





