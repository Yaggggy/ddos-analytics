# from typing import List
# from fastapi import WebSocket

# class ConnectionManager:
#     def __init__(self):
#         self.active: List[WebSocket] = []
#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active.append(websocket)
#     def disconnect(self, websocket: WebSocket):
#         if websocket in self.active:
#             self.active.remove(websocket)
#     async def broadcast(self, message: dict):
#         dead = []
#         for ws in self.active:
#             try:
#                 await ws.send_json(message)
#             except:
#                 dead.append(ws)
#         for d in dead:
#             self.disconnect(d)

# manager = ConnectionManager()


from typing import List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active: List[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active.append(websocket)
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active:
            self.active.remove(websocket)
    async def broadcast(self, message: dict):
        dead = []
        for ws in self.active:
            try:
                await ws.send_json(message)
            except:
                dead.append(ws)
        for d in dead:
            self.disconnect(d)

manager = ConnectionManager()
