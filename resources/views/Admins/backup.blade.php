@extends('admin.index')
@section("zhuti")
<div id="urHere">DouPHP 管理中心<b>></b><strong>数据备份</strong> </div>   <div class="mainBox" style="height:auto!important;height:550px;min-height:550px;">
    <h3><a href="backup.html?rec=restore" class="actionBtn">恢复备份</a>数据备份</h3>
        <table width="100%" border="0" cellpadding="8" cellspacing="0" class="tableBasic">
     <form name="myform" method="post" action="backup.php?rec=backup">
      <tr>
       <th align="center">
        <input name='chkall' type='checkbox' id='chkall' onclick='selectcheckbox(this.form)' value='check' checked>
       </th>
       <th align="left">数据表名</th>
       <th align="center">类型</th>
       <th align="center">记录数</th>
       <th align="center">数据</th>
       <th align="center">索引</th>
       <th align="center">碎片</th>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_admin checked></td>
       <td align="left">dou_admin</td>
       <td align="center">MyISAM</td>
       <td align="center">1</td>
       <td align="center">84</td>
       <td align="center">2048</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_admin_log checked></td>
       <td align="left">dou_admin_log</td>
       <td align="center">MyISAM</td>
       <td align="center">12</td>
       <td align="center">660</td>
       <td align="center">4096</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_article checked></td>
       <td align="left">dou_article</td>
       <td align="center">MyISAM</td>
       <td align="center">10</td>
       <td align="center">45KB</td>
       <td align="center">2048</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_article_category checked></td>
       <td align="left">dou_article_category</td>
       <td align="center">MyISAM</td>
       <td align="center">2</td>
       <td align="center">140</td>
       <td align="center">2048</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_config checked></td>
       <td align="left">dou_config</td>
       <td align="center">MyISAM</td>
       <td align="center">44</td>
       <td align="center">2284</td>
       <td align="center">1024</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_nav checked></td>
       <td align="left">dou_nav</td>
       <td align="center">MyISAM</td>
       <td align="center">31</td>
       <td align="center">1284</td>
       <td align="center">2048</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_page checked></td>
       <td align="left">dou_page</td>
       <td align="center">MyISAM</td>
       <td align="center">6</td>
       <td align="center">2148</td>
       <td align="center">2048</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_product checked></td>
       <td align="left">dou_product</td>
       <td align="center">MyISAM</td>
       <td align="center">15</td>
       <td align="center">45KB</td>
       <td align="center">2048</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_product_category checked></td>
       <td align="left">dou_product_category</td>
       <td align="center">MyISAM</td>
       <td align="center">5</td>
       <td align="center">384</td>
       <td align="center">2048</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td align="center"><input type=checkbox name=tables[] value=dou_show checked></td>
       <td align="left">dou_show</td>
       <td align="center">MyISAM</td>
       <td align="center">8</td>
       <td align="center">672</td>
       <td align="center">2048</td>
       <td align="center">0</td>
      </tr>
            <tr>
       <td colspan="7" align="right">数据库占用 118 KB </td>
      </tr>
      <tr>
       <td colspan="7" align="center">分卷备份设置</td>
      </tr>
      <tr>
       <td colspan="7" align="center">
        文件名：<input type="text" class="inpMain" name="file_name" value="D20160226T220644" size=30>
        每个分卷文件大小：<input type="text" class="inpMain" name="vol_size" value="2048" size="5">K
       </td>
      </tr>
      <tr>
       <td height="26" colspan="7">
        <input type="hidden" name="token" value="82ace968" />
        <input type="hidden" name="totalsize" value="118">
        <input type="submit" name="submit" class="btn" value="确定备份"  onClick="document.myform.action='backup.php?rec=backup'">
       </td>
      </tr>
     </form>
    </table>
           </div>
 </div>
@endsection