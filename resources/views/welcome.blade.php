<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">

        <style>
            html, body {
                height: 100%;
            }

            body {
                margin: 0;
                padding: 0;
                width: 100%;
                display: table;
                font-weight: 100;
                font-family: 'Lato';
            }

            .container {
                text-align: center;
                display: table-cell;
                vertical-align: middle;
            }

            .content {
                text-align: center;
                display: inline-block;
            }

            .title {
                font-size: 96px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <div class="title"> 5
                <input type="text" name="captcha" class="form-control" style="width: 300px;">
          <a onclick="javascript:re_captcha();" >
          <img src="{{ URL('kit/captcha/1') }}"  alt="验证码" title="刷新图片" width="100" height="40" id="c2c98f0de5a04167a9e427d883690ff6" border="0"></a>
          <!-- <img src="Kit/captcha/1" alt="123" style="position:absolute;"/> -->
          <img src="http://www.qwe.com/kit/captcha/0.04100106837278816" alt="">
                </div>
            </div>
        </div>
    </body>
</html>
<script>  
  function re_captcha() {
    $url = "{{ URL('kit/captcha') }}";
        $url = $url + "/" + Math.random();
        document.getElementById('c2c98f0de5a04167a9e427d883690ff6').src=$url;
    // obj.parent().find('img').attr('src'.'Kit/captcha/'+Math.ceil(Math.random()*1000));
  }
</script>