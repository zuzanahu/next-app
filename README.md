# Web application for processing thematic plans
This is an application developed for a <a href="https://theses.cz/id/k9gjgu/STAG102154.pdf?zpet=/vyhledavani/?search%3Dwebov%C3%A1%20aplikace%20pro%20tematick%C3%A9%20pl%C3%A1ny%26start%3D1"> Bachelor's thesis </a>. 

**The application as well as the thesis is in the Czech language.**  

The purpose of this system is easier management of thematic plans. I achieved this by enabling structured editing per subject instead of editing a single document with hundreds of pages. 

Nevertheless, it is still possible to merge subjects into a single document and download it in Tex format (LaTex).

## Application showcase
### Login
The sample user information to login can be found in the seed script in /scripts/seed.ts.
<img width="991" height="425" alt="Pasted Graphic 13" src="https://github.com/user-attachments/assets/c99a9956-2caf-4ac0-9f96-bbe479934a6b" />

### Main page with subjects
<img width="999" height="759" alt="ZdraviZko, John!" src="https://github.com/user-attachments/assets/b25075bf-5096-4d75-b140-968ff30f4b82" />

### Subject
<img width="909" height="389" alt="Predmety" src="https://github.com/user-attachments/assets/749cb458-7962-418b-ac8a-69951647f674" />

### Update document
<img width="947" height="650" alt="Zdravicko, Johne" src="https://github.com/user-attachments/assets/1a1e24eb-3a50-4175-b1f7-08b661dc65ed" />

### User administration
<img width="1031" height="318" alt="Zdravi2ko, John!" src="https://github.com/user-attachments/assets/f27d3c2b-9f59-4b2a-8df4-1918a44a1379" />

### Subject administration
<img width="1027" height="832" alt="Piedmety" src="https://github.com/user-attachments/assets/6348116e-edb5-4069-965e-e07396b9bbc9" />

### Downloading all documents in Tex format
<img width="1026" height="820" alt="Zdravi2ko, John!" src="https://github.com/user-attachments/assets/9bbb7ff2-9ad1-4240-80ff-48ef674a7151" />

<img width="875" height="697" alt="setibst en (Tell)" src="https://github.com/user-attachments/assets/fefbbea7-c50d-41bc-b803-642f83ee8251" />

#### After converting the downloaded file to PDF in any program of choice 
<img width="638" height="1026" alt="Pasted Graphic 20" src="https://github.com/user-attachments/assets/d0734d9f-5b63-4af8-8473-02b815e8a95b" />

## How to run
**Every step or command is to be done in project root if not said otherwise.**
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

