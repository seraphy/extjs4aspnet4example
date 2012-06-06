using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Text;

namespace ExtJSSample
{
    /// <summary>
    /// テストデータの生成.
    /// ※ GET/JSON形式でデータを返却できるようにするためには、
    /// web.configのhttpHandlersでasmxのハンドラをASP.NET4 Ajax対応に
    /// 切り替える必要がある.
    /// </summary>
    [WebService(Namespace = "http://extjssample.seraphyware.jp/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [ScriptService]
    public class DataGenerator : System.Web.Services.WebService
    {

        /// <summary>
        /// 名前とカナのペア
        /// </summary>
        public class NameKanaPair
        {
            public string name { set; get; }
            public string nameKana { set; get; }
        }

        /// <summary>
        /// グリッドの行データ
        /// </summary>
        public class GridLocalRow
        {
            public int rowid { set; get; }
            public NameKanaPair name { set; get; }
            public string addr { set; get; }
        }

        /// <summary>
        /// 結果リスト
        /// </summary>
        public class BulkNameListResult
        {
            public int nextSeq { set; get; }

            public int total { set; get; }

            public GridLocalRow[] datas { set; get; }
        }

        /// <summary>
        /// レコードリストのテストデータをバルク生成する.
        /// </summary>
        /// <param name="seq">生成する個数 - 1の値、0以上</param>
        /// <param name="kenmei">件名</param>
        /// <returns>結果リスト</returns>
        [WebMethod]
        [ScriptMethod(
            UseHttpGet = true,
            ResponseFormat = ResponseFormat.Json,
            XmlSerializeString=false
        )]
        public BulkNameListResult BulkNameList(int seq, string kenmei)
        {
            return BulkNameListPageing(seq, kenmei, 0, 0, int.MaxValue);
        }

        /// <summary>
        /// レコードリストのテストデータをバルク生成する.
        /// ExtJSのページング処理で呼ばれ、ページ範囲を指定してデータを返すことができる.
        /// </summary>
        /// <param name="seq">最大数 + 1, 0以上</param>
        /// <param name="kenmei">件名</param>
        /// <param name="page">ページ番号</param>
        /// <param name="start">取得する開始行</param>
        /// <param name="limit">1ページの行数</param>
        /// <returns></returns>
        [WebMethod]
        [ScriptMethod(
            UseHttpGet = true,
            ResponseFormat = ResponseFormat.Json,
            XmlSerializeString = false
        )]
        public BulkNameListResult BulkNameListPageing(
            int seq, string kenmei, int page, int start, int limit)
        {
            var buf = new StringBuilder();
            buf.Append("seq=" + seq);
            buf.Append(", kenmei=" + kenmei);
            buf.Append(", page=" + page);
            buf.Append(", start=" + start);
            buf.Append(", limit=" + limit);
            System.Diagnostics.Trace.WriteLine(buf.ToString());

            // レコードリスト
            var datas = new List<GridLocalRow>();

            // レコードリストを生成する
            if (!string.IsNullOrWhiteSpace(kenmei))
            {
                for (int idx = 0; idx <= seq; idx++)
                {
                    if (datas.Count > limit)
                    {
                        // 1ページあたりの件数を書き込み終えたら
                        // ここで処理を中断する.
                        break;
                    }

                    if (idx >= start)
                    {
                        // レコードを生成し追加する
                        datas.Add(new GridLocalRow()
                        {
                            // レコードを一意に識別するID
                            rowid = idx,

                            // 名前とカナのペア(複合データ)
                            name = new NameKanaPair()
                            {
                                name = "名前" + kenmei + idx,
                                nameKana = string.Format("ナマエ-{0}-{1,5}", kenmei, idx)
                            },

                            // 単純な文字列データ
                            addr = string.Format("住所{0}{1}番地", kenmei, idx)
                        });
                    }
                }

                // 時間がかかる処理をエミュレート
                System.Threading.Thread.Sleep(1000);
            }

            // 戻り値は、2つのキーをもつオブジェクト
            return new BulkNameListResult()
            {
                nextSeq = datas.Count * 2,
                total = seq,
                datas = datas.ToArray()
            };
        }
    }
}
