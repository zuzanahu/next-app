import { Editor } from "@/app/components/Editor"

export default async function Page({
    params,
  }: {
    params: Promise<{ documentId: number }>
  }) {
    return (<><h1>My Page {(await params).documentId} hsshs</h1>
    <Editor></Editor></>)
  }