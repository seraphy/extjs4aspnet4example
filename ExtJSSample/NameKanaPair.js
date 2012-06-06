// 名前と読み仮名のペアの型
Ext.define('NameKanaPair', {
    name: null, // 名前
    nameKana: null,  // 名前カナ
    statics: {
        // プリミティブなオブジェクトから当モデルを構築
        convert: function (v, rec) {
            var inst = Ext.create('NameKanaPair');
            inst.name = v.name;
            inst.nameKana = v.nameKana;
            return inst;
        }
    }
});

// NameKanaPair型のソートタイプを追加
// (表示は名前、ソート順は読み仮名であるような場合を想定)
Ext.apply(Ext.data.SortTypes, {
    asNameKanaPair: function (v) {
        if (v) {
            if (v.nameKana) {
                return v.nameKana;
            }
            if (v.name) {
                return v.name;
            }
        }
        return "";
    }
});

// 名前と読み仮名ペアのレンダラー
// (名前とカナのペアオブジェクトを1つのセルに描画するためのもの)
function nameKanaRender(rec, metadata, record, rowIndex, colIndex, store) {
    // 名前とカナに分離
    var name = "";
    var kana = "";
    if (rec) {
        name = rec.name;
        kana = rec.nameKana;
    }

    return "<span title=\"" + kana + "\">" + name + "</span>";
}
