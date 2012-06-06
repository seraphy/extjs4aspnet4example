Ext.Loader.setConfig({
    enabled: true
});

Ext.require([
    'Ext.selection.*',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);

// レコードタイプ
Ext.define('MyDataModel', {
    extend: 'Ext.data.Model',
    idProperty: 'rowid', // レコードを一意に決めるIDフィールドの名前、省略時は「id」が使われる.
    fields: [
        { name: 'rowid' }, // ROWID、データベースに関連づけれている場合のみnot-nullとなる
        { name: 'name', convert: NameKanaPair.convert, sortType: 'asNameKanaPair' }, // 名称・カナ
        { name: 'addr'} // 住所
    ]
});

// データストア (インメモリ型)
var store = Ext.create('Ext.data.Store', {
    model: 'MyDataModel',
    data: [],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});

// ページのロードが完了しレンダリングを開始する前に呼び出される
Ext.onReady(function () {

    // カラム定義
    var columnsDef = [
        {
            text: '氏名',
            width: 200,
            sortable: true,
            draggable: false,
            hideable: false,
            dataIndex: 'name',
            renderer: nameKanaRender
        },
        {
            text: '住所',
            width: 300,
            sortable: true,
            draggable: false,
            hideable: false,
            dataIndex: 'addr'
        }
    ];

    // ボタン
    var btnLoad1 = Ext.create('Ext.button.Button', {
        text: '埋め込みデータ',
        disabled: false
    });
    var btnLoad2 = Ext.create('Ext.button.Button', {
        text: 'WebMethodsデータ',
        disabled: false
    });
    var btnLoad3 = Ext.create('Ext.button.Button', {
        text: 'WebService(JSON)データ',
        disabled: false
    });
    var btnClear = Ext.create('Ext.button.Button', {
        text: 'クリア',
        disabled: false
    });
    var btnReset = Ext.create('Ext.button.Button', {
        text: 'リセット',
        disabled: false
    });

    // チェックボックスつきの選択モデル
    var selModel = Ext.create('Ext.selection.CheckboxModel', {
        checkOnly: true
    });

    // グリッド
    var grid = Ext.create('Ext.grid.Panel', {
        columnLines: true,
        store: store,
        stateful: false,
        columns: columnsDef,
        width: 600,
        height: 400,
        padding: 10,
        selModel: selModel,
        renderTo: 'GridPlace', // グリッドの場所をHTML要素のID名で指定
        invalidateScrollerOnRefresh: false, // リロードしたときのスクロールをさせない
        viewConfig: {
            stripeRows: true,
            emptyText: 'データはありません'
        },
        tbar: [
            btnLoad1,
            btnLoad2,
            btnLoad3
        ],
        buttons: [
            btnClear,
            btnReset
        ]
    });

    // ロード1処理 (埋め込み)
    btnLoad1.on('click', function () {
        // 埋め込みデータ
        var data = [
            {
                'rowid': '0001',
                'name': {
                    'name': '東中野同舟会',
                    'nameKana': 'ヒガシナカノドウシュウカイ'
                },
                'addr': '東京都中野区東中野'
            },
            {
                'rowid': '0002',
                'name': {
                    'name': '上社振興会',
                    'nameKana': 'カミヤシロシンコウカイ'
                },
                'addr': '愛知県名古屋市上社'
            },
            {
                'rowid': '0003',
                'name': {
                    'name': '花園連盟',
                    'nameKana': 'ハナゾノレンメイ'
                },
                'addr': '大阪府東大阪市花園'
            },
            {
                'rowid': '0004',
                'name': {
                    'name': '上除東玉苑',
                    'nameKana': 'カミノゾキトウギョクエン'
                },
                'addr': '新潟県長岡市上除'
            }
        ];
        // データのロード
        store.loadData(data);
    });

    // ロード2処理 (WebMethods)
    var loadSeq = 0;
    btnLoad2.on('click', function () {
        // 通信完了までマスクする.
        Ext.getBody().mask();

        // シーケンスをパラメータとしてページのWebMethodsを呼び出す
        var kenmei = "AA";
        PageMethods.LoadData(loadSeq, kenmei,
            function (results, context, methodName) {
                // 成功した場合

                // 現在のデータをクリア
                // 行を消す前にチェックを外さないと全選択チェックが残る.
                selModel.deselectAll();
                store.removeAll();
                store.removed = [];

                // 取得したレコードリストをグリッドに設定する.
                store.loadData(results.datas);

                // スクロールバーを再計算
                grid.invalidateScroller();

                // マスクを解除する
                Ext.getBody().unmask();

                // 次回用のシーケンスを保存する.
                loadSeq = results.nextSeq;
            },
            function onfailure(result) {
                // エラー表示
                alert(result.get_message());
            }
        );
    });

    // ロード3処理 (WebService/JSON)
    btnLoad3.on('click', function () {
        // 通信完了までマスクする.
        Ext.getBody().mask();

        // WebService(ASMX)をJSON形式で呼び出す
        $.ajax({
            type: 'GET',
            url: 'DataGenerator.asmx/BulkNameList',
            data: 'seq=' + loadSeq + '&kenmei="CCC"', // 文字列データは明示的にクォート
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                // 成功した場合
                var results = msg.d;

                // 現在のデータをクリア
                // 行を消す前にチェックを外さないと全選択チェックが残る.
                selModel.deselectAll();
                store.removeAll();
                store.removed = [];

                // 取得したレコードリストをグリッドに設定する.
                store.loadData(results.datas);

                // スクロールバーを再計算
                grid.invalidateScroller();

                // マスクを解除する
                Ext.getBody().unmask();

                // 次回用のシーケンスを保存する.
                loadSeq = results.nextSeq;
            }
        });
    });

    // クリア処理
    btnClear.on('click', function () {
        store.removeAll();
    });

    // リセット処理
    btnReset.on('click', function () {
        store.removeAll();
        loadSeq = 0;
    });
});
