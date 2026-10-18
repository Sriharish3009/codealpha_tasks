import json

from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            self.user_group_name = f"user_{user.id}"

            await self.channel_layer.group_add(
                self.user_group_name,
                self.channel_name
            )

            await self.accept()

        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, "user_group_name"):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

    async def notification_message(self, event):
        print(
            "WEBSOCKET EVENT RECEIVED:",
            event
        )

        await self.send(
            text_data=json.dumps({
                "message": event["message"],
                "notification_type": event["notification_type"],
                "task": event.get("task"),
                "project": event.get("project"),
            })
        )