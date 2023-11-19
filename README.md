# family-budget

## Know Issue:
- Account: Not work edit exists accounts
- Category: Not work edit exists categories

## Need add:
- Backend:
    - Auto choice currency for card
    - Add choice main account for user
    - Add endpoint for get user account state
    - Add endpoint for get family finance state

- Frontend:
    - add check for transaction succesfully added (exist problem with wrong date)
    - page for view account state by user 
    - page for view family finance state



## Load initial data
```bash
python manage.py import_users initial_data/Users.csv
python manage.py import_account_model_from_csv Account_Type initial_data/Account_Type.csv
python manage.py import_currency_model_from_csv Currency initial_data/currency.csv
python manage.py import_account_model_from_csv Account initial_data/Accounts.csv
python manage.py import_transaction_model_from_csv Transaction_Type initial_data/Transaction_Type.csv
python manage.py import_transaction_model_from_csv Category initial_data/category.csv
python manage.py import_family_and_budget_from_csv initial_data/families.csv initial_data/budget.csv initial_data/expense_items.csv initial_data/income_items.csv
python manage.py import_transaction_model_from_csv Transaction initial_data/Transactions.csv
```