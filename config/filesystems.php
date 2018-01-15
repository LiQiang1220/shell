<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. A "local" driver, as well as a variety of cloud
    | based drivers are available for your choosing. Just store away!
    |
    | Supported: "local", "ftp", "s3", "rackspace"
    |
    */

    'default' => 'local',

    /*
    |--------------------------------------------------------------------------
    | Default Cloud Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Many applications store files both locally and in the cloud. For this
    | reason, you may specify a default "cloud" driver here. This driver
    | will be bound as the Cloud disk implementation in the container.
    |
    */

    'cloud' => 's3',

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been setup for each driver as an example of the required options.
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root'   => storage_path('app'),
        ],

        'ftp' => [
            'driver'   => 'ftp',
            'host'     => 'ftp.example.com',
            'username' => 'your-username',
            'password' => 'your-password',

            // Optional FTP Settings...
            // 'port'     => 21,
            // 'root'     => '',
            // 'passive'  => true,
            // 'ssl'      => true,
            // 'timeout'  => 30,
        ],

        's3' => [
            'driver' => 's3',
            'key'    => 'your-key',
            'secret' => 'your-secret',
            'region' => 'your-region',
            'bucket' => 'your-bucket',
        ],

        'rackspace' => [
            'driver'    => 'rackspace',
            'username'  => 'your-username',
            'key'       => 'your-key',
            'container' => 'your-container',
            'endpoint'  => 'https://identity.api.rackspacecloud.com/v2.0/',
            'region'    => 'IAD',
            'url_type'  => 'publicURL',
        ],

<<<<<<< HEAD
=======
        
       'qiniu' => [ 
            'driver'  => 'qiniu', 
            'domains' => [ 
                'default'   => '7xqia0.com1.z0.glb.clouddn.com', //你的七牛域名 
                'https'     => 'dn-yourdomain.qbox.me',         //你的HTTPS域名 
                'custom'    => 'static.abc.com',                //Useless 没啥用，请直接使用上面的 default 项 
             ], 
            'access_key'=> '2Dtvc2MVJaM60fh1jcXSUslyL3uS92Boh2mVTzE9',  //AccessKey 
            'secret_key'=> 'QyDRTyOHDuGVs9fG1_GO8h650JHkzItSiWkbCHQk',  //SecretKey 
            'bucket'    => 'lxf-php',  //Bucket名字 
            'notify_url'=> '',  //持久化处理回调地址 
            'access'    => 'public'  //空间访问控制 public 或 private 
        ], 


>>>>>>> 0a21419c72fa2261a5e71228c8b21376a7e1fc4d
    ],

];
