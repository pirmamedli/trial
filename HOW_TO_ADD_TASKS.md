# Как добавлять тесты в Studify без изменения JavaScript

Контент Studify теперь лежит в папке `content`.

Структура:

```text
content/
  index.json
  subjects.json
  tests/
    accent/
      test.json
    history-trial1/
      test.json
    _template/
      test.json
```

## Как добавить новый тест

1. Скопируй папку `content/tests/_template`.
2. Переименуй копию, например в `content/tests/social-economy`.
3. Открой файл `content/tests/social-economy/test.json`.
4. Замени `id`, название, предмет, XP и вопросы.
5. Добавь путь к тесту в `content/index.json`:

```json
{
  "subjects": "subjects.json",
  "tests": [
    "tests/accent/test.json",
    "tests/social-economy/test.json"
  ]
}
```

После этого тест автоматически появится в разделе `Задания` и на экране соответствующего предмета.

JavaScript менять не нужно.

## Шаблон `test.json`

```json
{
  "id": "socialEconomy",
  "subjectId": "social",
  "title": "Экономика: базовые понятия",
  "subtitle": "Обществознание",
  "resultTitle": "Экономика стала понятнее",
  "xpReward": 25,
  "questions": [
    {
      "question": "Что такое спрос?",
      "answers": ["Желание и возможность купить товар", "Любой товар", "Расписание уроков"],
      "correct": 0,
      "hint": "Спрос показывает желание и возможность покупателя приобрести товар."
    }
  ],
  "task": {
    "id": "social-economy-task",
    "day": "Сегодня",
    "date": "2026-06-09",
    "title": "Экономика: базовые понятия",
    "xp": 25
  }
}
```

## Список `subjectId`

- `russian` — Русский язык
- `basic-math` — Базовая математика
- `history` — История
- `social` — Обществознание
- `english` — Английский язык
- `geography` — География

## Важно

- Каждый тест должен лежать в отдельной папке.
- В каждой папке должен быть файл `test.json`.
- `id` теста должен быть уникальным.
- `task.id` тоже должен быть уникальным.
- `correct` — номер правильного ответа, начиная с нуля.
- В `questions` можно добавлять сколько угодно вопросов.
- Для загрузки JSON-файлов приложение нужно открывать через локальный сервер, а не напрямую через `file://`.
