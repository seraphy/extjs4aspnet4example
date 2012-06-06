using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;

namespace ExtJSSample
{
    /// <summary>
    /// ExtJS4 - Grid - Local - WebMethods連携
    /// </summary>
    public partial class GridLocal : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        /// <summary>
        /// ScriptManager.EnablePageMethodsをtrueに設定した場合、
        /// JavaScript側から、PageRequestManager経由で、このメソッドを呼び出すことができる。
        /// </summary>
        /// <param name="seq">JavaScript側からのパラメータ</param>
        /// <returns>JavaScriptに返すデータ</returns>
        [WebMethod]
        public static object LoadData(int seq, string kenmei)
        {
            var dg = new DataGenerator();
            return dg.BulkNameList(seq, kenmei);
        }
    }
}