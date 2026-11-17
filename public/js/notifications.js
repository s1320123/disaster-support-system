
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById(
    "notification-button"
  );
  const panel = document.getElementById(
    "notification-panel"
  );
  const count = document.getElementById(
    "notification-count"
  );
  const unreadLabel = document.getElementById(
    "notification-unread"
  );
  const list = document.getElementById(
    "notification-list"
  );

  button.addEventListener("click", () => {
    panel.hidden = !panel.hidden;

    button.setAttribute(
      "aria-expanded",
      String(!panel.hidden)
    );
  });

  async function loadNotifications() {
    try {
      const response = await fetch("/api/notifications");

      if (!response.ok) {
        throw new Error("通知の取得に失敗");
      }

      const notifications = await response.json();

      const unread = notifications.filter(
        (notification) => notification.is_read === 0
      ).length;

      count.textContent = unread;
      count.hidden = unread === 0;
      unreadLabel.textContent = `未読 ${unread}件`;

      list.replaceChildren();

      if (notifications.length === 0) {
        list.textContent = "通知はありません";
        return;
      }

      notifications.forEach((notification) => {
        const item = document.createElement("div");
        item.className = "notification-item";

        if (notification.is_read === 0) {
          item.classList.add("unread");
        }

        if (notification.type === "emergency") {
          item.classList.add("emergency");
        }

        const title = document.createElement("strong");
        title.textContent = notification.title;

        const message = document.createElement("p");
        message.textContent = notification.message;

        const time = document.createElement("small");
        time.textContent = notification.created_at;

        item.append(title, message, time);
        // 通知をクリックすると既読にする
item.addEventListener("click", async () => {
  if (notification.is_read !== 0) return;

  try {
    const response = await fetch(
      `/api/notifications/${notification.id}/read`,
      { method: "POST" }
    );

    if (!response.ok) {
      throw new Error("既読処理に失敗しました");
    }

    // 最新の通知一覧を読み込む
    await loadNotifications();

  } catch (error) {
    console.error("[NOTIFICATION READ ERROR]", error);
  }
});
        list.appendChild(item);
      });
    } catch (error) {
      console.error("[NOTIFICATION ERROR]", error);
      list.textContent = "通知の取得に失敗しました";
    }
  }

    // Socket.IOでリアルタイム通知を受信
  const socket = io();

  socket.on("notification:new", (notification) => {
    console.log("[NEW NOTIFICATION]", notification);

    // 新しい通知を受信したら一覧を再取得
    loadNotifications();
  });

  // PythonからのLoRa通知を受信したら再読み込み
socket.on("notification:refresh", () => {
  console.log("[LORA NOTIFICATION] Refresh");
  loadNotifications();
});

  socket.on("connect", () => {
    console.log("[SOCKET CONNECTED]", socket.id);
    loadNotifications();
  });

  loadNotifications();
});
