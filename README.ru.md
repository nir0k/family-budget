# family-budget

#### Choose Your Language

- [English](README.md)
- [Русский](README.ru.md)

---


Проект **"family-budget"** представляет собой комплексное решение для управления финансами семьи. Основная цель проекта - обеспечить удобный и понятный инструмент для контроля и планирования семейного бюджета.

## Основные функции:

- **Внесение расходов и доходов**: пользователи могут удобно вносить информацию о своих финансовых операциях, как за себя, так и за других членов семьи.
- **Трансфер денег между счетами**: в приложении предусмотрена возможность перевода денежных средств между счетами членов семьи, что обеспечивает гибкое управление финансами.
- **Мультивалютность**: поддержка операций в различных валютах, включая возможность ввода курса валют на конкретный день, позволяет учитывать финансовые операции в международном контексте.
- **Редактирование операций**: после внесения информации о финансовой операции есть возможность ее редактирования, что добавляет гибкости в учет.
- **Управление пользователями**: возможность добавления и удаления членов семьи из системы управления бюджетом.
- **Создание месячного бюджета**: пользователи могут планировать свои траты по конкретным категориям на месяц вперед.
- **Просмотр финансового состояния**: система позволяет отслеживать текущее финансовое положение всей семьи, учитывая средства на всех счетах.

## Используемые технологии:
- **Django** для реализации backend части.
- **React** для создания пользовательского интерфейса.
- **Docker** используется для развертывания приложения.
- **PostgreSQL** выбрана в качестве системы управления базами данных.

## Известные проблемы:

- Отсутствие функционала для клонирования текущего бюджета.
- Невозможность корректировки баланса счета напрямую.
- Ограниченные возможности для просмотра исторических данных.
- Отсуствие автоматической загрузки данных о курсах валют
- Необходимо добавление тестов для конвертора валют и пользовательского API.

Этот проект открыт для участия сообщества, и мы приглашаем разработчиков присоединиться к работе над его улучшением и развитием.


## Как запустить:

<details>
<summary>Запуск в продакшн</summary>

1. Скопировать в директорию файл `docker-compose.production.yml`
2. Рядом создать файл .env на основе шаблона `.evn.example`
3. Выполнить 

    ```sh
    sudo docker compose -f docker-compose.production.yml pull
    docker compose -f docker-compose.production.yml
    sudo docker compose -f docker-compose.production.yml down
    sudo docker compose -f docker-compose.production.yml up -d
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py migrate
    sudo docker compose -f docker-compose.production.yml exec backend python manage.py collectstatic
    sudo docker compose -f docker-compose.production.yml exec backend cp -r /app/collected_static/. /backend_static/static/
    ```

4. Загрузка начальных данных:

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


<summary>Запуск проекта в среде разработки</summary>

1. Скопировать в директорию файл `docker-compose.yml`
2. Рядом создать файл .env на основе шаблона `.evn.example`
3. Выполнить 

    ```sh
    sudo docker compose -f docker-compose.yml pull
    docker compose -f docker-compose.production.yml
    sudo docker compose -f docker-compose.yml down
    sudo docker compose -f docker-compose.yml up -d
    sudo docker compose -f docker-compose.yml exec backend python manage.py migrate
    sudo docker compose -f docker-compose.yml exec backend python manage.py collectstatic
    sudo docker compose -f docker-compose.yml exec backend cp -r /app/collected_static/. /backend_static/static/
    ```

4. Загрузка начальных данных:

    ```sh
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_users initial_data/Users.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_account_model_from_csv Account_Type initial_data/Account_Type.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_currency_model_from_csv Currency initial_data/currency.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_account_model_from_csv Account initial_data/Accounts.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_transaction_model_from_csv Transaction_Type initial_data/Transaction_Type.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_transaction_model_from_csv Category initial_data/category.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_budget Family initial_data/families.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_budget Budget initial_data/budget.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_budget ExpenseItem initial_data/expense_items.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_budget IncomeItem initial_data/income_items.csv
    sudo docker compose -f docker-compose.yml exec backend python manage.py import_transaction_model_from_csv Transaction initial_data/Transactions.csv
    ```

</details>

---

### Этот проект открыт для участия сообщества, и мы приглашаем разработчиков присоединиться к работе над его улучшением и развитием.
