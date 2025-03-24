# Pokemon E-commerce
## Project description
This project is an fake e-commerce website about pokemon where users can explore products (pokemon), add them to the shopping cart or favorites and buy them (without actually making the payment).
## Project Structure
* **frontpoke/:** It has the application in React that shows the store.
* **Backend/:** API in node.js that manage database, users, products and cart.
## Technologies Used
### FrontEnd
* React.js
* React Router
* Css
### BackEnd
* Node.js
* Express.js
* PostgreSQL (from Render)
## Instalation and Execution Instructions
**1. Clone the Repository**
```
git clone https://github.com/DiegOrtiz09/pokemon-ecommerce.git
cd pokemon-ecommerce
```
**2. Install Dependencies**
  * Install Dependencies in Backend
```
cd Backend
npm install
```
  * Install Depedencies in Frontend
```
cd frontpoke
npm install
```
**3. Configure Enironment Variables**
  * Create a .env.local file at the root of Backend
  * Add necessary variables that are:
```
DB_HOST=your_url_of_postresql_in_render
DB_PORT=your_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_DATABASE=name_database

JWT_SECRET=your_jwt_secret_token
```
* Ask for the credentals to the developer if you want to try the database created.

**4. Execute the Backend**
* Open a terminal in the route of the project:
```
\Backend\src
```

* Run the backend

```
node server.js
```
* The backend will be running in port 5000.

**5. Execute the Frontend**
* Open a terminal in the route of the project:
```
frontpoke\
```
* Run in the frontend:
```
npm start
```

**6. Open your browser in http://localhost:3000**

## Additional Notes

* *The DataBase is hosted on Render and the access is restricted. To get the URL connection, contact the owner.*
* *To ensure proper functioning, verify the backend is running before execute the frontend.*
