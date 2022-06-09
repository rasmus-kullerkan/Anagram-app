<?php

namespace app\models;

use yii\behaviors\TimestampBehavior;

abstract class ActiveRecord extends \yii\db\ActiveRecord {
    // Timestamps for creation and update.
    public function behaviors() {
        return [
            [
                'class' => TimestampBehavior::class,
                'createdAtAttribute' => 'createdAt',
                'updatedAtAttribute' => 'updatedAt',
                'value' => date('Y-m-d H:i:s')
            ],
        ];
    }
}