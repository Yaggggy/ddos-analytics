# from fastapi import WebSocket, WebSocketDisconnect
# from fastapi import APIRouter

# router = APIRouter()
# clients = []

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: list[WebSocket] = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections.remove(websocket)

#     async def broadcast(self, data: dict):
#         for connection in self.active_connections:
#             await connection.send_json(data)

# manager = ConnectionManager()

# @app.websocket("/ws")
# async def websocket_endpoint(ws: WebSocket):
#     await manager.connect(ws)
#     try:
#         while True:
#             try:
#                 await ws.receive_text()  # optional, ignore content
#             except:
#                 pass
#     except Exception as e:
#         manager.disconnect(ws)


class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, data):
        # Broadcast new incidents to all connected clients
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except:
                self.disconnect(connection)

manager = ConnectionManager()
