import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* NavBar removed - already handled in __root.tsx */}

      <section className="w-full bg-sky-50 border-b-2 border-b-sky-200 px-6 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-semibold text-4xl lg:text-6xl leading-tight">
              Effortless Group Expense Splitting
            </h1>
            <h4 className="mt-4 text-xl lg:text-2xl text-gray-700">
              Stop Chasing. Start Sharing. Build Trust.
            </h4>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              src="https://dfjx2uxqg3cgi.cloudfront.net/img/photo/159777/159777_00_2x.jpg?20181118020024"
              alt="Friends smiling and enjoying dinner"
              className="rounded-md shadow-md object-cover"
            />
          </div>
        </div>
      </section>

      <section className="flex-1 bg-white py-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="border border-sky-200 rounded-md bg-sky-50 p-6 shadow-sm">
            <h2 className="font-semibold text-2xl text-center mb-3">
              Track & Settle!
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Secure Logins & Groups</li>
              <li>Automatic Tracking</li>
              <li>Instant Settlement Requests</li>
            </ul>
          </div>

          <div className="border border-sky-200 rounded-md bg-sky-50 p-6 shadow-sm">
            <h2 className="font-semibold text-2xl text-center mb-3">
              Fairness & Fun!
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Smart Insights & Fairness Analyzer</li>
              <li>Track Spending Habits</li>
              <li>Get Started Free</li>
            </ul>
          </div>

          <div className="border border-sky-200 rounded-md bg-sky-50 p-6 shadow-sm">
            <h2 className="font-semibold text-2xl text-center mb-3">
              Seamless & Transparent!
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>All-in-One Platform</li>
              <li>Built-in Chat & Notifications</li>
              <li>Exportable Reports</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
