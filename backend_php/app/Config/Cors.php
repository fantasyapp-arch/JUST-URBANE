<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    /**
     * The default CORS configuration
     */
    public array $default = [
        'allowedOrigins'         => ['*'],
        'allowedOriginsPatterns' => [],
        'allowedHeaders'         => ['*'],
        'allowedMethods'         => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'exposedHeaders'         => [],
        'maxAge'                 => 7200,
        'supportsCredentials'    => true,
    ];
}