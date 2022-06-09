<?php

namespace app\helpers;

class ValidationHelper {
    public static function formatValidationErrors($errors) {
        $fieldErrors = [];

        foreach ($errors as $key => $val) {
            foreach ($val as &$message) {
                array_push($fieldErrors,
                    (object) [
                        "field" => $key,
                        "message" => $message
                    ]
                );
            }
        }

        return $fieldErrors;
    }
}