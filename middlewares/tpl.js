'use strict'

//ejs与heredoc组合使用
//https://github.com/mde/ejs
var ejs = require('ejs')
//https://github.com/jsdnxx/heredoc
var heredoc = require('heredoc')

// 被动回复用户消息
var tpl = heredoc(function () {
  /* 
  <xml>
    <ToUserName><![CDATA[ <%=ToUserName%>]]></ToUserName>
    <FromUserName><![CDATA[<%=FromUserName%>]]></FromUserName>
    <CreateTime><>%=createTime%</CreateTime>
    <MsgType><![CDATA[<%=msgType%>]]></MsgType>

    <%if(msgType==='text'){%>
    <Content><![CDATA[<%= content%>]]></Content>
    <%}else if(msgType==='text'){%>
    <Image>
      <MediaId><![CDATA[<%=content.media_id%>]]></MediaId>
    </Image>
    <%}else if(msgType==='voice'){%>
    <Voice>
      <MediaId><![CDATA[<%=content.media_id%>]]></MediaId>
    </Voice>
    <%}else if(msgType==='video'){%>
    <Video>
      <MediaId><![CDATA[<%=content.media_id%>]]></MediaId>
      <Title><![CDATA[<%=content.titile%>]]></Title>
      <Description><![CDATA[<%=content.description%>]]></Description>
    </Video>
    <%}else if(msgType==='news'){%>
    <Music>
      <Title><![CDATA[<%=content.title%>]]></Title>
      <Description><![CDATA[<%=content.description%>]]></Description>
      <MusicUrl><![CDATA[<%=content.MUSIC_Url%>]]></MusicUrl>
      <HQMusicUrl><![CDATA[<%=content.HQ_MUSIC_Url%>]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[<%=content.media_id%>]]></ThumbMediaId>
    </Music>
      <%}else if(msgType==='music'){%>
          <ArticleCount><%=content.length%></ArticleCount>
          <Articles>
              <% content.forEach(function(item){%>
              <item>
                  <Title><![CDATA[<%=content.title1%>]]></Title>
                  <Description><![CDATA[<%=content.description1%>]]></Description>
                  <PicUrl><![CDATA[<%=content.picurl%>]]></PicUrl>
                  <Url><![CDATA[<%=content.url%>]]></Url>
              </item>
              <% }) %>
          </Articles>
      <% } %>
    </xml>
  */
})

var compiled = ejs.compile(tpl)
exports = module.exports = {
  compiled
}