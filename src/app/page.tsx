
import { db } from "../db";
import { usersTable } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  async function login(formData: FormData) {
    'use server'
  
    const rawFormData = {
      email: formData.get('email'),
      password: formData.get('password')
    }
  
    const user = await db.query.usersTable.findFirst({
      //rawFormData.email?.toString()??"" if it is email then convert the input to string if it is null then convert it to empty string ""
      where: eq(usersTable.email, rawFormData.email?.toString()??""),
    });
  
    //pokud to nenajde usera rict ze ma spatny mail
    console.log(rawFormData.email)
    console.log(rawFormData.password)

    console.log(user?.email)
    console.log(user?.password)
  
    const password = user?.password
  
    if (password != rawFormData.password) {
      const errorMessage = "You have a wrong pasword"
      console.log(errorMessage)
    } else {
      const cookieStore = await cookies()
 
      cookieStore.set('signedIn', 'true', {httpOnly: true, secure:true})

      redirect('/stranka')
  
    }
  
  }
  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
      <form action={login}>
        <input type="email" placeholder="Email" name="email" required/>
        <input type="password" placeholder="Password" name="password" required/>
        <button type="submit">submit</button>
      </form>
      
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
      </div>
  );
}
