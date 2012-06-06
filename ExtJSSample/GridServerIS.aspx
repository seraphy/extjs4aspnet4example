<%@ Page
    Title="ExtJS4 - Grid - Server - WebService連携 - 無限スクロール"
    Language="C#"
    MasterPageFile="~/Site.Master"
    AutoEventWireup="true"
    CodeBehind="GridServerIS.aspx.cs"
    Inherits="ExtJSSample.GridServerIS"
    %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script type="text/javascript" src="NameKanaPair.js"></script>
    <script type="text/javascript" src="GridServerIS.js"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="True">
    </asp:ScriptManager>

    <h1>ExtJS4 - Grid - Server - WebService連携 - 無限スクロール</h1>

    <div id="GridPlace">
    </div>

    <div>
        <a id="A1" runat="server" href="~/">戻る</a>
    </div>
</asp:Content>
