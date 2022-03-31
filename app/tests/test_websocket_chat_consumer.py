import pytest
import json
from django.conf.urls import url
from django.test import TransactionTestCase
from app.models import User, Chat, Message
from app.consumers import ChatConsumer
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from channels.routing import URLRouter


class WebsocketConsumerTest(TransactionTestCase):
    """Tests Websocket Chat Consumer"""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_chat.json',
        'app/tests/fixtures/default_message.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/other_chats.json',
        'app/tests/fixtures/other_messages.json',
    ]

    default_chat_url = "ws/chat/1/"
    application = URLRouter([
        url(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
    ])

    def setUp(self):
        self.user = User.objects.get(username='johndoe')
        self.default_chat = Chat.objects.get(pk=1)
        self.login_data = {
            "username": self.user.username,
            "password": self.user.password,
        }

    @pytest.mark.asyncio
    async def test_connect_to_websocket(self):
        communicator = WebsocketCommunicator(
            application=self.application, path=self.default_chat_url
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        await communicator.disconnect()

    @pytest.mark.asyncio
    async def test_fetch_messages(self):
        communicator = WebsocketCommunicator(
            application=self.application, path=self.default_chat_url
        )
        connected, subprotocol = await communicator.connect()
        assert connected

        await communicator.send_json_to({
            "command": "fetch_messages",
            "username": self.user.username,
            "chatId": self.default_chat.id
        })
        json_response = await communicator.receive_from()
        chat_messages = json.loads(json_response)["messages"]
        self.assertEqual(len(chat_messages), await self._get_chat_messages_count(self.default_chat))

        await communicator.disconnect()

    @pytest.mark.asyncio
    async def test_new_message(self):
        new_message_content = "New Message Content"
        number_of_chat_messages_before = await self._get_chat_messages_count(self.default_chat)
        communicator = WebsocketCommunicator(
            application=self.application, path=self.default_chat_url
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        await communicator.send_json_to({
            "command": "new_message",
            "from": self.user.username,
            "message": new_message_content,
            "chatId": self.default_chat.id
        })
        json_response = await communicator.receive_from()
        new_message = json.loads(json_response)["message"]
        new_message_object = await self._get_chat_message_by_id(new_message.get("id"))
        self.assertEqual(await self._get_message_author(new_message_object), self.user)
        self.assertEqual(await self._get_message_content(new_message_object), new_message_content)
        self.assertIn(new_message_object, await self._get_chat_messages(self.default_chat))
        number_of_chat_messages_after = await self._get_chat_messages_count(self.default_chat)
        self.assertEqual(number_of_chat_messages_after, number_of_chat_messages_before + 1)

        await communicator.disconnect()

    @pytest.mark.asyncio
    async def test_disconnect(self):
        communicator = WebsocketCommunicator(
            application=self.application, path=self.default_chat_url
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        await communicator.disconnect()

    @database_sync_to_async
    def _get_chat_messages_count(self, chat):
        return chat.messages.count()

    @database_sync_to_async
    def _get_chat_messages(self, chat):
        return list(chat.messages.all())

    @database_sync_to_async
    def _get_chat_message_by_id(self, id):
        return Message.objects.get(id=id)

    @database_sync_to_async
    def _get_message_author(self, message):
        return message.author

    @database_sync_to_async
    def _get_message_content(self, message):
        return message.content