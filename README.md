# Thematic Plans Web App

A full-stack web platform for managing structured thematic plans (educational documents) and subjects.

> [!NOTE]
> Built as a Bachelor’s thesis project

## About the Project

This application was created to modernize the management of thematic plans used at my high school.

Instead of maintaining one large document with hundreds of pages, the system separates content into individual subjects with structured editing, easier maintenance, and clearer organization.

The platform also supports merging subjects into a single exportable LaTeX (TeX) document.

## Tech Stack
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **ORM**: Drizzle ORM
- **Libraries**: React, Tiptap, Zod
- **Infrastructure**: Docker (for containerizing the database)
- **Export Engine**: Custom Tiptap JSON to LaTeX (TeX) converter

## Features
### Admin Panel
- Authentication with protected routes
- User management and administration
- Subject management (create, edit, delete)
- Centralized dashboard for thematic plans
- Structured editing per subject
- Clean admin workflow for school staff

### Document Management
- Replace large monolithic files with modular subject content
- Edit plans per subject independently
- Merge multiple subjects into one final document
- Download generated content in TeX format

### Architecture Highlights
- Structured data storage instead of static documents
- Modular document generation pipeline
- Designed for future expansion and easier maintenance

## Application Showcase
### Login

Demo credentials can be found in /scripts/seed.ts

<img width="991" height="425" alt="Login screen" src="https://github.com/user-attachments/assets/c99a9956-2caf-4ac0-9f96-bbe479934a6b" />

### Main Dashboard
<img width="999" height="759" alt="Dashboard" src="https://github.com/user-attachments/assets/b25075bf-5096-4d75-b140-968ff30f4b82" />

### Subject Detail
<img width="909" height="389" alt="Subject detail" src="https://github.com/user-attachments/assets/749cb458-7962-418b-ac8a-69951647f674" />

### Document Editor
<img width="947" height="650" alt="Editor" src="https://github.com/user-attachments/assets/1a1e24eb-3a50-4175-b1f7-08b661dc65ed" />

### User Administration
<img width="1031" height="318" alt="Users" src="https://github.com/user-attachments/assets/f27d3c2b-9f59-4b2a-8df4-1918a44a1379" />

### Subject Administration
<img width="1027" height="832" alt="Subjects admin" src="https://github.com/user-attachments/assets/6348116e-edb5-4069-965e-e07396b9bbc9" />

### Export to TeX
<img width="1026" height="820" alt="Export" src="https://github.com/user-attachments/assets/9bbb7ff2-9ad1-4240-80ff-48ef674a7151" /> <img width="875" height="697" alt="TeX file" src="https://github.com/user-attachments/assets/fefbbea7-c50d-41bc-b803-642f83ee8251" />
### The TeX content converted to PDF
<img width="638" height="1026" alt="PDF result" src="https://github.com/user-attachments/assets/d0734d9f-5b63-4af8-8473-02b815e8a95b" />

## Getting started
> [!TIP]
> Every step or command should be executed in project root

- Install Node.js
- Setup MySQL database via Docker (or other, in this example I use Docker)
  - Install Docker
  - Run Docker
  - Run command `docker compose up -d`
  - Create file .env and input: <img width="567" height="25" alt="DATABASE_URL=mysglrootpwd2@localhost3306db" src="https://github.com/user-attachments/assets/e1ed8bcd-f5c6-4e50-a45c-a17cb6154b41" />
  Optionally other credentials but they have to be changed in compose.yaml.
- Run `npm i` to install dependencies
- Run `npm run build`
- Run `npx drizzle-kit push` to create the database tables
- Run `npm run seed` to seed the database with data
- Run `npm run start` and then open the application in your browser at an address `http://localhost:3000`

## Roadmap
- Drag-and-drop subject ordering
- PDF export directly from the app
- Logic to reuse old thematic plans for a new school year
