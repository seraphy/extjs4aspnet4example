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
var itemsPerPage = 20;

// データストア (Ajax)
var store = Ext.create('Ext.data.Store', {
    model: 'MyDataModel',
    pageSize: itemsPerPage,
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
    autoload: false
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

    // クリア
    var btnClear = Ext.create('Ext.button.Button', {
        text: 'クリア',
        disabled: false
    });

    // ページングツールバー
    var paging = Ext.create('Ext.toolbar.Paging', {
        store: store,
        pageSize: itemsPerPage
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
        renderTo: 'GridPlace', // グリッドの場所をHTML要素のID名で指定
        viewConfig: {
            stripeRows: true,
            emptyText: 'データはありません'
        },
        tbar: [
            btnLoadA,
            btnLoadB,
            btnClear
        ],
        bbar: paging
    });

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

    // ロード処理(A) 件数大
    btnLoadA.on('click', function () {
        loadSeq = 1111;
        kenmei = 'aaa';
        store.removeAll();
        store.load();
        paging.moveFirst();
    });

    // ロード処理(B) 件数少
    btnLoadB.on('click', function () {
        loadSeq = 111;
        kenmei = 'bbb';
        store.removeAll();
        store.load();
        paging.moveFirst();
    });

    // クリア
    // (ページング使用時、ページングをリセットする方法がないため
    // 空データの読み込みでクリアとする。)
    btnClear.on('click', function () {
        loadSeq = 0;
        kenmei = "";
        store.removeAll();
        store.load();
        paging.moveFirst();
    });
});
