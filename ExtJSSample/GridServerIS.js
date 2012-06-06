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

// ページリミット
var itemsPerPage = 500;

// データストア (Ajax)
var store = Ext.create('Ext.data.Store', {
    model: 'MyDataModel',
    pageSize: itemsPerPage,
    buffered: true, // バッファとプリフェッチを有効化
    remoteSort: true, // サーバー側でソートする.
    proxy: {
        type: 'ajax',
        // armx(webservice)のURLを指定する.
        url: 'DataGenerator.asmx/BulkNameListPageing',
        // リクエストパラメータを指定する.
        // これに加えて、_dc, page, start, limitなどの引数が付与される.
        extraParams: {
            seq: 0,
            kenmei: ""
        },
        // JSON応答であることをasmxに通知する.
        headers: {'Content-type': 'application/json'},
        reader: {
            type: 'json',
            // 返却されるレコードリスト本体の位置を指定する.
            root: 'd.datas',
            totalProperty: 'd.total'
        }
    },
    autoLoad: false
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

    // ボタンA
    var btnLoadA = Ext.create('Ext.button.Button', {
        text: 'ロード(A)',
        disabled: false
    });

    // ボタンB
    var btnLoadB = Ext.create('Ext.button.Button', {
        text: 'ロード(B)',
        disabled: false
    });

    // ボタンC
    var btnLoadC = Ext.create('Ext.button.Button', {
        text: 'ロード(C)',
        disabled: false
    });

    // ボタンクリア
    var btnClear = Ext.create('Ext.button.Button', {
        text: 'クリア',
        disabled: false
    });

    // グリッド
    var grid = Ext.create('Ext.grid.Panel', {
        columnLines: true,
        verticalScrollerType: 'paginggridscroller',
        invalidateScrollerOnRefresh: false,
        store: store,
        stateful: false,
        columns: columnsDef,
        width: 600,
        height: 400,
        padding: 10,
        renderTo: 'GridPlace', // グリッドの場所をHTML要素のID名で指定
        viewConfig: {
            stripeRows: true,
            emptyText: 'データはありません'
        },
        tbar: [
            btnLoadA,
            btnLoadB,
            btnLoadC,
            btnClear
        ]
    });

    // store内に保持するデータ件数
    store.guaranteeRange(0, itemsPerPage - 1);

    // ロード処理前イベントハンドラ
    var loadSeq = 0;
    var kenmei = "";
    store.on('beforeload', function () {
        // ロード前に送信するパラメータを調整する.
        // 文字列を送信する場合はQueryStringでも前後にダブルクォート
        // がないとASP.NET側で受け取れないため、明示的に付与する.
        store.proxy.extraParams = {
            seq: loadSeq,
            kenmei: '"' + kenmei + '"'
        };
    });

    // データのリロード用
    var reload = function (fn) {
        // ストアのデータ破棄
        var oldpagecount = store.purgePageCount;
        store.purgePageCount = 0;
        store.purgeRecords();
        store.purgePageCount = oldpagecount;

        // ロード処理
        fn();

        // スクロールバーを再計算
        // TODO: ロード完了後に設定する必要あり.
        grid.invalidateScroller();
        grid.setScrollTop(0);
    };

    // クリア
    var clear = function () {
        reload(function () {
            loadSeq = 0;
            kenmei = "";
            store.load();
        });
    };

    // ロード処理(A) 件数大
    btnLoadA.on('click', function () {
        reload(function () {
            loadSeq = 11111;
            kenmei = "A";
            store.removeAll();
            store.load();
        });
    });

    // ロード処理(B) 件数中
    btnLoadB.on('click', function () {
        reload(function () {
            loadSeq = 1111;
            kenmei = "B";
            store.removeAll();
            store.load();
        });
    });

    // ロード処理(C) 件数少
    btnLoadC.on('click', function () {
        reload(function () {
            loadSeq = 111;
            kenmei = "C";
            store.removeAll();
            store.load();
        });
    });

    // クリア
    btnClear.on('click', clear);
});
