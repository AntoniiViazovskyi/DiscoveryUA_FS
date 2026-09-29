import PopularLocationsBlock from "@/components/PopularLocationsBlock/PopularLocationsBlock";


export default function HomePage() {
  return (
    <main className="workspace container">
      <p className="eyebrow">Final Team Project</p>
      <h1>Frontend workspace is ready.</h1>
      <p>
        The shared structure and dependencies are configured. Replace this page
        when product development begins.
      </p>
      <PopularLocationsBlock/>
    </main>
  )
}
