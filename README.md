### Установка
1. Нужно установить [nodejs] (LTS версию).
2. Создайте отдельную папку для файлов.
3. В этой папке выполните команду:
```sh
npm install ad_maker
```
### Использование
В вашей директории должны быть два файла со следующими именами:
- **direct.csv** -- Экспортированный из Яндекс.Директ Командер
- **adwords** -- Экспортированные Adwords Editor

Для запуска выполните команду:
```sh
node node_modules\ad_maker
```
После выполнения в директории автоматически будут сгенерированы два новых файла:
- **Result-Yandex-direct.txt** -- Файл пригодный для импорта в Яндекс.Директ Командер
- **Not-found-keywords.txt** -- Пригодный для импорта в Exel список ключевых фраз, которые не были применены ни к одной группе.

[nodejs]: <https://nodejs.org>
