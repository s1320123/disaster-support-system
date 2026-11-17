import sqlite3
import uuid
import json
import redis
import lora_node_sync

# 開発用データベースのみ使用
DB_PATH = "./dev-data/gateway.db"

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row

# LoRaで受信した発注を模擬
pkt_id = "test-" + uuid.uuid4().hex[:12]

record = {
    "source": "LORA_ORDER_ASK",
    "pkt_id": pkt_id,
    "origin_node": "0003",
    "received_by": "0001",
    "item_code": "water",
    "requested_qty": 50,
    "goal_bst": "0",
    "goal_bit_len": 1,
}

try:
    # 発注保存と通知保存を同じトランザクションで実行
    with conn:
        inserted = lora_node_sync.sync_one_order(
            conn, record
        )

        if inserted:
            conn.execute(
                """
                INSERT INTO notifications
                    (node_id, type, title, message)
                VALUES (?, ?, ?, ?)
                """,
                (
                    "0001",
                    "order",
                    "新しい物資の発注",
                    "拠点0003から水50個の要請が届きました",
                ),
            )

    print("発注保存:", inserted)
    print("発注ID:", f"lora-{pkt_id}")

    rows = conn.execute(
        """
        SELECT id, node_id, title, message
        FROM notifications
        WHERE message LIKE ?
        ORDER BY id DESC
        LIMIT 1
        """,
        ("%拠点0003から水50個%",),
    ).fetchall()

    for row in rows:
        print(dict(row))

    # SQLite保存後、Redis経由で通知を配信
    if inserted:
        r = redis.Redis(
            host="127.0.0.1",
            port=6379,
            decode_responses=True
        )

        result = r.publish(
            "event:notification:new",
            json.dumps({
                "node_id": "0001",
                "type": "order",
                "order_id": f"lora-{pkt_id}"
            })
        )

        print("Redis通知先の購読数:", result)
finally:
    conn.close()
