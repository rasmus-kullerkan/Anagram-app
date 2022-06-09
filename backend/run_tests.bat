if not exist database_test.sqlite (
    "./tests/bin/yii" migrate
)

"./vendor/bin/codecept" run