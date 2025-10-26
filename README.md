# Orinex Frontend

AI-Powered Order Processing Automation Platform for Manufacturing Businesses

## 🚀 Features

- **Smart Dashboard** - Real-time order monitoring with progress tracking
- **Visual Template Designer** - Create custom DOCX, XLSX, PDF templates with variables
- **Drag-and-Drop Workflow Builder** - Automate order processing with visual blocks
- **AI Document Generation** - Automatic quotations, invoices, and emails
- **Order Management** - Track orders from inquiry to completion
- **Multi-language Support** - English, Hindi, Marathi

## 💻 Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## 📦 Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── TemplateEditor.tsx
│   ├── WorkflowBuilder.tsx
│   └── WorkflowExecutor.tsx
├── pages/          # Next.js pages
│   ├── dashboard.tsx
│   ├── templates.tsx
│   └── workflows.tsx
├── hooks/          # Custom React hooks
└── styles/         # Global styles
```

## 🎯 Key Components

### Template Editor
- Visual DOCX editing environment
- Dynamic variable system
- Multiple document formats (DOCX, XLSX, PDF, HTML)
- Formatting tools and preview

### Workflow Builder
- Drag-and-drop interface
- 4 block types: Template, Condition, Action, Delay
- Visual connections between blocks
- Real-time configuration panel

### Dashboard
- Order overview and statistics
- Real-time progress tracking
- Urgent order alerts
- Quick action buttons

## 🔄 User Flow

1. **Login** → Dashboard
2. **Create Templates** → Design documents with variables
3. **Build Workflows** → Automate with visual blocks
4. **Process Orders** → Execute workflows automatically
5. **Monitor Progress** → Track in real-time

## 📱 Responsive Design

Optimized for desktop, tablet, and mobile devices.

## 🚀 Deployment

Deploy to Vercel:
```bash
vercel deploy
```

## 📄 License

MIT License
