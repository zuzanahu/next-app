import { db } from "@/db"

export default async function HomePage() {
  const subjects = await db.query.subjectsTable.findMany()
    return (
        //create a list of subjects
      <ul>
        {subjects.map((subject) =>  {
          return <li key={subject.id}>{subject.name}</li>
        })}
      </ul>  
    )
}