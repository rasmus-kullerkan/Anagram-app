<?php

namespace app\models;

class Wordbase extends ActiveRecord {
    public static function tableName() {
        return 'wordbase';
    }

    public function rules() {
        return [
            [['name', 'words'], 'required'],
            ['name', 'string'],
            ['words', 'each', 'rule' => ['string']],
            ['name', 'unique']
        ];
    }
    
    // Not sure if this the correct way to store an array as string.

    public function afterFind() {
        parent::afterFind();

        $this->words = explode(",", $this->words);
    }

    public function afterSave($insert, $changedAttributes) {
        $this->words = explode(",", $this->words);

        return parent::afterSave($insert, $changedAttributes);
    }

    public function beforeSave($insert) {
        $this->words = implode(",", $this->words);
    
        return parent::beforeSave($insert);
    }
}