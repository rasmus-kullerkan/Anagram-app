<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%user}}`.
 */
class m220425_081305_create_user_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%user}}', [
            'id' => $this->primaryKey(),
            'createdAt' => $this->dateTime(),
            'updatedAt' => $this->dateTime(),
            'username' => $this->text(),
            'password' => $this->text(),
            'accessToken' => $this->text(),
            'accessTokenExpiresAt' => $this->dateTime(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%user}}');
    }
}
