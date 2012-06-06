<%@ Page
    Title="ExtJS4 - Grid - Local - WebMethods連携"
    Language="C#"
    MasterPageFile="~/Site.Master"
    AutoEventWireup="true"
    CodeBehind="GridLocal.aspx.cs"
    Inherits="ExtJSSample.GridLocal"
%>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script type="text/javascript" src="NameKanaPair.js"></script>
    <script type="text/javascript" src="GridLocal.js"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
<div>
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="True">
    </asp:ScriptManager>

    <h1>ExtJS4 - Grid - Local - WebMethods連携</h1>

    <div id="GridPlace">
    </div>

    <div>
        <a runat="server" href="~/">戻る</a>
    </div>
</div>
</asp:Content>
