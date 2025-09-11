Kindly follow the instructions to run the server on your local machine
The app comprises of a server written in node (expressjs) and a MySQL database.
Requiremnents; yOu need to have the following installed on your machine in order to run the app
1. Nodejs (be able to use npm or yarn)
2. Xammp or any PHP stack (PHP, mySQL, phpMyAdmin)
3. It is recommended to run the app in vscode
Steps in setting up the database

Create a database with the name "food_app"
Locate the food_app.sql file in the root repo and dump it in the database you created. Google how to do it online if you are not sure how to go about it

Steps in installing the server and running it

Clone the latest repo (NOTE: brance is develop)
Run "npm install" command to install all packages the server needs. Please ensure you delete the original node_modules file before this... this causes some runtime issues sometime.
create a new file called .env (you can do this via the teminal with this command "touch .env")
Now enter the correct database connection credentials here in the format below

DB_HOST = localhost
DB_user = root
DB_password = (enter you db password here)
DB_name = food_app
DB_port = 8889 (default port)
SERVER_PORT = 3000
note the server_port id, you will need this to open the app in your local brower or postman ie http://localhost:3000/

Now Open the terminal and  run the npm start command to start the server. Make sure you are in the root directory of the app
Check the a message like  "App started and running successfully on PORT ... "; this confirms your app is running successfully, anything apart from this is an error, you have to fix it yourself or start over again (^)

Now headover to postman to test the endpoints.... the address is http:localhost:3000/api/adduser for adduser etc....

You can open the collection file shared in the clikc up group for all the endpoints and their request and responses.

We are in this together, we shall surely get there.. just a litle push...