# Churn Prediction and Visualization Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Price](https://img.shields.io/badge/price-FREE-0098f7.svg)](https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE)
[![GitHub package version](https://img.shields.io/github/package-json/v/codedthemes/mantis-free-react-admin-template)](https://github.com/codedthemes/mantis-free-react-admin-template/)


## Introduction

This project is a churn prediction and visualization dashboard for a telecommunications company. It aims to predict customer churn and provide insightful visualizations to help the company understand and mitigate churn.
* Features

    * Churn Prediction: Uses machine learning to predict the likelihood of a customer leaving.
    * Interactive Visualizations: Provides various charts and graphs to visualize customer data and churn predictions.
    * User Authentication: Secure login system using JWT.
    * Responsive Design: Compatible with both desktop and mobile devices.

## Preview

- [Demo]


## Architecture

The project is built using a React frontend and a Flask backend.

* Frontend

    * React: Handles the user interface and client-side logic.
    * Material-UI: Provides a set of React components for faster and easier web development.

* Backend

    * Flask: Provides the API endpoints and handles server-side logic.
    * SQLAlchemy: Used for ORM (Object Relational Mapping) to interact with the database.
    * Redis: Used for caching.
    * JWT: Used for secure user authentication.
    * Pandas: Utilized for reading the ML model for prediction.
    * Scikit-Learn: Utilized for the churn prediction model.

* Database
    * PostgreSQL: Stores user data and churn predictions.
## Getting Started

### FrontEnd
1. Install packages

```
yarn
```

2. Run project

```
yarn start
```

### BackEnd
1. Install packages

```
flask
```
2. Place cmd in server folder

```
cd server
```

3. Activate virtual env

```
.\env\scripts\activate.bat
```

4. Run project

```
flask run
```

## Usage

    Start the Flask backend server.
    Start the React frontend.
    Open your browser and navigate to http://localhost:3000 to access the dashboard.

## Technologies Used

    Frontend: React, Material-UI, JavaScript
    Backend: Flask, Python, SQLAlchemy, Redis, JWT, Pandas, Scikit-Learn
    Database: PostgreSQL

License

This project is licensed under the MIT License - see the LICENSE file for details.
Contact

    Name: Abib Fatima
    Email: fatima.abib5@gmail.com
    GitHub: AbibFatima
    or
    Name: Bouzidi Sarra
    Email: sarrabzd29@gmail.com
    GitHub: sarrabzd29

