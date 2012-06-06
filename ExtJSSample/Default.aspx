<%@ Page
    Title="ホーム ページ"
    Language="C#"
    MasterPageFile="~/Site.master"
    AutoEventWireup="true"
    CodeBehind="Default.aspx.cs"
    Inherits="ExtJSSample._Default"
%>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>

<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <div>
        <p>menu</p>
        <ul>
            <li><a id="A1" runat="server" href="~/GridLocal.aspx">ExtJS4 - Grid - Local - WebMethods連携</a></li>
            <li><a id="A2" runat="server" href="~/GridServer.aspx">ExtJS4 - Grid - Server - WebService連携</a></li>
            <li><a id="A3" runat="server" href="~/GridServerIS.aspx">ExtJS4 - Grid - Server - WebService連携 - 無限スクロール</a></li>
        </ul>
    </div>
</asp:Content>
