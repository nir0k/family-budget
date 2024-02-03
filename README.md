# family-budget

#### Choose Your Language

- [English](README.md)
- [Русский](README.ru.md)

---


The **"family-budget"** project is a comprehensive solution for family finance management. The main goal of the project is to provide a convenient and understandable tool for controlling and planning the family budget.

## Main Features:

- **Entering expenses and incomes**: Users can conveniently enter information about their financial transactions, both for themselves and for other family members.
- **Money transfers between accounts**: The application allows for the transfer of funds between family members' accounts, ensuring flexible financial management.
- **Multi-currency support**: Operations in various currencies, including the ability to enter exchange rates for a specific day, allow for financial operations in an international context.
- **Editing operations**: After entering information about a financial operation, it is possible to edit it, adding flexibility to the accounting.
- **User management**: The ability to add and remove family members from the budget management system.
- **Creating a monthly budget**: Users can plan their spending by specific categories for the month ahead.
- **Viewing financial status**: The system allows tracking the current financial position of the entire family, considering the funds in all accounts.

## Technologies Used:
- **Django** for backend implementation.
- **React** for creating the user interface.
- **Docker** is used for application deployment.
- **PostgreSQL** is chosen as the database management system.

## Known Issues:
- Lack of functionality to clone the current budget.
- No ability to directly adjust account balance.
- Limited capabilities for viewing historical data.
- Absence of automatic currency exchange rate data loading.
- Need to add tests for the currency converter and user API.


## How to Run the Project
Launching the project involves using Docker-compose to clone the repository, navigate to the project directory, and start the container build

<details>
<summary>Run the Project in production</summary>

1. Copy file `docker-compose.production.yml` to directory
2. Next create a .env file based on the template `.evn.example`
3. Execute 

    ```sh
    sudo docker compose -f docker-compose.production.yml pull
    docker compose -f docker-compose.production.yml
    sudo docker compose -f docker-compose.production.yml down
    sudo docker compose -f docker-compose.production.yml up -d
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py migrate
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py collectstatic
    sudo docker compose -f docker-compose.production.yml exec backend cp -r /app/collected_static/. /backend_static/static/
    ```

4. Loading initial data:

    ```sh
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_users initial_data/Users.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_account_model_from_csv Account_Type initial_data/Account_Type.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_currency_model_from_csv Currency initial_data/currency.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_account_model_from_csv Account initial_data/Accounts.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_transaction_model_from_csv Transaction_Type initial_data/Transaction_Type.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_transaction_model_from_csv Category initial_data/category.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_budget Family initial_data/families.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_budget Budget initial_data/budget.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_budget ExpenseItem initial_data/expense_items.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_budget IncomeItem initial_data/income_items.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_transaction_model_from_csv Transaction initial_data/Transactions.csv
    ```

</details>


<details>
<summary>Run the Project in Dev</summary>

1. Copy file `docker-compose.production.yml` to dicrectory
2. Next create a .env file based on the template `.evn.example`
3. Execute 

    ```sh
    sudo docker compose -f docker-compose.production.yml pull
    docker compose -f docker-compose.production.yml
    sudo docker compose -f docker-compose.production.yml down
    sudo docker compose -f docker-compose.production.yml up -d
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py migrate
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py collectstatic
    sudo docker compose -f docker-compose.production.yml exec backend cp -r /app/collected_static/. /backend_static/static/
    ```

4. Loading initial data:

    ```sh
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_users initial_data/Users.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_account_model_from_csv Account_Type initial_data/Account_Type.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_currency_model_from_csv Currency initial_data/currency.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_account_model_from_csv Account initial_data/Accounts.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_transaction_model_from_csv Transaction_Type initial_data/Transaction_Type.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_transaction_model_from_csv Category initial_data/category.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_budget Family initial_data/families.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_budget Budget initial_data/budget.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_budget ExpenseItem initial_data/expense_items.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_budget IncomeItem initial_data/income_items.csv
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py import_transaction_model_from_csv Transaction initial_data/Transactions.csv
    ```

</details>

---

### This project is open for community participation, and we invite developers to join the work on improving and developing it.
