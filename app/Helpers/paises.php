<?php

function validateCountry($pais){
    if($pais){
        return in_array(intval($pais), [4,7,8,11,13,18,22,49,53,54,67,68]);
    }
}
