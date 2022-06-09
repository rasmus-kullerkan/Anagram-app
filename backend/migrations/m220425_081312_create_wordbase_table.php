<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%wordbase}}`.
 */
class m220425_081312_create_wordbase_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%wordbase}}', [
            'id' => $this->primaryKey(),
            'createdAt' => $this->dateTime(),
            'updatedAt' => $this->dateTime(),
            'name' => $this->text(),
            'words' => $this->text(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%wordbase}}');
    }
}
