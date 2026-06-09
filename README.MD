# 高校成绩录入系统

Flask + React 实现的高校成绩系统，支持教师录入成绩、学生自助查询、绩点计算和成绩申诉处理。

## 功能

- 教师成绩录入：维护学生、课程、学分、成绩、学期和任课教师。
- 学生成绩查询：按学号查询成绩单、平均分、已获学分和 GPA。
- 绩点计算：后端统一按百分制成绩换算等级和 4.0 绩点。
- 成绩申诉：学生提交申诉，教师查看并处理通过或驳回。
- 模块化结构：后端拆分为 routes、services、models，前端拆分为 api、components、pages。

## 目录结构

```text
backend/
  app/
    routes/       # Flask API 蓝图
    services/     # 成绩、绩点、申诉业务逻辑
    utils/        # 参数校验
    models.py     # SQLAlchemy 模型
  run.py
  Dockerfile
frontend/
  src/
    api/          # 请求客户端
    components/   # 通用组件
    pages/        # 业务页面
  Dockerfile
docker-compose.yml
```

## Docker 启动

```bash
docker compose up --build
```

访问地址：

- 前端：http://localhost:5173
- 后端健康检查：http://localhost:5000/api/health

系统首次启动会自动创建 SQLite 数据库并写入演示数据。可用演示学号：`20240001`、`20240002`、`20240003`。

## 本地开发

后端：

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

前端：

```bash
cd frontend
npm install
npm run dev
```

如需连接本地后端，可在前端设置：

```bash
set VITE_API_BASE_URL=http://127.0.0.1:5000/api
```

## API 摘要

- `GET /api/health`：健康检查。
- `GET /api/grades`：成绩列表。
- `POST /api/grades`：录入成绩。
- `PUT /api/grades/<id>`：更新成绩。
- `GET /api/students/<student_no>/transcript`：查询学生成绩单和 GPA。
- `GET /api/appeals`：申诉列表。
- `POST /api/appeals`：提交申诉。
- `PATCH /api/appeals/<id>`：处理申诉。
